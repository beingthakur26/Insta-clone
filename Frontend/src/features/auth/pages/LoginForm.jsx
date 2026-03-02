import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/form.scss";
import { useAuth } from "../hooks/useAuth";

const LoginForm = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await handleLogin(email, password);
      navigate("/feed");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__logo">Instagram</h1>

        <form className="auth__form" onSubmit={handleFormSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Log In</button>
        </form>
      </div>

      <div className="auth__switch">
        Don't have an account?
        <Link to="/register"> Sign up</Link>
      </div>
    </div>
  );
};

export default LoginForm;