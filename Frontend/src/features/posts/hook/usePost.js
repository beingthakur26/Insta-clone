import { getFeed } from "../services/post.api";
import { useContext } from "react";
import { PostContext } from "../post.context";

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
      return data; // ✅ return like auth
    } catch (error) {
      console.error("Error fetching feed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    post,
    setPost,
    feed,
    setFeed,
    handleGetFeed
  };
};