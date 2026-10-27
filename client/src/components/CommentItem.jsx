import React, { useState } from 'react';
import { Trash2, Heart, MessageSquare } from 'lucide-react';
import { formatRelativeTime, getAvatarUrl } from '../utils/formatters';

const CommentItem = ({ comment, currentUserId, onDelete }) => {
  if (!comment) return null;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const isOwner =
    currentUserId &&
    (comment.author?._id === currentUserId || comment.author === currentUserId);

  const handleToggleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? Math.max(0, prev - 1) : prev + 1));
  };

  return (
    <div className="py-5 border-b border-[var(--border-subtle)] space-y-3 transition-colors">
      <div className="flex items-start justify-between gap-4">
        {/* Author info */}
        <div className="flex items-center gap-3">
          <img
            src={getAvatarUrl(comment.author)}
            alt={comment.author?.name || 'User'}
            className="w-9 h-9 rounded-full object-cover border border-[var(--border-subtle)]"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {comment.author?.name || comment.author?.username || 'User'}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-mono">
                @{comment.author?.username || 'user'}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              {formatRelativeTime(comment.createdAt)}
            </p>
          </div>
        </div>

        {/* Delete option for owner */}
        {isOwner && (
          <button
            onClick={() => onDelete(comment._id)}
            className="text-[var(--text-muted)] hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
            title="Delete your comment"
            aria-label="Delete comment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-[var(--text-primary)] leading-relaxed pl-12 whitespace-pre-line">
        {comment.content}
      </p>

      {/* Subtle Community Actions */}
      <div className="flex items-center gap-4 pl-12 text-xs text-[var(--text-muted)]">
        <button
          onClick={handleToggleLike}
          className={`flex items-center gap-1.5 transition-colors ${
            liked ? 'text-rose-400 font-semibold' : 'hover:text-[var(--text-primary)]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-400' : ''}`} />
          <span>{likeCount > 0 ? likeCount : 'Like'}</span>
        </button>
      </div>
    </div>
  );
};

export default CommentItem;
