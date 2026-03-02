import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/posts",
  withCredentials: true,
});

// Feed
export const getFeed = async () => {
  const res = await api.get("/feed");
  return res.data;
};

// Create post
export const createPost = async (formData) => {
  const res = await api.post("/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Like post
export const likePost = async (postId) => {
  const res = await api.post(`/like/${postId}`);
  return res.data;
};

// Unlike post
export const unlikePost = async (postId) => {
  const res = await api.delete(`/unlike/${postId}`);
  return res.data;
};