const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// GET /api/comments/post/:postId - Get all comments for a post (newest first)
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ drummerPost: req.params.postId })
      .populate('user', 'username')
      .sort({ createdAt: -1 }); // Sort by newest first (-1 = descending)

    res.status(200).json({
      success: true,
      comments
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
});

// POST /api/comments/post/:postId - Create new comment
router.post('/post/:postId', async (req, res) => {
  try {
    const { title, text } = req.body;

    // Validate required fields
    if (!title || !text) {
      return res.status(400).json({
        success: false,
        message: 'Title and text are required'
      });
    }

    // Create new comment with user and post IDs
    const newComment = new Comment({
      title,
      text,
      user: req.auth._id,          // Attach logged-in user's ID
      drummerPost: req.params.postId // Attach post ID from URL
    });

    await newComment.save();

    // Populate user before sending response
    await newComment.populate('user', 'username');

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      comment: newComment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating comment',
      error: error.message
    });
  }
});

// PUT /api/comments/:commentId - Edit comment (owner only)
router.put('/:commentId', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the owner
    if (comment.user.toString() !== req.auth._id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this comment'
      });
    }

    const { title, text } = req.body;

    // Update only the fields that are provided (partial updates)
    if (title) comment.title = title;
    if (text) comment.text = text;

    // Mark comment as edited
    comment.isEdited = true;

    await comment.save();

    // Populate user before sending response
    await comment.populate('user', 'username');

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating comment',
      error: error.message
    });
  }
});

// DELETE /api/comments/:commentId - Delete comment (owner only)
router.delete('/:commentId', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the owner
    if (comment.user.toString() !== req.auth._id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this comment'
      });
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
});

module.exports = router;
