import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

// @desc    Get user profile by username
// @route   GET /api/users/:username
// @access  Public
export const getUserProfile = async (req, res, next) => {
  try {
    const username = req.params.username.toLowerCase().trim();
    const user = await User.findOne({ username }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const postCount = await Post.countDocuments({
      author: user._id,
      status: 'published',
    });
    const commentCount = await Comment.countDocuments({ author: user._id });

    // Fetch recent published posts by this user
    const posts = await Post.find({ author: user._id, status: 'published' })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('author', 'name username avatar');

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          bio: user.bio,
          createdAt: user.createdAt,
          postCount,
          commentCount,
        },
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { name, bio, avatar, username } = req.body;

    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (avatar !== undefined) user.avatar = avatar.trim();

    if (username && username.toLowerCase().trim() !== user.username) {
      const cleanUsername = username.toLowerCase().trim();
      const existingUser = await User.findOne({ username: cleanUsername });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken by another author',
        });
      }
      user.username = cleanUsername;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};