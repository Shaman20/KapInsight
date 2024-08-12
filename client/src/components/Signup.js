import { useState, useEffect } from "react";
import { signupFields } from "../constants/formFields";
import FormAction from "./FormAction";
import Input from "./Input";
import { useNavigate } from "react-router-dom";

const fields = signupFields;
let fieldsState = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  phoneNumber: undefined,
  age: undefined,
  password: "",
  isOnline: false,
};

export default function SignUp() {
  const [signupState, setSignupState] = useState(fieldsState);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [count, setCount] = useState(3);
  const navigate = useNavigate();

  const { firstName, lastName, emailAddress, phoneNumber, age, password } =
    signupState;

  useEffect(() => {
    if (showModal) {
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            navigate("/");
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showModal, navigate]);

  const handleChange = (e) =>
    setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(
        "http://localhost:4000/v1/api/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress,
            phoneNumber: phoneNumber,
            age: age,
            password: password,
          }),
        }
      );

      const data = response.clone();

      if (!response.ok) {
        const errorData = response.clone();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      console.log("Created user successful:", data);
      setShowModal(true);
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message || "An unexpected error occurred");
    }
  };

  return (
    <>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {!showModal ? (
          <div className="">
            {fields.map((field) => (
              <Input
                key={field.id}
                handleChange={handleChange}
                value={signupState[field.id]}
                labelText={field.labelText}
                labelFor={field.labelFor}
                id={field.id}
                name={field.name}
                type={field.type}
                isRequired={field.isRequired}
                placeholder={field.placeholder}
              />
            ))}
            {error && <p className="text-red-500">{error}</p>}
            <FormAction handleSubmit={handleSubmit} text="Signup" />
          </div>
        ):( 
          <div className="fixed z-10 inset-0 overflow-y-auto align-middle " >
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-slate-50 p-6 rounded-lg shadow-lg w-1/4">
              <h2 className="text-lg font-medium text-gray-900 text-center	">
                SignUp Successful !
              </h2>
              <p className="mt-2 text-sm text-gray-600 text-center">
                You will be redirected to the login page in <b>{count}</b>...
              </p>
            </div>
          </div>
        </div>
         )} 
      </form>
    </>
  );
}
