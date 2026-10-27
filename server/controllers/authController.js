import validator from 'validator';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import generateToken from '../utils/generateToken.js';
import {
  sendAdminRegistrationNotification,
  sendAdminLoginNotification,
} from '../services/emailService.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, username, email, password, confirmPassword } = req.body;

    if (!name || !username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Check duplicate email
    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Check duplicate username
    const cleanUsername = username.toLowerCase().trim();
    const existingUsername = await User.findOne({ username: cleanUsername });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'This username is already taken. Please choose another.',
      });
    }

    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=7C8CFF&color=fff&bold=true`;

    const user = await User.create({
      name: name.trim(),
      username: cleanUsername,
      email: email.toLowerCase().trim(),
      password,
      avatar: defaultAvatar,
      bio: 'New explorer on VibeVlog.',
    });

    const token = generateToken(user._id);

    // Asynchronously dispatch admin registration notification (never transmits password)
    sendAdminRegistrationNotification(user).catch((err) => {
      console.error('[Admin Notification Warning] Registration email dispatch error:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { loginIdentifier, email, password } = req.body;
    const identifier = (loginIdentifier || email || '').trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/username and password',
      });
    }

    // Find user by email or username, explicitly selecting password for check
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or user not found',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Failed login: do NOT send successful login notification
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your password.',
      });
    }

    const token = generateToken(user._id);

    // Asynchronously dispatch admin login notification (never transmits password, hash, or JWT token)
    sendAdminLoginNotification(user, req).catch((err) => {
      console.error('[Admin Notification Warning] Login email dispatch error:', err.message);
    });

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile & stats
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    const postCount = await Post.countDocuments({ author: user._id });
    const commentCount = await Comment.countDocuments({ author: user._id });

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        postCount,
        commentCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (clears client session)
// @route   POST /api/auth/logout
// @access  Public
export const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};
