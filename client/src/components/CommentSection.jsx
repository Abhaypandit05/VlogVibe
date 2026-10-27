import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Send, LogIn, AlertCircle } from 'lucide-react';
import { commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CommentItem from './CommentItem';
import DeleteModal from './DeleteModal';
import { getAvatarUrl } from '../utils/formatters';

const CommentSection = ({ postId }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;
      setLoading(true);
      try {
        const response = await commentsAPI.getPostComments(postId);
        if (response.data?.success) {
          setComments(response.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load comments:', err.message);
        setError('Failed to load comments.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await commentsAPI.createComment(postId, {
        content: content.trim(),
      });
      if (response.data?.success) {
        setComments((prev) => [response.data.data, ...prev]);
        setContent('');
        showToast('Comment published to conversation');
      }
    } catch (err) {
      setError(err.message || 'Could not post comment.');
      showToast(err.message || 'Could not post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId || deleting) return;

    setDeleting(true);
    try {
      const response = await commentsAPI.deleteComment(deleteTargetId);
      if (response.data?.success) {
        setComments((prev) => prev.filter((c) => c._id !== deleteTargetId));
        setDeleteTargetId(null);
        showToast('Comment deleted');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete comment', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="mt-16 pt-10 border-t border-[var(--border-subtle)]">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
            Join the conversation
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Share feedback, technical thoughts, and insights with other developers.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-card)] text-[#7C8CFF] border border-[var(--border-subtle)]">
          {comments.length} {comments.length === 1 ? 'thought' : 'thoughts'}
        </span>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Thoughtful comment form or guest sign in prompt */}
      {isAuthenticated ? (
        <form onSubmit={handleCommentSubmit} className="mb-12">
          <div className="flex gap-4 items-start">
            <img
              src={getAvatarUrl(user)}
              alt={user?.name || 'You'}
              className="w-10 h-10 rounded-full object-cover border border-[var(--border-subtle)] flex-shrink-0"
            />
            <div className="flex-1 space-y-3">
              <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] focus-within:border-[#7C8CFF]/60 rounded-2xl p-4 transition-all">
                <textarea
                  rows="3"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write a thoughtful comment..."
                  maxLength={1000}
                  required
                  className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none resize-none leading-relaxed"
                ></textarea>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-xs text-[var(--text-muted)]">
                    {content.length}/1000
                  </span>
                  <button
                    type="submit"
                    disabled={submitting || !content.trim()}
                    className="px-5 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#7C8CFF] to-[#A78BFA] hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all flex items-center gap-1.5"
                  >
                    {submitting ? (
                      <span>Posting...</span>
                    ) : (
                      <>
                        <span>Post</span>
                        <Send className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-12 p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-center space-y-3">
          <h4 className="text-base font-heading font-semibold text-[var(--text-primary)]">
            Sign in to share your thoughts.
          </h4>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
            Participate in architectural discussions and engage directly with the author.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#7C8CFF] to-[#A78BFA] shadow-sm hover:opacity-95 transition-opacity"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Join</span>
            </Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="py-4 border-b border-[var(--border-subtle)] animate-pulse flex gap-4">
              <div className="w-9 h-9 rounded-full bg-slate-800/40"></div>
              <div className="flex-1 space-y-2">
                <div className="w-28 h-3.5 bg-slate-800/50 rounded"></div>
                <div className="w-full h-3 bg-slate-800/30 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-[var(--border-subtle)] p-6">
          <MessageCircle className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
          <p className="text-[var(--text-secondary)] text-xs sm:text-sm">
            No comments yet. Start the conversation with your perspective!
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border-subtle)]">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={user?._id}
              onDelete={(id) => setDeleteTargetId(id)}
            />
          ))}
        </div>
      )}

      {/* Delete Comment Modal */}
      <DeleteModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this comment?"
        message="Are you sure you want to remove your comment from this story?"
        loading={deleting}
      />
    </section>
  );
};

export default CommentSection;
