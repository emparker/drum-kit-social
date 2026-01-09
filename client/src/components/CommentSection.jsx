import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import { getRelativeTime } from '../utils/dateUtils';

export default function CommentSection({ postId }) {
  const { user } = useContext(AuthContext);
  const { fetchCommentsByPost, createComment, updateComment, deleteComment } = useContext(PostContext);

  // State
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);

  // Form state for new comment
  const [newComment, setNewComment] = useState({ title: '', text: '' });

  // Form state for editing comment
  const [editForm, setEditForm] = useState({ title: '', text: '' });

  const [errors, setErrors] = useState({
    newComment: null,
    editComment: null   
  })

  // Fetch comments when component mounts
  useEffect(() => {
    loadComments();
  }, [postId]);

  // Load comments from API
  const loadComments = async () => {
    setIsLoading(true);
    const result = await fetchCommentsByPost(postId);
    if (result.success) {
      setComments(result.data);
    }
    setIsLoading(false);
  };

  // Handle creating new comment
  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (newComment.title.trim() === '' || newComment.text.trim() === '') {
      setErrors({
        ...errors,
        newComment: 'Title and text are required.'
      });
      return;
    }
    // If validation fails, set appropriate error state and return early
    // If validation passes, clear any existing errors
    setErrors({
      ...errors,
      newComment: null
    });

    const result = await createComment(postId, newComment);
    if (result.success) {
      setComments([result.data, ...comments]); // Add to top (newest first)
      setNewComment({ title: '', text: '' }); // Reset form
      setShowForm(false); // Hide form
    }
  };

  // Handle starting edit mode
  const startEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditForm({ title: comment.title, text: comment.text });
  };

  // Handle canceling edit
  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditForm({ title: '', text: '' });
  };

  // Handle saving edited comment
  const handleUpdateComment = async (commentId) => {
    if (editForm.title.trim() === '' || editForm.text.trim() === '') {
      setErrors({
        ...errors,
        editComment: 'Title and text are required.'
      });
      return;
    }
    // If validation passes, clear any existing errors
    setErrors({
      ...errors,
      editComment: null
    }); 
    // Set error state if validation fails

    const result = await updateComment(commentId, editForm);
    if (result.success) {
      // Update comment in local state
      setComments(comments.map(c => c._id === commentId ? result.data : c));
      cancelEdit();
    }
  };

  // Handle deleting comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    const result = await deleteComment(commentId);
    if (result.success) {
      // Remove comment from local state
      setComments(comments.filter(c => c._id !== commentId));
    }
  };

  return (
    <section className="comment-section">
      <div className="comment-header">
        <h5>Comments ({comments.length})</h5>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-sm btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Comment'}
        </button>
      </div>

      {/* Add Comment Form */}
      {showForm && (
        <form onSubmit={handleCreateComment} className="comment-form">

          {errors.newComment && (
            <div className="error-message">{errors.newComment}</div>
          )}

          <input
            type="text"
            placeholder="Comment title..."
            value={newComment.title}
            onChange={(e) => setNewComment({ ...newComment, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Write your comment..."
            value={newComment.text}
            onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
            required
          />
          <button type="submit" className="btn-primary btn-sm">
            Post Comment
          </button>
        </form>
      )}

      {/* Comments List */}
      {isLoading ? (
        <p className="placeholder-text">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="placeholder-text">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <article key={comment._id} className="comment-item">
              {/* Edit Mode */}
              {editingCommentId === comment._id ? (
                <div className="comment-edit-form">

                  {errors.editComment && (
                    <div className="error-message">{errors.editComment}</div>
                  )}

                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                  <textarea
                    value={editForm.text}
                    onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                  />
                  <div className="edit-actions">
                    <button
                      onClick={() => handleUpdateComment(comment._id)}
                      className="btn-primary btn-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <>
                  <div className="comment-header-row">
                    <h6 className="comment-title">
                      {comment.title}
                      {comment.isEdited && <span className="edited-badge">edited</span>}
                    </h6>
                    {comment.user?._id === user?._id && (
                      <div className="comment-actions">
                        <button
                          onClick={() => startEdit(comment)}
                          className="action-btn"
                          aria-label="Edit comment"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="action-btn"
                          aria-label="Delete comment"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-meta">
                    <span className="comment-author">{comment.user?.username || 'Unknown'}</span>
                    <span className="comment-separator">•</span>
                    <span className="comment-time">{getRelativeTime(comment.createdAt)}</span>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
