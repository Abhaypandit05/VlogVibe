import express from 'express';
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
} from '../controllers/postController.js';
import {
  getPostComments,
  createComment,
} from '../controllers/commentController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Current user's posts for dashboard (must be above :slug)
router.get('/user/me', protect, getMyPosts);

// Public posts collection & create
router.route('/')
  .get(getPosts)
  .post(protect, createPost);

// Comments for a post
router.route('/:postId/comments')
  .get(getPostComments)
  .post(protect, createComment);

// Single post operations
router.route('/:slug')
  .get(optionalAuth, getPostBySlug);

router.route('/:id')
  .put(protect, updatePost)
  .delete(protect, deletePost);

export default router;
