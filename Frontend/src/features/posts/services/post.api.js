import axios from "axios"; // ✅ fixed typo

const api = axios.create({
  baseURL: "https://insta-clone-cz4o.onrender.com/",
  withCredentials: true,
});

export const getFeed = async () => {
  const response = await api.get("/api/posts/feed");
  return response.data;
};