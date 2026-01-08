import { createContext, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import * as postsApi from '../api/postsApi';
import * as commentsApi from '../api/commentsApi';

export const PostContext = createContext();

export function PostProvider({ children }) {
  const { user } = useContext(AuthContext);

  // State
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==================== CRUD Operations ====================

  // Fetch all posts (sorted by likes)
  async function fetchAllPosts() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await postsApi.getAllPosts();
      setPosts(data);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch posts';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch current user's posts
  async function fetchUserPosts() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await postsApi.getUserPosts();
      setUserPosts(data);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch user posts';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch single post by ID
  async function fetchPostById(postId) {
    setIsLoading(true);
    setError(null);
    try {
      const data = await postsApi.getPostById(postId);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch post';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }

  // Create new post
  async function createPost(postData) {
    setIsLoading(true);
    setError(null);
    try {
      const newPost = await postsApi.createPost(postData);

      // Add to posts array
      setPosts((prevPosts) => [newPost, ...prevPosts]);

      // Add to userPosts array
      setUserPosts((prevUserPosts) => [newPost, ...prevUserPosts]);

      return { success: true, data: newPost };
    } catch (err) {
      const errorMsg = err.message || 'Failed to create post';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }

  // Update existing post
  async function updatePost(postId, updates) {
    setIsLoading(true);
    setError(null);
    try {
      const updatedPost = await postsApi.updatePost(postId, updates);

      // Update in posts array
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );

      // Update in userPosts array
      setUserPosts((prevUserPosts) =>
        prevUserPosts.map((post) => (post._id === postId ? updatedPost : post))
      );

      return { success: true, data: updatedPost };
    } catch (err) {
      const errorMsg = err.message || 'Failed to update post';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }

  // Delete post
  async function deletePost(postId) {
    setIsLoading(true);
    setError(null);
    try {
      await postsApi.deletePost(postId);

      // Remove from posts array
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));

      // Remove from userPosts array
      setUserPosts((prevUserPosts) => prevUserPosts.filter((post) => post._id !== postId));

      return { success: true };
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete post';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }

  // ==================== Voting Operations ====================

  // Toggle like on a post
  async function toggleLike(postId) {
    if (!user) return { success: false, message: 'User not authenticated' };

    // Optimistic update
    const optimisticUpdate = (post) => {
      if (post._id !== postId) return post;

      const hasLiked = post.likes?.includes(user._id);
      const hasDisliked = post.dislikes?.includes(user._id);

      return {
        ...post,
        likes: hasLiked
          ? post.likes.filter((id) => id !== user._id) // Remove like
          : [...(post.likes || []), user._id], // Add like
        dislikes: hasDisliked
          ? post.dislikes.filter((id) => id !== user._id) // Remove dislike if present
          : post.dislikes,
      };
    };

    // Apply optimistic update
    setPosts((prevPosts) => prevPosts.map(optimisticUpdate));
    setUserPosts((prevUserPosts) => prevUserPosts.map(optimisticUpdate));

    try {
      const updatedPost = await postsApi.likePost(postId);

      // Replace with actual server response
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
      setUserPosts((prevUserPosts) =>
        prevUserPosts.map((post) => (post._id === postId ? updatedPost : post))
      );

      return { success: true, data: updatedPost };
    } catch (err) {
      // Rollback optimistic update on error
      const rollback = (post) => {
        if (post._id !== postId) return post;
        return optimisticUpdate(post); // Apply reverse of optimistic update
      };

      setPosts((prevPosts) => prevPosts.map(rollback));
      setUserPosts((prevUserPosts) => prevUserPosts.map(rollback));

      const errorMsg = err.message || 'Failed to like post';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }

  // Toggle dislike on a post
  async function toggleDislike(postId) {
    if (!user) return { success: false, message: 'User not authenticated' };

    // Optimistic update
    const optimisticUpdate = (post) => {
      if (post._id !== postId) return post;

      const hasLiked = post.likes?.includes(user._id);
      const hasDisliked = post.dislikes?.includes(user._id);

      return {
        ...post,
        likes: hasLiked
          ? post.likes.filter((id) => id !== user._id) // Remove like if present
          : post.likes,
        dislikes: hasDisliked
          ? post.dislikes.filter((id) => id !== user._id) // Remove dislike
          : [...(post.dislikes || []), user._id], // Add dislike
      };
    };

    // Apply optimistic update
    setPosts((prevPosts) => prevPosts.map(optimisticUpdate));
    setUserPosts((prevUserPosts) => prevUserPosts.map(optimisticUpdate));

    try {
      const updatedPost = await postsApi.dislikePost(postId);

      // Replace with actual server response
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
      setUserPosts((prevUserPosts) =>
        prevUserPosts.map((post) => (post._id === postId ? updatedPost : post))
      );

      return { success: true, data: updatedPost };
    } catch (err) {
      // Rollback optimistic update on error
      const rollback = (post) => {
        if (post._id !== postId) return post;
        return optimisticUpdate(post); // Apply reverse of optimistic update
      };

      setPosts((prevPosts) => prevPosts.map(rollback));
      setUserPosts((prevUserPosts) => prevUserPosts.map(rollback));

      const errorMsg = err.message || 'Failed to dislike post';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }

  // ==================== Comment Operations ====================

  // Fetch comments for a post
  async function fetchCommentsByPost(postId) {
    try {
      const data = await commentsApi.getCommentsByPost(postId);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch comments';
      return { success: false, message: errorMsg };
    }
  }

  // Create new comment
  async function createComment(postId, commentData) {
    try {
      const newComment = await commentsApi.createComment(postId, commentData);
      return { success: true, data: newComment };
    } catch (err) {
      const errorMsg = err.message || 'Failed to create comment';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }

  // Update existing comment
  async function updateComment(commentId, updates) {
    try {
      const updatedComment = await commentsApi.updateComment(commentId, updates);
      return { success: true, data: updatedComment };
    } catch (err) {
      const errorMsg = err.message || 'Failed to update comment';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }

  // Delete comment
  async function deleteComment(commentId) {
    try {
      await commentsApi.deleteComment(commentId);
      return { success: true };
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete comment';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }

  // Context value
  const value = {
    // State
    posts,
    userPosts,
    isLoading,
    error,
    // CRUD operations
    fetchAllPosts,
    fetchUserPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    // Voting
    toggleLike,
    toggleDislike,
    // Comments
    fetchCommentsByPost,
    createComment,
    updateComment,
    deleteComment,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}
