import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";

import { UserContext } from "./User/UserContext";
import AccountMenu from "./User/AccountMenu";
import "../styling/Header.css";

const Header: React.FC = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
                <span onClick={handleUserMenuClick}>{user.name}</span>
                <FontAwesomeIcon icon={faUser} className="login-icon" />
                <AccountMenu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                />
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
