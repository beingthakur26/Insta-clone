import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// Logged-in user
export const getProfile = async () => {
  const res = await api.get("/auth/get-me");
  return res.data;
};

// Follow Requests
export const getRequests = async () => {
  const res = await api.get("/users/requests");
  return res.data;
};

// Following
export const getFollowing = async () => {
  const res = await api.get("/users/following");
  return res.data;
};

// Suggested
export const getSuggested = async () => {
  const res = await api.get("/users/suggested");
  return res.data;
};

// Follow
export const followUser = async (username) => {
  const res = await api.post(`/users/follow/${username}`);
  return res.data;
};

// Unfollow
export const unfollowUser = async (username) => {
  const res = await api.post(`/users/unfollow/${username}`);
  return res.data;
};

// Accept / Reject
export const updateFollowStatus = async (username, status) => {
  const res = await api.patch(
    `/users/follow/status/${username}`,
    { status }
  );
  return res.data;
};

// Update Profile
export const updateProfile = async (formData) => {
  const res = await api.patch("/users/update-profile", formData);
  return res.data;
};