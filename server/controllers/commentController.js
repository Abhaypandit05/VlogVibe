import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Get comments for a specific post
// @route   GET /api/posts/:postId/comments
// @access  Public
export const getPostComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // Verify post exists (can be ID or slug)
    let post = null;
    if (postId.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findById(postId);
    } else {
      post = await Post.findOne({ slug: postId });
    }

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comments = await Comment.find({ post: post._id })
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a comment on a post
// @route   POST /api/posts/:postId/comments
// @access  Private
export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment content cannot be empty',
      });
    }

    // Resolve post
    let post = null;
    if (postId.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findById(postId);
    } else {
      post = await Post.findOne({ slug: postId });
    }

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = await Comment.create({
      content: content.trim(),
      author: req.user._id,
      post: post._id,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'author',
      'name username avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully',
      data: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private (Comment Author only)
export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Authorization: User may delete only their own comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own comments',
      });
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({
      success: true,
      message: 'Comment deleted successfully',
      deletedId: commentId,
    });
  } catch (error) {
    next(error);
  }
};
