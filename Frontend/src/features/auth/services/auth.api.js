import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true
});

//  Register
export const register = async (username, email, password) => {
  const response = await api.post("/register", {
    user: username,   // change to "username" if backend expects that
    email,
    password
  });

  return response.data;
};

//  Login
export const login = async (email, password) => {
  const response = await api.post("/login", {
    email,
    password
  });

  return response.data;
};

//  Get Logged-in User
export const getMe = async () => {
  const response = await api.get("/get-me");

  return response.data;
};

//  Logout (optional but recommended)
export const logout = async () => {
  const response = await api.post("/logout");

  return response.data;
};