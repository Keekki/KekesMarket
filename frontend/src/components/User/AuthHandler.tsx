import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import GoogleIcon from "@mui/icons-material/Google";
import { UserContext } from "./UserContext";

interface DecodedToken {
  id: string;
  email?: string;
  exp?: number;
  iat?: number;
}

const AuthHandler: React.FC = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const tokenProcessed = useRef(false); // Using useRef to prevent the function to be called twice

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token && !tokenProcessed.current) {
      tokenProcessed.current = true;
      localStorage.setItem("token", token);
      verifyAndFetchUserDetails(token);
    }
  }, []);

  const verifyAndFetchUserDetails = async (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/details/${decoded.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        toast.success("Logged in via Google!", {
          icon: <GoogleIcon style={{ color: "black" }} />,
          style: {
            border: "1px solid black",
            padding: "16px",
            color: "black",
            background: "white",
            fontFamily: "Courier New",
          },
        });
        navigate("/");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Failed to authenticate. Please try again.");
    }
  };

  return null; // This component does not render anything
};

export default AuthHandler;
