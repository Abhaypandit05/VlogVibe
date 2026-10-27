import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Calendar,
  Share2,
  Edit,
  Trash2,
  ChevronLeft,
  Eye,
  Check,
  AlertCircle,
  Bookmark,
  Heart,
  MessageCircle,
  ArrowRight,
  User,
} from 'lucide-react';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CommentSection from '../components/CommentSection';
import DeleteModal from '../components/DeleteModal';
import { formatDate, calculateReadingTime, getAvatarUrl } from '../utils/formatters';

const SinglePostPage = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState('');
  const [headings, setHeadings] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Scroll listener for reading progress bar and active TOC section
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const currentProgress = (totalScroll / windowHeight) * 100;
        setScrollProgress(currentProgress);
      }

      // Check current visible heading
      const headingElements = document.querySelectorAll('h2[id], h3[id]');
      let currentId = '';
      headingElements.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top <= 140) {
          currentId = el.id;
        }
      });
      if (currentId) setActiveHeading(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch post and extract table of contents
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await postsAPI.getPostBySlug(slug);
        if (response.data?.success) {
          const fetched = response.data.data;
          setPost(fetched);

          // Extract headings from markdown content
          const raw = fetched.content || '';
          const lines = raw.split('\n');
          const extracted = [];
          lines.forEach((line) => {
            const h2Match = line.match(/^##\s+(.*)/);
            const h3Match = line.match(/^###\s+(.*)/);
            if (h2Match) {
              const text = h2Match[1].trim();
              const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
              extracted.push({ text, id, level: 2 });
            } else if (h3Match) {
              const text = h3Match[1].trim();
              const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
              extracted.push({ text, id, level: 3 });
            }
          });
          setHeadings(extracted);
          if (extracted[0]) setActiveHeading(extracted[0].id);
        }
      } catch (err) {
        console.error('Failed to load post:', err.message);
        setError(err.message || 'Article not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('Article link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeletePost = async () => {
    if (!post || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await postsAPI.deletePost(post._id);
      if (response.data?.success) {
        setIsDeleteModalOpen(false);
        showToast('Story deleted successfully');
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete post', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const isAuthor =
    isAuthenticated &&
    user &&
    post &&
    (post.author?._id === user._id || post.author === user._id);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-8 animate-pulse">
        <div className="w-28 h-4 bg-slate-800/40 rounded"></div>
        <div className="w-3/4 h-12 bg-slate-800/50 rounded-xl"></div>
        <div className="w-full h-96 bg-slate-800/30 rounded-3xl"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
          Story Not Found
        </h2>
        <p className="text-[var(--text-secondary)] text-sm">
          {error || `The article you are looking for has been removed or is in draft mode.`}
        </p>
        <div className="pt-2">
          <Link
            to="/posts"
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#7C8CFF] to-[#A78BFA] inline-block shadow-sm"
          >
            Explore All Stories
          </Link>
        </div>
      </div>
    );
  }

  // Render formatted editorial prose
  const renderEditorialContent = (rawContent) => {
    if (!rawContent) return null;
    const blocks = rawContent.split(/\n\n+/);

    return blocks.map((block, idx) => {
      const trimmed = block.trim();

      // Heading 2
      if (trimmed.startsWith('## ')) {
        const text = trimmed.replace(/^##\s+/, '');
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
        return (
          <h2 key={idx} id={id} className="scroll-mt-24">
            {text}
          </h2>
        );
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        const text = trimmed.replace(/^###\s+/, '');
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
        return (
          <h3 key={idx} id={id} className="scroll-mt-24">
            {text}
          </h3>
        );
      }

      // Code blocks
      if (trimmed.startsWith('```')) {
        const lines = trimmed.split('\n');
        const code = lines.slice(1, -1).join('\n');
        const lang = lines[0].replace(/```/, '').trim() || 'javascript';

        return (
          <div
            key={idx}
            className="my-8 rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xl"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] text-xs text-[var(--text-muted)] font-mono">
              <span>{lang}</span>
              <span className="text-[10px] uppercase tracking-wider text-[#7C8CFF]">Snippet</span>
            </div>
            <pre className="p-4 sm:p-5 text-xs sm:text-sm text-[#A78BFA] font-mono overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Blockquotes
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx}>
            {trimmed.replace(/^>\s+/, '')}
          </blockquote>
        );
      }

      // Lists
      if (trimmed.match(/^[0-9]\.\s/) || trimmed.startsWith('- ')) {
        const items = trimmed.split('\n');
        return (
          <ul key={idx} className="list-disc list-inside space-y-2 my-4">
            {items.map((it, itemIdx) => (
              <li key={itemIdx} className="text-[var(--text-primary)]">
                {it.replace(/^[0-9]\.\s+|^-\s+/, '')}
              </li>
            ))}
          </ul>
        );
      }

      // Standard paragraph in Source Serif 4
      return (
        <p key={idx}>
          {trimmed}
        </p>
      );
    });
  };

  return (
    <>
      {/* 12. Reading Progress Bar */}
      <div
        className="reading-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Navigation & Author Controls */}
        <div className="flex items-center justify-between pb-8">
          <Link
            to="/posts"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[#7C8CFF] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to articles</span>
          </Link>

          <div className="flex items-center gap-2">
            {isAuthor && (
              <div className="flex items-center gap-2 mr-2">
                <Link
                  to={`/edit-post/${post._id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--text-primary)] bg-[var(--bg-card)] hover:border-[#7C8CFF]/50 border border-[var(--border-subtle)] transition-all"
                >
                  <Edit className="w-3.5 h-3.5 text-[#7C8CFF]" />
                  <span>Edit Story</span>
                </Link>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title="Share story"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Editorial Story Header (Section 11) */}
        <div className="max-w-[760px] mx-auto space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#7C8CFF]">
            <span>{post.tags?.[0] || 'Technology'}</span>
            <span>•</span>
            <span>{calculateReadingTime(post.content)}</span>
            <span>•</span>
            <span className="text-[var(--text-muted)] flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {post.views || 0} views
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-[var(--text-primary)] leading-[1.1] tracking-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed font-sans">
              {post.excerpt}
            </p>
          )}

          {/* Author info pill */}
          <div className="pt-4 border-t border-b border-[var(--border-subtle)] py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={getAvatarUrl(post.author)}
                alt={post.author?.name || 'Author'}
                className="w-11 h-11 rounded-full object-cover border border-[var(--border-subtle)]"
              />
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  By {post.author?.name || 'Anonymous Author'}
                </p>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-1.5 p-2 rounded-full border border-[var(--border-subtle)] transition-colors ${
                  isLiked ? 'text-rose-400 border-rose-500/30' : 'hover:text-[var(--text-primary)]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        {post.coverImage && (
          <div className="my-10 max-w-5xl mx-auto rounded-3xl overflow-hidden aspect-[16/9] bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-2xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Layout: 13. Desktop Sidebar + 680-760px Editorial Prose */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-10">
          {/* Main Article Body (Source Serif 4, 680-760px wide) */}
          <div className="lg:col-span-8 lg:col-start-1 max-w-[760px] mx-auto w-full">
            <div className="editorial-prose">
              {renderEditorialContent(post.content)}
            </div>

            {/* Tags footer */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-10 mt-10 border-t border-[var(--border-subtle)]">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/posts?tag=${tag}`}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[#7C8CFF]/30 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* 14. Author Card */}
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <img
                src={getAvatarUrl(post.author)}
                alt={post.author?.name || 'Author'}
                className="w-16 h-16 rounded-2xl object-cover border border-[#7C8CFF]/30 flex-shrink-0"
              />
              <div className="space-y-2 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="text-base font-heading font-bold text-[var(--text-primary)]">
                      {post.author?.name || 'Author'}
                    </h4>
                    <p className="text-xs text-[#7C8CFF] font-mono">
                      @{post.author?.username || 'writer'}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#7C8CFF] hover:underline self-center sm:self-auto"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {post.author?.bio ||
                    'Full-stack developer & builder writing about modern software architectures, algorithms, and technology.'}
                </p>
              </div>
            </div>

            {/* 15. Comments System */}
            <CommentSection postId={post._id} />
          </div>

          {/* 13. Desktop Floating Sidebar (ON THIS PAGE) */}
          <div className="hidden lg:block lg:col-span-4 pl-4">
            <div className="sticky top-28 space-y-6 bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)]">
              <div>
                <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                  On this page
                </h4>

                {headings.length > 0 ? (
                  <nav className="space-y-2 text-xs">
                    {headings.map((h, i) => (
                      <a
                        key={i}
                        href={`#${h.id}`}
                        className={`block transition-colors leading-relaxed line-clamp-1 ${
                          h.level === 3 ? 'pl-3' : ''
                        } ${
                          activeHeading === h.id
                            ? 'text-[#7C8CFF] font-semibold'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                ) : (
                  <p className="text-xs text-[var(--text-muted)]">Full Article</p>
                )}
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Story Details
                </span>
                <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                  <div className="flex justify-between">
                    <span>Reading time:</span>
                    <span className="text-[var(--text-primary)] font-medium">
                      {calculateReadingTime(post.content)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Published:</span>
                    <span className="text-[var(--text-primary)] font-medium">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Views:</span>
                    <span className="text-[var(--text-primary)] font-medium">
                      {post.views || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeletePost}
          title="Delete this article?"
          message="This action will permanently delete your article and all associated comments."
          loading={isDeleting}
        />
      </article>
    </>
  );
};

export default SinglePostPage;
