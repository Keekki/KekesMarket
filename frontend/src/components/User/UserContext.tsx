import React, { createContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";

// Interface for the user data structure
interface User {
  id: string;
  token: string;
  name: string;
  admin?: boolean;
}

// Interface for the context type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logoutUser: () => void;
}

// Default values for the context
const defaultContextValue: UserContextType = {
  user: null,
  setUser: () => {},
  logoutUser: () => {},
};

// Creating the UserContext with default values
export const UserContext = createContext<UserContextType>(defaultContextValue);

// Provider component for UserContext
export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Effect to load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const token = parsedUser.token || storedToken;
        setUserState({ ...parsedUser, token });
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
      }
    } else if (storedToken) {
      // If only the token is stored, create a minimal user object
      setUserState({ id: "", name: "", token: storedToken });
    }
    setLoading(false);
  }, []);

  // Function to update user state and localStorage
  const setUser = (userData: User | null) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
      setUserState(userData);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUserState(null);
    }
  };

  // Function to handle user logout
  const logoutUser = () => {
    setUser(null);
    toast.success("Hope to see you again! :)", {
      icon: <EmojiPeopleIcon style={{ color: "black" }} />,
      style: {
        border: "1px solid black",
        padding: "16px",
        color: "black",
        background: "white",
        fontFamily: "Courier New",
      },
    });
  };

  // Providing the context value to child components
  return (
    <UserContext.Provider value={{ user, setUser, logoutUser }}>
      {!loading && children}
    </UserContext.Provider>
  );
};
