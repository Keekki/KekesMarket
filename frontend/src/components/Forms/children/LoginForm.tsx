import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../User/UserContext";
import Form from "../parent/Form";
import toast from "react-hot-toast";

interface LoginFormProps {}

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const navigate = useNavigate();
  const { setUser, logoutUser } = useContext(UserContext);
  const [_error, setError] = useState<string>("");

  const logoutTimer = 30 * 60 * 1000; // 30 minutes

  useEffect(() => {
    const events = ["click", "mousemove", "keypress", "scroll", "touchstart"];
    let timeoutId: string | number | NodeJS.Timeout | undefined;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logoutUser(); // Use logoutUser from context
        navigate("/login");
      }, logoutTimer);
    };

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); // Initialize timer on component mount

    return () => {
      clearTimeout(timeoutId); // Clear timeout on component unmount
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [logoutUser, navigate]);

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
        toast.success("Logged in!", {
          style: {
            border: "1px solid black",
            padding: "16px",
            color: "black",
            background: "white",
            fontFamily: "Courier New",
          },
          iconTheme: {
            primary: "black",
            secondary: "white",
          },
        });
        navigate("/");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while logging in. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <Form
      fields={fields}
      submitHandler={handleLoginSubmit}
      submitLabel="Log In!"
      title="Log In!"
      onGoogleLogin={handleGoogleLogin}
    />
  );
};

export default LoginForm;
