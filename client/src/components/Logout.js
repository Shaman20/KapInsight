import React from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <button
        type="button"
        className="bg-transparent text-blue-700 font-semibold hover:text-white py-2 px-6 rounded-lg hover:bg-blue-600 border border-blue-500 hover:border-transparent transition duration-300"
        onClick={handleLogOut}
      >
        Logout
      </button>
    </>
  );
};

export default Logout;
