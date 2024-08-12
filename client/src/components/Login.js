import { useState } from "react";
import { loginFields } from "../constants/formFields";
import Input from "./Input";
import FormAction from "./FormAction";
import { useAuth } from "./AuthContext";

const fields = loginFields;
const fieldsState = {
  emailAddress: "",
  password: "",
};

export default function LogIn() {
  const [loginState, setLoginState] = useState(fieldsState);
  const [error, setError] = useState("");
  const { emailAddress, password } = loginState;
  const { login } = useAuth();

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:4000/v1/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress: emailAddress,
          password: password,
        }),
      });

      const data = await response.json();
      const { result: { token ,user:{firstName}} } = data
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      login(token,firstName); 
      // navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      setError("UserName and Password does not match .. ");
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={loginState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-center	">{error}</p>}
      <FormAction handleSubmit={handleSubmit} text="Login" />
    </form>
  );
}
