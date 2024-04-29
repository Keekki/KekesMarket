import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../User/UserContext";
import Form from "../parent/Form";

interface LoginFormProps {}

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState<string>("");

  const fields = [
    { name: "email", label: "Email", required: true, type: "email" },
    { name: "password", label: "Password", required: true, type: "password" },
  ];

  const handleLoginSubmit = async (values: LoginFormValues) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/login`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setUser(data);
        navigate("/");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <Form
      fields={fields}
      submitHandler={handleLoginSubmit}
      submitLabel="Log In!"
      title="Log In!"
    />
  );
};

export default LoginForm;
