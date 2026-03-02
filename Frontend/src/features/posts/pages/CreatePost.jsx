import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/createPost.scss";
import { usePost } from "../hook/usePost";

const CreatePost = () => {

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const { handleCreatePost, loading } = usePost();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption || !image) {
      alert("Caption and Image required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("imgUrl", image);

      await handleCreatePost(formData);

      navigate("/feed");

      setCaption("");
      setImage(null);
      setPreview(null);

      alert("Post created successfully");

    } catch (error) {
      console.error("Create post error:", error.response?.data || error.message);
      alert("Failed to create post");
    }
  };

  return (
    <div className="create-post-container">
      <form onSubmit={handleSubmit} className="create-post-form">

        <h2>Create Post</h2>

        {preview && (
          <img src={preview} alt="preview" className="image-preview" />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Share"}
        </button>

      </form>
    </div>
  );
};

export default CreatePost;