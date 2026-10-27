import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Save,
  Trash2,
  X,
  AlertCircle,
  Image,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DeleteModal from '../components/DeleteModal';

const PRESET_COVERS = [
  {
    name: 'Matrix Code',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cloud Data',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Security Shield',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'AI Neural',
    url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
  },
];

const EditPostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState('published');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await postsAPI.getPostBySlug(id);
        if (response.data?.success) {
          const post = response.data.data;

          const authorId = post.author?._id || post.author;
          if (user && authorId.toString() !== user._id.toString()) {
            setError('Unauthorized: You can only edit your own stories.');
            return;
          }

          setTitle(post.title);
          setContent(post.content);
          setExcerpt(post.excerpt || '');
          setCoverImage(post.coverImage || '');
          setTags(post.tags || []);
          setStatus(post.status || 'published');
        }
      } catch (err) {
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#|,/g, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (targetStatus = status) => {
    if (!title.trim() || !content.trim()) {
      showToast('Title and content are required', 'error');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await postsAPI.updatePost(id, {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim(),
        coverImage: coverImage.trim(),
        tags,
        status: targetStatus,
      });

      if (response.data?.success) {
        const updated = response.data.data;
        showToast('Story updated successfully');
        navigate(`/posts/${updated.slug || updated._id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to update post');
      showToast(err.message || 'Failed to update post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await postsAPI.deletePost(id);
      if (response.data?.success) {
        setIsDeleteModalOpen(false);
        showToast('Story deleted permanently');
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete post', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-6 animate-pulse">
        <div className="w-32 h-6 bg-slate-800/40 rounded"></div>
        <div className="w-full h-16 bg-slate-800/30 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-[var(--text-primary)]">
              Edit Story
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Update story details, content, or publication status
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2 rounded-full text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
            title="Delete Story"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit(status === 'published' ? 'published' : 'draft')}
            className="flex items-center gap-1.5 px-6 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#7C8CFF] to-[#A78BFA] hover:opacity-95 shadow-md shadow-[#7C8CFF]/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {submitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Body */}
        <div className="lg:col-span-8 bg-[var(--bg-card)] p-6 sm:p-10 rounded-3xl border border-[var(--border-subtle)] space-y-6">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-2xl sm:text-4xl font-heading font-extrabold text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none leading-tight tracking-tight"
          />

          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Subtitle or excerpt..."
            className="w-full bg-transparent text-base text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none"
          />

          <div className="border-t border-[var(--border-subtle)] pt-4">
            <textarea
              required
              rows="18"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-transparent text-base sm:text-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none font-serif leading-relaxed resize-y min-h-[420px]"
            ></textarea>
          </div>
        </div>

        {/* Sidebar Metadata */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] space-y-4">
            <h3 className="text-xs font-heading font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Image className="w-4 h-4 text-[#7C8CFF]" />
              Cover Image
            </h3>

            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#7C8CFF]"
            />

            {coverImage && (
              <div className="rounded-xl overflow-hidden aspect-[16/9] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <img
                  src={coverImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] space-y-4">
            <h3 className="text-xs font-heading font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#7C8CFF]" />
              Topics & Status
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#7C8CFF]/10 text-[#7C8CFF] border border-[#7C8CFF]/20"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <input
              type="text"
              placeholder="Add tag and press Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#7C8CFF]"
            />

            <div className="pt-2 border-t border-[var(--border-subtle)]">
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#7C8CFF]"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete this article?"
        message="This action will permanently delete this story and all its reader comments."
        loading={isDeleting}
      />
    </div>
  );
};

export default EditPostPage;
