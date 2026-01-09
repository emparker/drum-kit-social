import axiosInstance from './axiosInstance';

/**
 * Posts API
 * All drummer post-related API calls
 */

// Get all posts (sorted by likes descending)
export const getAllPosts = async () => {
  const response = await axiosInstance.get('/posts');
  return response.data.posts; // Extract posts array from {success: true, posts: [...]}
};

// Get current user's posts
export const getUserPosts = async () => {
  const response = await axiosInstance.get('/posts/user');
  return response.data.posts; // Extract posts array
};

// Get single post by ID
export const getPostById = async (postId) => {
  const response = await axiosInstance.get(`/posts/${postId}`);
  return response.data.post; // Extract single post
};

// Create new drummer post
export const createPost = async (postData) => {
  const response = await axiosInstance.post('/posts', postData);
  return response.data.post; // Extract created post
};

// Update existing post (owner only)
export const updatePost = async (postId, updates) => {
  const response = await axiosInstance.put(`/posts/${postId}`, updates);
  return response.data.post; // Extract updated post
};

// Delete post (owner only)
export const deletePost = async (postId) => {
  const response = await axiosInstance.delete(`/posts/${postId}`);
  return response.data; // Delete returns {success: true, message: ...}
};

// Toggle like on a post
export const likePost = async (postId) => {
  const response = await axiosInstance.put(`/posts/${postId}/like`);
  return response.data.post; // Extract updated post with new likes
};

// Toggle dislike on a post
export const dislikePost = async (postId) => {
  const response = await axiosInstance.put(`/posts/${postId}/dislike`);
  return response.data.post; // Extract updated post with new dislikes
};
