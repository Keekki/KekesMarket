import React, { createContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";

interface User {
  id: string;
  token: string;
  name: string;
  admin?: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logoutUser: () => void;
}

const defaultContextValue: UserContextType = {
  user: null,
  setUser: () => {},
  logoutUser: () => {},
};

export const UserContext = createContext<UserContextType>(defaultContextValue);

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserState({ ...parsedUser, token: storedToken });
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
      }
    }
  }, []);

  const setUser = (userData: User | null) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUserState(userData);
    } else {
      localStorage.removeItem("user");
      setUserState(null);
    }
  };

  const logoutUser = () => {
    setUser(null);
    toast.success("Hope to see you again! :)", {
      style: {
        border: "1px solid black",
        padding: "16px",
        color: "black",
        background: "white",
      },
      iconTheme: {
        primary: "black",
        secondary: "white",
      },
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
