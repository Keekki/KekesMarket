import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AboutUs from "./pages/AboutUs";
import Header from "./components/Header";
import HomePage from "./pages/HomePage/HomePage";
import LoginForm from "./components/Forms/children/LoginForm";
import SignUpForm from "./components/Forms/children/SignUpForm";
import { UserContextProvider } from "./components/User/UserContext";

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
        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
      </Router>
    </UserContextProvider>
  );
};

export default App;
