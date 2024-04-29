import React, { createContext, useState, useEffect, ReactNode } from "react";

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

// Providing a default value that matches the context type
const defaultContextValue: UserContextType = {
  user: null,
  setUser: () => {},
  logoutUser: () => {},
};

export const UserContext = createContext<UserContextType>(defaultContextValue);

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
    }
  }, []);

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
