import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "./components/User/UserContext";
import Header from "./components/Header";
import HomePage from "./pages/HomePage/HomePage";
import LoginForm from "./components/Forms/children/LoginForm";
import SignUpForm from "./components/Forms/children/SignUpForm";
import AboutUs from "./pages/AboutUs";
import AuthHandler from "./components/AuthHandler";

const App: React.FC = () => {
  return (
    <UserContextProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/auth-handler" element={<AuthHandler />} />
        </Routes>
        <Toaster position="top-right" reverseOrder={false} />
      </Router>
    </UserContextProvider>
  );
};

export default App;
