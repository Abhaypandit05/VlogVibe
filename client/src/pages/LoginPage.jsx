import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const DEMO_ACCOUNTS = [
  { name: 'Sarah Chen', email: 'sarah@example.com', role: 'Frontend Architect' },
  { name: 'Alex Rivera', email: 'alex@example.com', role: 'Cloud & Systems' },
  { name: 'Marcus Vance', email: 'marcus@example.com', role: 'Full-Stack UI/UX' },
  { name: 'Elena Rostova', email: 'elena@example.com', role: 'AI Platform' },
];

const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginIdentifier.trim() || !password) {
      setError('Please provide your email/username and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await login(loginIdentifier.trim(), password);

      if (result.success) {
        showToast(`Welcome back, ${result.user?.name || 'author'}!`);
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
        showToast(result.message || 'Login failed', 'error');
      }
    } catch (err) {
      setError(err?.message || 'Unable to sign in. Please try again.');
      showToast('Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (email) => {
    setLoginIdentifier(email);
    setPassword('password123');
    setError(null);
  };

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
                Developer Magazine
              </p>

              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white leading-tight">
                Ideas worth reading.
                <br />
                Stories worth{' '}
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  sharing.
                </span>
              </h2>
            </div>
          </div>

          <div className="pt-10 relative z-10 space-y-3">
            <p className="text-sm text-slate-400 leading-relaxed">
              Join developers and creators sharing insightful tutorials,
              experiences, and perspectives.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span>JWT Authentication</span>
              <span>•</span>
              <span>Bcrypt Secured</span>
            </div>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center gap-6">

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-primary)]">
              Welcome back
            </h2>

            <p className="text-sm text-[var(--text-secondary)]">
              Enter your author credentials to manage your stories.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Email or Username
              </label>

              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 pointer-events-none" />

                <input
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="name@example.com or username"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Password
              </label>

              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 pointer-events-none" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-11 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10 transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:brightness-110 shadow-lg shadow-pink-500/15 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Profiles */}
          <div className="pt-5 border-t border-[var(--border-subtle)] space-y-3">
            <span className="text-xs font-semibold text-pink-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              1-Click Demo Profiles
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickLogin(acc.email)}
                  className="p-3 rounded-xl bg-[var(--bg-surface)] hover:border-pink-500/50 hover:bg-pink-500/5 border border-[var(--border-subtle)] text-left transition-all"
                >
                  <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                    {acc.name}
                  </p>

                  <p className="text-xs text-[var(--text-muted)] truncate mt-1">
                    {acc.role}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-[var(--text-muted)]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-pink-400 hover:text-purple-400 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
