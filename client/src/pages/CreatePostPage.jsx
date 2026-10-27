import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PenSquare,
  ArrowRight,
  Eye,
  Edit3,
  Save,
  X,
  AlertCircle,
  Image,
  Tag,
  Sliders,
  ChevronLeft,
} from 'lucide-react';
import { postsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

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

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['React', 'WebDevelopment']);
  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (targetStatus = 'published') => {
    if (!title.trim()) {
      setError('Please add a title for your story.');
      showToast('Please add a title for your story', 'error');
      return;
    }
    if (!content.trim()) {
      setError('Story content cannot be empty.');
      showToast('Story content cannot be empty', 'error');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await postsAPI.createPost({
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim(),
        coverImage: coverImage.trim(),
        tags,
        status: targetStatus,
      });

      if (response.data?.success) {
        const created = response.data.data;
        showToast(
          targetStatus === 'draft'
            ? 'Story saved as draft'
            : 'Story published to VibeVlog!'
        );
        navigate(`/posts/${created.slug || created._id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to create post');
      showToast(err.message || 'Failed to publish story', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header (Section 16) */}
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
              Author Publishing Studio
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Drafting a new story on VibeVlog
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Write / Preview Tab */}
          <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-1 rounded-full text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-3.5 py-1 rounded-full transition-all ${
                activeTab === 'write'
                  ? 'bg-white/10 text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1 rounded-full transition-all ${
                activeTab === 'preview'
                  ? 'bg-white/10 text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Preview
            </button>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit('draft')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-subtle)] transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit('published')}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#7C8CFF] to-[#A78BFA] hover:opacity-95 shadow-md shadow-[#7C8CFF]/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {submitting ? (
              <span>Publishing...</span>
            ) : (
              <>
                <span>Publish Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
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

      {activeTab === 'write' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Writing Canvas (Left) */}
          <div className="lg:col-span-8 bg-[var(--bg-card)] p-6 sm:p-10 rounded-3xl border border-[var(--border-subtle)] space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                required
                placeholder="Add a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-2xl sm:text-4xl font-heading font-extrabold text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none leading-tight tracking-tight"
              />
            </div>

            {/* Excerpt */}
            <div>
              <input
                type="text"
                placeholder="Add a short subtitle or excerpt..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-transparent text-base text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none"
              />
            </div>

            <div className="border-t border-[var(--border-subtle)] pt-4">
              <textarea
                required
                rows="18"
                placeholder="Tell your story...&#10;&#10;Use ## for headings, ```code``` for code snippets, > for quotes, and - for bullet lists."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-transparent text-base sm:text-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none font-serif leading-relaxed resize-y min-h-[420px]"
              ></textarea>
            </div>
          </div>

          {/* Metadata Panel (Right - Section 16) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Cover Image Settings */}
            <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] space-y-4">
              <h3 className="text-xs font-heading font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                <Image className="w-4 h-4 text-[#7C8CFF]" />
                Cover Image
              </h3>

              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#7C8CFF]"
              />

              <div className="space-y-1.5">
                <span className="text-[11px] text-[var(--text-muted)]">Presets:</span>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_COVERS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setCoverImage(preset.url)}
                      className={`p-2 rounded-xl text-left text-xs transition-all border ${
                        coverImage === preset.url
                          ? 'border-[#7C8CFF] bg-[#7C8CFF]/10 text-[#7C8CFF]'
                          : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {coverImage && (
                <div className="rounded-xl overflow-hidden aspect-[16/9] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Tags & Categories */}
            <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)] space-y-4">
              <h3 className="text-xs font-heading font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#7C8CFF]" />
                Topics & Tags
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
                placeholder="Type tag & press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#7C8CFF]"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Live Preview Mode */
        <div className="max-w-3xl mx-auto bg-[var(--bg-card)] p-8 sm:p-14 rounded-3xl border border-[var(--border-subtle)] space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-xs font-medium text-[#7C8CFF] bg-[#7C8CFF]/10"
                >
                  #{t}
                </span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-[var(--text-primary)]">
              {title || 'Untitled Story'}
            </h1>
            {excerpt && (
              <p className="text-lg text-[var(--text-secondary)]">{excerpt}</p>
            )}
          </div>

          {coverImage && (
            <div className="rounded-2xl overflow-hidden aspect-[16/9] border border-[var(--border-subtle)]">
              <img
                src={coverImage}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="editorial-prose whitespace-pre-line">
            {content || 'Start writing to preview your story here...'}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostPage;
