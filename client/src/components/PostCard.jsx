import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowUpRight, MessageCircle } from 'lucide-react';
import { formatDate, calculateReadingTime, getAvatarUrl } from '../utils/formatters';

const PostCard = ({ post, featured = false, className = '' }) => {
  if (!post) return null;

  const readingTime = calculateReadingTime(post.content);
  const cover =
    post.coverImage ||
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';

  return (
    <article
      className={`editorial-card group overflow-hidden flex flex-col justify-between ${
        featured ? 'md:col-span-2 md:grid md:grid-cols-12 md:gap-6' : ''
      } ${className}`}
    >
      {/* Cover Image */}
      <Link
        to={`/posts/${post.slug || post._id}`}
        className={`relative block overflow-hidden bg-[var(--bg-surface)] ${
          featured
            ? 'md:col-span-7 aspect-[16/10] md:aspect-auto md:h-full'
            : 'aspect-[16/10]'
        }`}
      >
        <img
          src={cover}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

        {/* Primary Tag Pill */}
        {post.tags && post.tags.length > 0 && (
          <span className="absolute top-3.5 left-3.5 px-3 py-1 text-xs font-semibold rounded-full bg-black/60 backdrop-blur-md text-[#7C8CFF] border border-[#7C8CFF]/20">
            #{post.tags[0]}
          </span>
        )}

        {post.status === 'draft' && (
          <span className="absolute top-3.5 right-3.5 px-2.5 py-0.5 text-xs font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Draft
          </span>
        )}
      </Link>

      {/* Content Body */}
      <div
        className={`p-6 flex-1 flex flex-col justify-between ${
          featured ? 'md:col-span-5 md:py-8' : ''
        }`}
      >
        <div className="space-y-3">
          {/* Secondary tag preview */}
          {post.tags && post.tags.length > 1 && (
            <div className="flex flex-wrap gap-2 text-xs font-medium text-[var(--text-muted)]">
              {post.tags.slice(1, 3).map((tag) => (
                <span key={tag} className="hover:text-[var(--text-secondary)]">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title in Space Grotesk */}
          <h3
            className={`font-heading font-bold text-[var(--text-primary)] group-hover:text-[#7C8CFF] transition-colors leading-snug tracking-tight ${
              featured ? 'text-2xl sm:text-3xl' : 'text-xl'
            }`}
          >
            <Link to={`/posts/${post.slug || post._id}`}>{post.title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-2">
            {post.excerpt || post.content?.replace(/<[^>]*>?/gm, '').substring(0, 140) + '...'}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between mt-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={getAvatarUrl(post.author)}
              alt={post.author?.name || 'Author'}
              className="w-7 h-7 rounded-full object-cover border border-[var(--border-subtle)] flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                {post.author?.name || 'Author'}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                <span>{readingTime}</span>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <MessageCircle className="w-3.5 h-3.5" />
              {post.commentCount || 0}
            </span>
            <div className="w-7 h-7 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-white group-hover:bg-[#7C8CFF] group-hover:border-[#7C8CFF] transition-all">
              <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
