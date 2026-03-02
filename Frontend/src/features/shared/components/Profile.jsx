/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import "../profile.scss";
import api from "../../../utils/api";

const Profile = () => {

  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [following, setFollowing] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const [newUsername, setNewUsername] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newImage, setNewImage] = useState(null);

  const fetchAll = async () => {
    const profile = await api.get(
      "/auth/get-me",
      { withCredentials: true }
    );

    setUserData(profile.data);
    setNewUsername(profile.data.user);
    setNewBio(profile.data.bio || "");

    const reqRes = await api.get(
      "/users/requests",
      { withCredentials: true }
    );

    setRequests(reqRes.data.requests);

    const followingRes = await api.get(
      "/users/following",
      { withCredentials: true }
    );

    setFollowing(followingRes.data.following);

    const suggestedRes = await api.get(
      "/users/suggested",
      { withCredentials: true }
    );

    setSuggested(suggestedRes.data.users);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAction = async (type, username) => {

    if (type === "accept") {
      await api.patch(
        `/users/follow/status/${username}`,
        { status: "accepted" },
        { withCredentials: true }
      );
    }

    if (type === "reject") {
      await api.patch(
        `/users/follow/status/${username}`,
        { status: "rejected" },
        { withCredentials: true }
      );
    }

    if (type === "unfollow") {
      await api.post(
        `/users/unfollow/${username}`,
        {},
        { withCredentials: true }
      );
    }

    if (type === "follow") {
      await api.post(
        `/users/follow/${username}`,
        {},
        { withCredentials: true }
      );
    }

    fetchAll();
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("user", newUsername);
    formData.append("bio", newBio);
    if (newImage) formData.append("profileImage", newImage);

    await api.patch(
      "/users/update-profile",
      formData,
      { withCredentials: true }
    );

    setEditMode(false);
    fetchAll();
  };

  if (!userData) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-container">

      <div className="profile-grid">

        {/* LEFT SIDE */}
        <div className="profile-card">

          <div className="profile-image-wrapper">
            <img
              src={userData.profileImage}
              alt="profile"
              className="profile-image"
            />
          </div>

          {editMode ? (
            <>
              <input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <textarea
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
              />
              <input
                type="file"
                onChange={(e) => setNewImage(e.target.files[0])}
              />
              <button onClick={handleUpdateProfile}>
                Save Changes
              </button>
            </>
          ) : (
            <>
              <h2>{userData.user}</h2>
              <p className="bio">{userData.bio}</p>
              <button onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            </>
          )}

        </div>

        {/* RIGHT SIDE */}
        <div className="profile-sidebar">

          <Section
            title="Follow Requests"
            data={requests}
            render={(r) => (
              <>
                <span>{r.followers}</span>
                <div>
                  <button onClick={() => handleAction("accept", r.followers)}>✓</button>
                  <button onClick={() => handleAction("reject", r.followers)}>✕</button>
                </div>
              </>
            )}
          />

          <Section
            title="Following"
            data={following}
            render={(f) => (
              <>
                <span>{f.following}</span>
                <button onClick={() => handleAction("unfollow", f.following)}>
                  Unfollow
                </button>
              </>
            )}
          />

          <Section
            title="Suggested"
            data={suggested}
            render={(s) => (
              <>
                <span>{s.user}</span>
                <button onClick={() => handleAction("follow", s.user)}>
                  Follow
                </button>
              </>
            )}
          />

        </div>

      </div>

    </div>
  );
};

const Section = ({ title, data, render }) => (
  <div className="sidebar-section">
    <h3>{title}</h3>
    {data.length === 0 ? (
      <p className="empty">No data</p>
    ) : (
      data.map((item) => (
        <div key={item._id} className="sidebar-item">
          {render(item)}
        </div>
      ))
    )}
  </div>
);

export default Profile;