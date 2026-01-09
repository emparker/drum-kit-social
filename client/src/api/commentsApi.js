import axiosInstance from './axiosInstance';

/**
 * Comments API
 * All comment-related API calls
 */

// Get all comments for a specific post
export const getCommentsByPost = async (postId) => {
  const response = await axiosInstance.get(`/comments/post/${postId}`);
  return response.data.comments; // Extract comments array
};

// Create new comment on a post
export const createComment = async (postId, commentData) => {
  const response = await axiosInstance.post(`/comments/post/${postId}`, commentData);
  return response.data.comment; // Extract created comment
};

// Update existing comment (owner only, marks as edited)
export const updateComment = async (commentId, updates) => {
  const response = await axiosInstance.put(`/comments/${commentId}`, updates);
  return response.data.comment; // Extract updated comment
};

// Delete comment (owner only)
export const deleteComment = async (commentId) => {
  const response = await axiosInstance.delete(`/comments/${commentId}`);
  return response.data; // Delete returns {success: true, message: ...}
};
