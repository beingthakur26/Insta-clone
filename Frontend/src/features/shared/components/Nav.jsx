/* eslint-disable react-hooks/set-state-in-effect */
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../nav.scss";
import { useAuth } from "../../auth/hooks/useAuth";
const Nav = () => {

  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  const isLoggedIn = !!user;

  const logoutAndRedirect = async () => {
    try {
      await handleLogout();
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
          <button onClick={logoutAndRedirect} className="logout-btn">
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