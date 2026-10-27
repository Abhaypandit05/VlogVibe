import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 space-y-6">
      <div className="text-8xl sm:text-9xl font-heading font-black bg-gradient-to-r from-[#7C8CFF] to-[#A78BFA] bg-clip-text text-transparent">
        404
      </div>
      <h1 className="text-2xl sm:text-4xl font-heading font-bold text-[var(--text-primary)]">
        Story Not Found
      </h1>
      <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-md">
        The article or page you are looking for has been moved or doesn't exist.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#7C8CFF] to-[#A78BFA] shadow-sm transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <Link
          to="/posts"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[#7C8CFF]/40 transition-colors"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Articles</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
