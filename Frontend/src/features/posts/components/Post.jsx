import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import api from "../../../utils/api";

const Post = ({ post, setPosts }) => {

  const handleLikeToggle = async () => {
    try {

      if (post.isLiked) {
        await api.delete(`/posts/unlike/${post._id}`)
      } else {
        await api.post(`/posts/like/${post._id}`)
      }

      // 🔥 Update only this post in feed state
      setPosts(prev =>
        prev.map(p =>
          p._id === post._id
            ? { ...p, isLiked: !p.isLiked }
            : p
        )
      );

    } catch (error) {
      console.error("Like toggle error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="post">

      {/* HEADER */}
      <div className="post__header">
        <div className="post__avatar-wrapper">
          <img
            src={post.userId?.profileImage}
            alt="avatar"
            className="post__avatar"
          />
        </div>
        <span className="post__username">
          {post.userId?.user}
        </span>
      </div>

      {/* IMAGE */}
      <div className="post__imageWrapper">
        <img
          src={post.imgUrl}
          alt="post"
          className="post__image"
        />
      </div>

      {/* ICONS */}
      <div className="post__icons">
        <div className="left">

          <button
            onClick={handleLikeToggle}
            className={`like ${post.isLiked ? "active" : ""}`}
          >
            {post.isLiked ? <FaHeart /> : <FaRegHeart />}
          </button>

        </div>
      </div>

      {/* CAPTION */}
      <div className="post__caption">
        <span className="post__username">
          {post.userId?.user}
        </span>
        <span className="post__text">
          {post.caption}
        </span>
      </div>

    </div>
  );
};

export default Post;


// import React from "react";
// import { FaRegHeart, FaHeart, FaRegComment, FaRegBookmark } from "react-icons/fa";
// import { FiSend } from "react-icons/fi";

// const Post = ({ post, isLiked, toggleLike }) => {
//   return (
//     <div className="post">

//       <div className="post__header">
//         <div className="post__avatar-wrapper">
//           <img
//             src={post.userId?.profileImage}
//             alt="profile"
//             className="post__avatar"
//           />
//         </div>
//         <span className="post__username">
//           {post.userId?.user}
//         </span>
//       </div>

//       <div className="post__imageWrapper">
//         <img
//           src={post.imgUrl}
//           alt="post"
//           className="post__image"
//           onDoubleClick={() => toggleLike(post._id)}
//         />
//       </div>

//       <div className="post__icons">
//         <div className="left">
//           <button onClick={() => toggleLike(post._id)}>
//             {isLiked ? (
//               <FaHeart className="like active" />
//             ) : (
//               <FaRegHeart />
//             )}
//           </button>
//           <button><FaRegComment /></button>
//           <button><FiSend /></button>
//         </div>
//         <button><FaRegBookmark /></button>
//       </div>

//       <div className="post__caption">
//         <span className="post__username">
//           {post.userId?.user}
//         </span>
//         <span className="post__text">
//           {post.caption}
//         </span>
//       </div>

//     </div>
//   );
// };

// export default Post;

