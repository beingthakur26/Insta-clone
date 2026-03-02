/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import "../style/profile.scss";
import { useUser } from "../hook/useUser";

const Profile = () => {

  const {
    userData,
    requests,
    following,
    suggested,
    fetchAll,
    handleAction,
    handleUpdateProfile,
  } = useUser();

  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (userData) {
      setNewUsername(userData.user);
      setNewBio(userData.bio || "");
    }
  }, [userData]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("user", newUsername);
    formData.append("bio", newBio);
    if (newImage) formData.append("profileImage", newImage);

    await handleUpdateProfile(formData);
    setEditMode(false);
  };

  if (!userData) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-grid">

        {/* LEFT SIDE */}
        <div className="profile-card">

          <div className="profile-image-wrapper">
            <img
              src={userData.profileImage || "https://via.placeholder.com/150"}
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
              <button onClick={handleSave}>
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