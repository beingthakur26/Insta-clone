import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/form.scss";
import { useAuth } from "../hooks/useAuth";     

const RegistrationForm = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { handleRegister, loading } = useAuth();

  const navigate = useNavigate();

  if(loading) {
    return <div>Loading...</div>;
  }

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault(); // stop page reload
  //   await handleRegister(username, email, password)
  //     .then((res) => {
  //       navigate("/feed");
  //       // Registration successful, you can redirect the user or show a success message
  //       console.log("Registration successful", res);
  //     })
  //     .catch((error) => {
  //       console.error("Registration failed:", error);
  //     });
  // };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await handleRegister(username, email, password);
      navigate("/feed");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__logo">Instagram</h1>

        <form className="auth__form" onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

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

          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div className="auth__switch">
        Already have an account?
        <Link to="/"> Log in</Link>
      </div>
    </div>
  );
};

export default RegistrationForm;