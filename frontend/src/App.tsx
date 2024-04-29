import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AboutUs from "./pages/AboutUs";
import Header from "./components/Header";
import LoginForm from "./components/Forms/children/LoginForm";
import SignUpForm from "./components/Forms/children/SignUpForm";
import { UserContextProvider } from "./components/User/UserContext";

const App: React.FC = () => {
  return (
    <UserContextProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/aboutus" element={<AboutUs />} />
        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
      </Router>
    </UserContextProvider>
  );
};

export default App;
