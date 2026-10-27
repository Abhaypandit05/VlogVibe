import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

// Escape user input before building a RegExp
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Helper to generate URL slug
const createSlug = (title) => {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'post'
  );
};

// @desc    Get all published posts with filtering, search, pagination, and sorting
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;

    const { search, tag, author, sort } = req.query;

    const query = {};

    // Public listing only ever returns published posts (drafts via /user/me)
    query.status = 'published';

    // Filter by tag
    if (tag && tag.trim() !== '') {
      query.tags = { $in: [new RegExp(`^${escapeRegex(tag.trim())}$`, 'i')] };
    }

    // Filter by author username
    if (author && author.trim() !== '') {
      const authorUser = await User.findOne({ username: author.toLowerCase().trim() });
      if (authorUser) {
        query.author = authorUser._id;
      } else {
        // Author not found, return empty results
        return res.json({
          success: true,
          data: [],
          pagination: { totalPosts: 0, totalPages: 0, currentPage: page, limit },
          tags: [],
        });
      }
    }

    // Search query across title, excerpt, content, or tags
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
      
      // Also check if search query matches an author name/username
      const matchingAuthors = await User.find({
        $or: [{ name: searchRegex }, { username: searchRegex }],
      }).select('_id');
      const authorIds = matchingAuthors.map((a) => a._id);

      query.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex },
        { tags: { $in: [searchRegex] } },
        ...(authorIds.length > 0 ? [{ author: { $in: authorIds } }] : []),
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'popular') {
      sortOptions = { views: -1, createdAt: -1 };
    }

    const totalPosts = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name username avatar bio')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    // Attach comment counts to posts
    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    commentCounts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const postsWithCounts = posts.map((p) => ({
      ...p,
      commentCount: countMap[p._id.toString()] || 0,
    }));

    // If sorting by comments, sort post in-memory for this page
    if (sort === 'comments') {
      postsWithCounts.sort((a, b) => b.commentCount - a.commentCount);
    }

    // Extract all unique tags across published posts for filter chips
    const allTags = await Post.distinct('tags', { status: 'published' });

    res.json({
      success: true,
      data: postsWithCounts,
      pagination: {
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
        limit,
      },
      tags: allTags.filter(Boolean),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by slug or ID
// @route   GET /api/posts/:slug
// @access  Public
export const getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Search by slug or ObjectId
    let query = { slug };
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ slug }, { _id: slug }] };
    }

    const post = await Post.findOne(query).populate(
      'author',
      'name username avatar bio createdAt'
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if post is draft and requester is NOT the author
    if (post.status === 'draft') {
      if (!req.user || req.user._id.toString() !== post.author._id.toString()) {
        return res.status(404).json({
          success: false,
          message: 'Post not found or is in draft mode',
        });
      }
    }

    // Increment views safely without triggering pre-save hooks
    await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
    post.views += 1;

    // Get comment count
    const commentCount = await Comment.countDocuments({ post: post._id });

    res.json({
      success: true,
      data: {
        ...post.toObject(),
        commentCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new Vlog post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, coverImage, tags, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
    }

    let baseSlug = createSlug(title);
    let uniqueSlug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await Post.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    // Process tags (array or comma-separated string)
    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
    } else if (typeof tags === 'string') {
      processedTags = tags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);
    }

    // Auto-generate excerpt if not provided
    const cleanExcerpt =
      excerpt && excerpt.trim() !== ''
        ? excerpt.trim()
        : content.replace(/<[^>]*>?/gm, '').substring(0, 160).trim() + '...';

    const defaultCover =
      coverImage && coverImage.trim() !== ''
        ? coverImage.trim()
        : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';

    const post = await Post.create({
      title: title.trim(),
      slug: uniqueSlug,
      content,
      excerpt: cleanExcerpt,
      coverImage: defaultCover,
      tags: processedTags,
      status: status === 'draft' ? 'draft' : 'published',
      author: req.user._id,
    });

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'name username avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing Vlog post
// @route   PUT /api/posts/:id
// @access  Private (Author only)
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit your own posts',
      });
    }

    const { title, content, excerpt, coverImage, tags, status } = req.body;

    if (title && title.trim() !== post.title) {
      post.title = title.trim();
      let baseSlug = createSlug(title);
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (
        await Post.findOne({ slug: uniqueSlug, _id: { $ne: post._id } })
      ) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter += 1;
      }
      post.slug = uniqueSlug;
    }

    if (content !== undefined) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt.trim();
    if (coverImage !== undefined) post.coverImage = coverImage.trim();
    if (status !== undefined) {
      post.status = status === 'draft' ? 'draft' : 'published';
    }

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        post.tags = tags.map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
      } else if (typeof tags === 'string') {
        post.tags = tags
          .split(',')
          .map((t) => t.trim().replace(/^#/, ''))
          .filter(Boolean);
      }
    }

    const updatedPost = await post.save();
    const populated = await Post.findById(updatedPost._id).populate(
      'author',
      'name username avatar'
    );

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a Vlog post & its comments
// @route   DELETE /api/posts/:id
// @access  Private (Author only)
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own posts',
      });
    }

    // Delete associated comments
    await Comment.deleteMany({ post: post._id });

    // Delete post
    await Post.findByIdAndDelete(post._id);

    res.json({
      success: true,
      message: 'Post and associated comments deleted successfully',
      deletedId: post._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts by current user (for dashboard)
// @route   GET /api/posts/user/me
// @access  Private
export const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    commentCounts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const postsWithCounts = posts.map((p) => ({
      ...p,
      commentCount: countMap[p._id.toString()] || 0,
    }));

    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalComments = Object.values(countMap).reduce((a, b) => a + b, 0);

    res.json({
      success: true,
      data: postsWithCounts,
      stats: {
        totalPosts: posts.length,
        publishedPosts: posts.filter((p) => p.status === 'published').length,
        draftPosts: posts.filter((p) => p.status === 'draft').length,
        totalViews,
        totalComments,
      },
    });
  } catch (error) {
    next(error);
  }
};