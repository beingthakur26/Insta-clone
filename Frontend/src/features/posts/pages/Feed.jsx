import React, { useEffect } from "react";
import Post from "../components/Post";
import "../style/feed.scss";
import { usePost } from "../hook/usePost";

const Feed = () => {

  const { feed, handleGetFeed, loading, setFeed } = usePost();

  useEffect(() => {
    handleGetFeed();
  }, []);

  if (loading) {
    return (
      <div className="feed">
        <h2 style={{ color: "white" }}>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="feed">
      <div className="posts">
        {feed.length === 0 ? (
          <h3 style={{ color: "white" }}>No posts found</h3>
        ) : (
          feed.map((post) => (
            <Post
              key={post._id}
              post={post}
              setPosts={setFeed}   // ✅ same logic, but context now
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;