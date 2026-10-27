import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PenSquare,
  FileText,
  MessageCircle,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DeleteModal from '../components/DeleteModal';
import { formatDate } from '../utils/formatters';

const DashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    totalComments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDashboardPosts();
  }, []);

  const fetchDashboardPosts = async () => {
    setLoading(true);
    try {
      const response = await postsAPI.getMyPosts();
      if (response.data?.success) {
        setPosts(response.data.data || []);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard posts:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId || deleting) return;

    setDeleting(true);
    try {
      const response = await postsAPI.deletePost(deleteTargetId);
      if (response.data?.success) {
        setPosts((prev) => prev.filter((p) => p._id !== deleteTargetId));
        setStats((prev) => ({
          ...prev,
          totalPosts: Math.max(0, prev.totalPosts - 1),
        }));
        setDeleteTargetId(null);
        showToast('Story deleted permanently');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete post', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (filter === 'published') return p.status === 'published';
    if (filter === 'draft') return p.status === 'draft';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Editorial Header (Section 17) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[var(--text-primary)] tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || user?.username}.
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Here's what's happening with your writing.
          </p>
        </div>

        <Link
          to="/create-post"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#7C8CFF] to-[#A78BFA] hover:opacity-95 shadow-md shadow-[#7C8CFF]/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write Story</span>
        </Link>
      </div>

      {/* Minimal Stats Strip (Section 17) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-heading font-bold uppercase tracking-wider">
            <span>Posts</span>
            <FileText className="w-4 h-4 text-[#7C8CFF]" />
          </div>
          <p className="text-3xl sm:text-4xl font-heading font-extrabold text-[var(--text-primary)]">
            {stats.totalPosts}
          </p>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span>{stats.publishedPosts} published</span>
            <span>•</span>
            <span>{stats.draftPosts} drafts</span>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-heading font-bold uppercase tracking-wider">
            <span>Comments</span>
            <MessageCircle className="w-4 h-4 text-[#A78BFA]" />
          </div>
          <p className="text-3xl sm:text-4xl font-heading font-extrabold text-[var(--text-primary)]">
            {stats.totalComments}
          </p>
          <p className="text-xs text-[var(--text-muted)]">Reader discussions</p>
        </div>

        <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-heading font-bold uppercase tracking-wider">
            <span>Views</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl sm:text-4xl font-heading font-extrabold text-[var(--text-primary)]">
            {stats.totalViews > 1000
              ? `${(stats.totalViews / 1000).toFixed(1)}K`
              : stats.totalViews}
          </p>
          <p className="text-xs text-[var(--text-muted)]">Total reads</p>
        </div>
      </div>

      {/* Your Stories List (Section 17) */}
      <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="text-xl font-heading font-bold text-[var(--text-primary)]">
              Your Stories
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Manage, edit, or publish your drafts
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-1 rounded-full text-xs font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1 rounded-full transition-all ${
                filter === 'all'
                  ? 'bg-white/10 text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              All ({posts.length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-3.5 py-1 rounded-full transition-all ${
                filter === 'published'
                  ? 'bg-white/10 text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Published ({stats.publishedPosts})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-3.5 py-1 rounded-full transition-all ${
                filter === 'draft'
                  ? 'bg-white/10 text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Drafts ({stats.draftPosts})
            </button>
          </div>
        </div>

        {/* Stories Listing */}
        {loading ? (
          <div className="space-y-4 py-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-16 bg-slate-800/20 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 p-6 border border-dashed border-[var(--border-subtle)] rounded-2xl space-y-3">
            <FileText className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-50" />
            <h3 className="text-base font-heading font-bold text-[var(--text-primary)]">
              No stories yet
            </h3>
            <p className="text-[var(--text-secondary)] text-xs max-w-sm mx-auto">
              Your first story is waiting to be written. Share your ideas with the world.
            </p>
            <div className="pt-2">
              <Link
                to="/create-post"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#7C8CFF] to-[#A78BFA] shadow-sm"
              >
                <span>Create Your First Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-subtle)]">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt=""
                      className="w-12 h-10 rounded-xl object-cover flex-shrink-0 border border-[var(--border-subtle)]"
                    />
                  )}
                  <div className="min-w-0">
                    <Link
                      to={`/posts/${post.slug || post._id}`}
                      className="font-heading font-semibold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-[#7C8CFF] transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-0.5">
                      <span>{formatDate(post.createdAt)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {post.commentCount || 0}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status + Actions */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span
                    className={`px-3 py-0.5 text-xs font-semibold rounded-full ${
                      post.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}
                  >
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>

                  <div className="flex items-center gap-1 text-[var(--text-muted)]">
                    <Link
                      to={`/posts/${post.slug || post._id}`}
                      className="p-1.5 rounded-lg hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
                      title="View"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/edit-post/${post._id}`}
                      className="p-1.5 rounded-lg hover:text-[#7C8CFF] hover:bg-[#7C8CFF]/10 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteTargetId(post._id)}
                      className="p-1.5 rounded-lg hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this story?"
        message="This action will permanently delete the post and remove all associated reader comments."
        loading={deleting}
      />
    </div>
  );
};

export default DashboardPage;
