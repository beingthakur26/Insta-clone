/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const PostContext = createContext();

export const PostContextProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState(null);
    const [feed, setFeed] = useState(null);

    const value = {
        loading,
        post,
        setPost,
        feed,
        setFeed,
        setLoading
    };
    
    return (
        <PostContext.Provider value={value}>
            {children}
        </PostContext.Provider>
    );
}

