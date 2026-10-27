import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  AtSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await register({
        name: name.trim(),
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password,
        confirmPassword,
      });

      if (result.success) {
        showToast('Account created successfully! Welcome to VibeVlog.');
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.message || 'Registration failed. Please check inputs.');
        showToast(result.message || 'Registration failed', 'error');
      }
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
      showToast('Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10 transition-all';

  const labelClass =
    'block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2';

  return (
    <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-5xl bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">

        {/* Left Editorial Panel */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#21101f] via-[#11101a] to-[#17132c] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-[var(--border-subtle)]">

          <div className="absolute -top-24 -left-24 w-60 h-60 bg-pink-500/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>

              <span className="text-xl font-heading font-bold text-white tracking-tight">
                VibeVlog
              </span>
            </Link>

            <div className="pt-8 space-y-3">
              <p className="text-xs uppercase font-mono tracking-widest text-pink-400 font-semibold">
                Creator Community
              </p>

              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white leading-tight">
                Start sharing your engineering journey{' '}
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  today.
                </span>
              </h2>
            </div>
          </div>

          <div className="pt-10 relative z-10 space-y-3">
            <p className="text-sm text-slate-400 leading-relaxed">
              Publish technical essays, connect with thoughtful peers, and
              participate in meaningful discussions.
            </p>

            <p className="text-[11px] text-slate-500 font-mono">
              Fast · Minimal · Production Ready
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center gap-6">

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-primary)]">
              Create an author account
            </h2>

            <p className="text-sm text-[var(--text-secondary)]">
              Fill in your details to start publishing on VibeVlog.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className={labelClass}>Full Name *</label>

              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 pointer-events-none" />

                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Username and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Username *</label>

                <div className="relative flex items-center">
                  <AtSign className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 pointer-events-none" />

                  <input
                    type="text"
                    required
                    minLength={3}
                    autoComplete="username"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Email *</label>

                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 pointer-events-none" />

                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Password (min 6) *</label>

                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 pointer-events-none" />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-10 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}
                    className="absolute right-3 text-[var(--text-muted)] hover:text-pink-400 p-1 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Confirm Password *</label>

                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 pointer-events-none" />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:brightness-110 shadow-lg shadow-pink-500/15 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-pink-400 hover:text-purple-400 transition-colors"
            >
              Sign In Instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
