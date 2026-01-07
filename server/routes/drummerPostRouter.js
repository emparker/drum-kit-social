const express = require('express');
const router = express.Router();
const DrummerPost = require('../models/DrummerPost');

// GET /api/posts - Get all posts (sorted by likes count)
router.get('/', async (req, res) => {
  try {
    const posts = await DrummerPost.find()
      .populate('user', 'username');

    // Sort by likes count (descending) - posts with most likes appear first
    // NOTE: For future refactor - could use Mongoose virtual properties (likeCount)
    // or MongoDB aggregation pipeline for more efficient sorting at the DB level.
    // For now, sorting in JavaScript is simpler and easier to understand.
    posts.sort((a, b) => b.likes.length - a.likes.length);

    res.status(200).json({
      success: true,
      posts
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
});

// GET /api/posts/user - Get current user's posts only
router.get('/user', async (req, res) => {
  try {
    const userPosts = await DrummerPost.find({ user: req.auth._id })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts: userPosts
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user posts',
      error: error.message
    });
  }
});

// GET /api/posts/:postId - Get single post
router.get('/:postId', async (req, res) => {
  try {
    const post = await DrummerPost.findById(req.params.postId)
      .populate('user', 'username');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Get single post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
});

// POST /api/posts - Create new drummer post
router.post('/', async (req, res) => {
  try {
    const { drummerName, album, drumKit, addOns } = req.body;

    // Validate required fields
    if (!drummerName || !album) {
      return res.status(400).json({
        success: false,
        message: 'Drummer name and album are required'
      });
    }

    // Create new post with user from JWT token
    const newPost = new DrummerPost({
      drummerName,
      album,
      drumKit: drumKit || {},
      addOns: addOns || {},
      user: req.auth._id  // Attach logged-in user's ID
    });

    await newPost.save();

    // Populate user before sending response
    await newPost.populate('user', 'username');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: newPost
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
});

// PUT /api/posts/:postId - Update post (owner only)
router.put('/:postId', async (req, res) => {
  try {
    const post = await DrummerPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.user.toString() !== req.auth._id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this post'
      });
    }

    const { drummerName, album, drumKit, addOns } = req.body;

    if (drummerName) post.drummerName = drummerName;
    if (album) post.album = album;
    if (drumKit) post.drumKit = { ...post.drumKit, ...drumKit };
    if (addOns) post.addOns = { ...post.addOns, ...addOns };

    await post.save();
    await post.populate('user', 'username');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
});

// PUT /api/posts/:postId/like - Like a post (toggle behavior)
router.put('/:postId/like', async (req, res) => {
  try {
    const post = await DrummerPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const userId = req.auth._id;

    // Check if user already liked this post
    const alreadyLiked = post.likes.includes(userId);

    // Check if user already disliked this post
    const alreadyDisliked = post.dislikes.includes(userId);

    if (alreadyLiked) {
      // If already liked, remove the like (toggle off)
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // If disliked, remove the dislike first
      if (alreadyDisliked) {
        post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
      }
      // Add the like
      post.likes.push(userId);
    }

    await post.save();
    await post.populate('user', 'username');

    res.status(200).json({
      success: true,
      message: alreadyLiked ? 'Like removed' : 'Post liked',
      post
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking post',
      error: error.message
    });
  }
});

// PUT /api/posts/:postId/dislike - Dislike a post (toggle behavior)
router.put('/:postId/dislike', async (req, res) => {
  try {
    const post = await DrummerPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const userId = req.auth._id;
 
    // Check if user already liked this post
    const alreadyLiked = post.likes.includes(userId);

    // Check if user already disliked this post
    const alreadyDisliked = post.dislikes.includes(userId);

    // If already disliked, remove it (toggle off) using filter
    if (alreadyDisliked) {
      post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
    } else {
      // If liked, remove the like first using filter
      if (alreadyLiked) {
        post.likes = post.likes.filter(id => id.toString() !== userId);
      }
      // Then add the dislike using push
      post.dislikes.push(userId);
    }

    await post.save();
    await post.populate('user', 'username');

    res.status(200).json({
      success: true,
      message: alreadyDisliked ? 'Dislike removed' : 'Post disliked',
      post
    });

  } catch (error) {
    console.error('Dislike post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error disliking post',
      error: error.message
    });
  }
});

// DELETE /api/posts/:postId - Delete post (owner only)
router.delete('/:postId', async (req, res) => {
  try {
    const post = await DrummerPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the owner
    if (post.user.toString() !== req.auth._id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post'
      });
    }

    await DrummerPost.findByIdAndDelete(req.params.postId);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
});

module.exports = router;
