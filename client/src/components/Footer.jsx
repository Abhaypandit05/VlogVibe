import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const linkClass =
    'hover:text-pink-400 transition-colors duration-200';

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] pt-12 sm:pt-16 pb-8 mt-24 transition-colors relative overflow-hidden">

      {/* Subtle Pink-Purple Glow */}
      <div className="absolute top-0 left-1/4 w-72 h-40 bg-pink-500/[0.04] blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-72 h-40 bg-purple-500/[0.04] blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand Information */}
          <div className="sm:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 w-fit group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/30 transition-shadow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>

              <span className="text-xl font-heading font-bold text-[var(--text-primary)] tracking-tight">
                VibeVlog
              </span>
            </Link>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
              Ideas worth reading. Stories worth sharing. A modern space for
              developers, creators, and curious minds.
            </p>

            <div className="inline-flex items-center gap-2 text-xs text-pink-400 font-medium pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All systems operational · REST v1.0</span>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4 font-heading">
              Explore
            </h4>

            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li>
                <Link to="/" className={linkClass}>
                  Featured Stories
                </Link>
              </li>
              <li>
                <Link to="/posts" className={linkClass}>
                  All Articles
                </Link>
              </li>
              <li>
                <Link to="/create-post" className={linkClass}>
                  Start Writing
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className={linkClass}>
                  Author Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4 font-heading">
              Topics
            </h4>

            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li>
                <Link to="/posts?tag=React" className={linkClass}>
                  #React
                </Link>
              </li>
              <li>
                <Link to="/posts?tag=Architecture" className={linkClass}>
                  #Architecture
                </Link>
              </li>
              <li>
                <Link to="/posts?tag=AI" className={linkClass}>
                  #AI
                </Link>
              </li>
              <li>
                <Link to="/posts?tag=Node.js" className={linkClass}>
                  #Node.js
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4 font-heading">
              Company
            </h4>

            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li>
                <Link to="/about" className={linkClass}>
                  About Platform
                </Link>
              </li>

              <li>
                <Link to="/about" className={`flex items-center gap-1 ${linkClass}`}>
                  <span>Architecture</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>

              <li>
                <a
                  href="mailto:contact@vibevlog.dev"
                  className={`text-xs break-all ${linkClass}`}
                >
                  contact@vibevlog.dev
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-4">

          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} VibeVlog. Built for creators and developers.
          </p>

          <p className="flex flex-wrap justify-center items-center gap-1.5">
            <span>Crafted with</span>
            <span className="font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              VibeVlog Editorial
            </span>
            <span>identity</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
