import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Calendar,
  FileText,
  MessageCircle,
  Edit2,
  Save,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { usersAPI, authAPI, postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PostCard from '../components/PostCard';
import { formatDate, getAvatarUrl } from '../utils/formatters';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
];

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [userPosts, setUserPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchLatestAndPosts = async () => {
      try {
        const meRes = await authAPI.getMe();
        if (meRes.data?.success) {
          const fresh = meRes.data.data;
          setName(fresh.name);
          setUsername(fresh.username);
          setBio(fresh.bio || '');
          setAvatar(fresh.avatar || '');
          updateUser(fresh);
        }

        const postsRes = await postsAPI.getMyPosts();
        if (postsRes.data?.success) {
          setUserPosts(postsRes.data.data || []);
        }
      } catch (err) {
        console.warn('Profile fetch error:', err.message);
      }
    };

    fetchLatestAndPosts();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      const response = await usersAPI.updateUserProfile({
        name: name.trim(),
        username: username.toLowerCase().trim(),
        bio: bio.trim(),
        avatar: avatar.trim(),
      });

      if (response.data?.success) {
        updateUser(response.data.data);
        showToast('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {/* 18. Minimal Creator Profile Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-5">
        <div className="relative inline-block">
          <img
            src={getAvatarUrl({ avatar, name, username })}
            alt={name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover mx-auto border-2 border-[#7C8CFF]/30 shadow-xl"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[var(--text-primary)]">
            {name}
          </h1>
          <p className="text-xs sm:text-sm text-[#7C8CFF] font-mono">
            @{username}
          </p>
        </div>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans max-w-lg mx-auto">
          {bio || 'Full-Stack Developer & Builder. Writing about software, AI and modern web architecture.'}
        </p>

        {/* Stats and Edit CTA */}
        <div className="flex items-center justify-center gap-6 text-xs sm:text-sm text-[var(--text-muted)] pt-1">
          <span className="font-semibold text-[var(--text-primary)]">
            {user?.postCount || userPosts.length} <span className="font-normal text-[var(--text-muted)]">Stories</span>
          </span>
          <span>•</span>
          <span className="font-semibold text-[var(--text-primary)]">
            {user?.commentCount || 0} <span className="font-normal text-[var(--text-muted)]">Comments</span>
          </span>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-white/5 border border-[var(--border-subtle)] hover:border-[#7C8CFF]/40 transition-all"
          >
            <Edit2 className="w-3 h-3 text-[#7C8CFF]" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Inline Profile Editor Form */}
      {isEditing && (
        <div className="bg-[var(--bg-card)] p-6 sm:p-8 rounded-3xl border border-[var(--border-subtle)] max-w-xl mx-auto space-y-5 animate-in slide-in-from-top-2">
          <h3 className="text-lg font-heading font-bold text-[var(--text-primary)]">
            Edit Profile Details
          </h3>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#7C8CFF]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#7C8CFF]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Bio
              </label>
              <textarea
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={300}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#7C8CFF] resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Avatar URL
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#7C8CFF] mb-2"
              />

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--text-muted)]">Presets:</span>
                {AVATAR_OPTIONS.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatar(opt)}
                    className="w-6 h-6 rounded-full overflow-hidden border border-[var(--border-subtle)] hover:scale-110 transition-transform"
                  >
                    <img src={opt} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#7C8CFF] to-[#A78BFA] shadow-sm disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Latest Stories Section (Section 18) */}
      <div className="space-y-6 pt-6 border-t border-[var(--border-subtle)]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold text-[var(--text-primary)]">
            Latest Stories
          </h2>
          <span className="text-xs text-[var(--text-muted)]">
            {userPosts.length} published articles
          </span>
        </div>

        {userPosts.length === 0 ? (
          <div className="text-center py-16 p-6 border border-dashed border-[var(--border-subtle)] rounded-3xl space-y-3">
            <FileText className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
            <p className="text-xs text-[var(--text-secondary)]">No stories published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
