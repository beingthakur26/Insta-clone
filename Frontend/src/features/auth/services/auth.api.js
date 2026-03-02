import axios from "axios";

const api = axios.create({
  baseURL: "https://insta-clone-cz4o.onrender.com/api/auth",
  withCredentials: true
});

// Register
export const register = async (username, email, password) => {
  const response = await api.post("/register", {
    username,   // FIXED
    email,
    password
  });

  return response.data;
};

// Login
export const login = async (email, password) => {
  const response = await api.post("/login", {
    email,
    password
  });

  return response.data;
};

// Get Logged-in User
export const getMe = async () => {
  const response = await api.get("/get-me");
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await api.post("/logout");
  return response.data;
};