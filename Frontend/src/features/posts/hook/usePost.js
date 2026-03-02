import { useContext } from "react";
import { PostContext } from "../post.context";
import {
  getFeed,
  createPost,
  likePost,
  unlikePost,
} from "../services/post.api";

export const usePost = () => {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("usePost must be used inside PostContextProvider");
  }

  const { loading, post, setPost, feed, setFeed, setLoading } = context;

  const handleGetFeed = async () => {
    setLoading(true);
    try {
      const data = await getFeed();
      setFeed(data.posts);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (formData) => {
    setLoading(true);
    try {
      const data = await createPost(formData);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (postId, isLiked) => {
    if (isLiked) {
      await unlikePost(postId);
    } else {
      await likePost(postId);
    }

    setFeed(prev =>
      prev.map(p =>
        p._id === postId ? { ...p, isLiked: !isLiked } : p
      )
    );
  };

  return {
    loading,
    post,
    setPost,
    feed,
    setFeed,
    handleGetFeed,
    handleCreatePost,
    handleLikeToggle,
  };
};