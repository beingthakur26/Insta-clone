/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "../nav.scss";

const Nav = () => {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔹 Check login status when Nav loads
  const checkAuth = async () => {
    try {
      await axios.get(
        "http://localhost:3000/api/auth/get-me",
        { withCredentials: true }
      );
      setIsLoggedIn(true);  // token valid
    } catch {
      setIsLoggedIn(false); // 401 means not logged in
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      setIsLoggedIn(false); // update UI immediately
      navigate("/");

    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <nav className="navbar">

      <div className="nav-left">
        <h2 className="logo" onClick={() => navigate("/feed")}>
          InstaClone
        </h2>
      </div>

      <div className="nav-center">
        {isLoggedIn && (
          <>
            <NavLink to="/feed" className="nav-link">
              Feed
            </NavLink>

            <NavLink to="/createpost" className="nav-link">
              Create
            </NavLink>

            <NavLink to="/profile" className="nav-link">
              Profile
            </NavLink>
          </>
        )}
      </div>

      <div className="nav-right">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        ) : (
          <>
            <button onClick={() => navigate("/")} className="logout-btn">
              Login
            </button>
            <button onClick={() => navigate("/register")} className="logout-btn">
              Signup
            </button>
          </>
        )}
      </div>

    </nav>
  );
};

export default Nav;