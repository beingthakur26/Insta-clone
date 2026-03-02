import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/Post";
import "../style/feed.scss";

const Feed = () => {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {

      const res = await axios.get(
        "http://localhost:3000/api/posts/feed",
        { withCredentials: true }
      );

      setPosts(res.data.posts);

    } catch (error) {
      console.error("Feed error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
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
        {posts.length === 0 ? (
          <h3 style={{ color: "white" }}>No posts found</h3>
        ) : (
          posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              setPosts={setPosts}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;


// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect } from "react";
// import "../style/feed.scss";
// import Post from "../components/Post";
// import { usePost } from "../hook/usePost";

// const Feed = () => {

//   const { feed, handleGetFeed, loading, setFeed } = usePost();
//   // IMPORTANT: we will update feed directly when user likes

//   useEffect(() => {
//     handleGetFeed();   // fetch posts on mount
//   }, []);

//   // Like logic
//   const toggleLike = async (id) => {
//     try {
//       await fetch(`http://localhost:3000/api/posts/like/${id}`, {
//         method: "POST",
//         credentials: "include"
//       });

//       // Update UI locally after successful like
//       setFeed((prevFeed) =>
//         prevFeed.map((post) =>
//           post._id === id
//             ? { ...post, isLiked: true }   // set to true because backend only supports like
//             : post
//         )
//       );

//     } catch (err) {
//       console.error("Like error:", err);
//     }
//   };

//   if (loading) {
//     return <main className="loading">Feed is Loading...</main>;
//   }

//   if (!feed || feed.length === 0) {
//     return <main className="loading">No posts found</main>;
//   }

//   return (
//     <main className="feed">
//       <div className="posts">
//         {feed.map((post) => (
//           <Post
//             key={post._id}
//             post={post}
//             isLiked={post.isLiked}   // ✅ use backend value directly
//             toggleLike={toggleLike}
//           />
//         ))}
//       </div>
//     </main>
//   );
// };

// export default Feed;
