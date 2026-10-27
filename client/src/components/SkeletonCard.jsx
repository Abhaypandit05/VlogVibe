import React from 'react';

const SkeletonCard = ({ featured = false }) => {
  return (
    <div
      className={`editorial-card overflow-hidden animate-pulse flex flex-col justify-between ${
        featured ? 'md:col-span-2 md:grid md:grid-cols-12 md:gap-6' : ''
      }`}
    >
      <div
        className={`bg-slate-800/40 dark:bg-slate-800/30 ${
          featured
            ? 'md:col-span-7 aspect-[16/10] md:aspect-auto md:h-full'
            : 'aspect-[16/10]'
        }`}
      ></div>

      <div
        className={`p-6 flex-1 flex flex-col justify-between space-y-4 ${
          featured ? 'md:col-span-5 md:py-8' : ''
        }`}
      >
        <div className="space-y-3">
          <div className="w-16 h-5 bg-slate-800/50 rounded-full"></div>
          <div className="w-3/4 h-7 bg-slate-800/60 rounded-md"></div>
          <div className="w-full h-4 bg-slate-800/40 rounded-md"></div>
          <div className="w-5/6 h-4 bg-slate-800/40 rounded-md"></div>
        </div>

        <div className="pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-800/60"></div>
            <div className="space-y-1">
              <div className="w-20 h-3 bg-slate-800/50 rounded"></div>
              <div className="w-12 h-2.5 bg-slate-800/40 rounded"></div>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-800/40"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
