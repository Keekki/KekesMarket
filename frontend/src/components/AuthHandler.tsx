import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "./User/UserContext";
import { toast } from "react-hot-toast";

interface DecodedToken {
  id: string;
  email?: string;
  exp?: number;
  iat?: number;
}

const AuthHandler: React.FC = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
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
        toast.success("Logged in via Google!");
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
