import { useState } from "react";
import {
  getProfile,
  getRequests,
  getFollowing,
  getSuggested,
  followUser,
  unfollowUser,
  updateFollowStatus,
  updateProfile,
} from "../service/user.api";

export const useUser = () => {

  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [following, setFollowing] = useState([]);
  const [suggested, setSuggested] = useState([]);

  const fetchAll = async () => {
    const profile = await getProfile();
    setUserData(profile);

    const req = await getRequests();
    setRequests(req.requests);

    const fol = await getFollowing();
    setFollowing(fol.following);

    const sug = await getSuggested();
    setSuggested(sug.users);
  };

  const handleAction = async (type, username) => {

    if (type === "accept") {
      await updateFollowStatus(username, "accepted");
    }

    if (type === "reject") {
      await updateFollowStatus(username, "rejected");
    }

    if (type === "unfollow") {
      await unfollowUser(username);
    }

    if (type === "follow") {
      await followUser(username);
    }

    await fetchAll();
  };

  const handleUpdateProfile = async (formData) => {
    await updateProfile(formData);
    await fetchAll();
  };

  return {
    userData,
    requests,
    following,
    suggested,
    fetchAll,
    handleAction,
    handleUpdateProfile,
  };
};