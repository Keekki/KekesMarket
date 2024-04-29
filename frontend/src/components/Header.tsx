import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";

import { UserContext } from "./User/UserContext";
import UserMenuPopup from "./User/UserMenuPopup";
import "../styling/Header.css";

const Header: React.FC = () => {
  const { user, logoutUser } = useContext(UserContext);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <header className={`header ${isHomePage ? "homepage" : "other"}`}>
      <Link to="/" className="logo-link">
        <div className="logo">MarketPlace</div>
      </Link>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/search">Search</Link>
          </li>
          <li>
            <Link to="/about">About us</Link>
          </li>
          <li className="login-li">
            {user ? (
              <div className="user-menu">
                {user.name}
                <FontAwesomeIcon icon={faUser} className="login-icon" />
                <UserMenuPopup user={user} handleLogout={handleLogout} />
              </div>
            ) : (
              <Link to="/login" className="login-link">
                Log In
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  className="login-icon"
                />
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
