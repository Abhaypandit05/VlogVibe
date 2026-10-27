import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
  Sparkles,
  BookOpen,
} from 'lucide-react';

import { postsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import SkeletonCard from '../components/SkeletonCard';

const EDITORIAL_TOPICS = [
  'All',
  'AI',
  'Web Development',
  'JavaScript',
  'React',
  'Backend',
  'Architecture',
  'Security',
  'TailwindCSS',
  'Cloud',
];

const getPageNumber = (value) => {
  const page = Number.parseInt(value || '1', 10);
  return Number.isFinite(page) ? Math.max(1, page) : 1;
};

const PostsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    totalPosts: 0,
    totalPages: 1,
    currentPage: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') || ''
  );
  const [activeTag, setActiveTag] = useState(
    searchParams.get('tag') || ''
  );
  const [activeSort, setActiveSort] = useState(
    searchParams.get('sort') || 'newest'
  );
  const [currentPage, setCurrentPage] = useState(
    getPageNumber(searchParams.get('page'))
  );
  const [reloadKey, setReloadKey] = useState(0);
  const submittedSearch = (searchParams.get('search') || '').trim();

  // Sync filters with the URL.
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
    setActiveTag(searchParams.get('tag') || '');
    setActiveSort(searchParams.get('sort') || 'newest');
    setCurrentPage(getPageNumber(searchParams.get('page')));
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const loadPosts = async () => {
      setLoading(true);
      setError('');

      try {
        const params = {
          page: currentPage,
          limit: 9,
          sort: activeSort,
        };

        if (submittedSearch) {
          params.search = submittedSearch;
        }

        if (activeTag && activeTag !== 'All') {
          params.tag = activeTag;
        }

        const response = await postsAPI.getPosts(params);

        if (cancelled) return;

        if (response.data?.success) {
          setPosts(response.data.data || []);
          setPagination(
            response.data.pagination || {
              totalPosts: 0,
              totalPages: 1,
              currentPage: 1,
            }
          );
        } else {
          setPosts([]);
          setPagination({
            totalPosts: 0,
            totalPages: 1,
            currentPage: 1,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load stories. Please try again.');
          setPosts([]);
          setPagination({
            totalPosts: 0,
            totalPages: 1,
            currentPage: 1,
          });
          console.error('Failed to load posts:', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      cancelled = true;
    };
  }, [submittedSearch, activeTag, activeSort, currentPage, reloadKey]);

  const updateURL = (search, tag, sort, page) => {
    const params = {};

    if (search.trim()) params.search = search.trim();
    if (tag && tag !== 'All') params.tag = tag;
    if (sort && sort !== 'newest') params.sort = sort;
    if (page > 1) params.page = String(page);

    setSearchParams(params);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    updateURL(searchInput, activeTag, activeSort, 1);
  };

  const handleTopicClick = (topic) => {
    const nextTag =
      topic === 'All' ||
      activeTag.toLowerCase() === topic.toLowerCase()
        ? ''
        : topic;

    setActiveTag(nextTag);
    setCurrentPage(1);
    updateURL(searchInput, nextTag, activeSort, 1);
  };

  const handleSortChange = (event) => {
    const nextSort = event.target.value;

    setActiveSort(nextSort);
    setCurrentPage(1);
    updateURL(searchInput, activeTag, nextSort, 1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setActiveTag('');
    setActiveSort('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setCurrentPage(1);
    updateURL('', activeTag, activeSort, 1);
  };

  const isFiltering =
    Boolean(searchInput) ||
    Boolean(activeTag) ||
    activeSort !== 'newest';

  const goToPage = (page) => {
    const nextPage = Math.max(
      1,
      Math.min(pagination.totalPages, page)
    );

    setCurrentPage(nextPage);
    updateURL(searchInput, activeTag, activeSort, nextPage);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="vv-explore">
      <div className="vv-explore-glow vv-explore-glow-one" />
      <div className="vv-explore-glow vv-explore-glow-two" />

      <div className="vv-explore-inner">
        <header className="vv-explore-header">
          <div className="vv-explore-eyebrow">
            <Compass size={15} />
            <span>THE DISCOVERY SPACE</span>
          </div>

          <h1 className="vv-explore-title">
            Explore <span>Ideas.</span>
          </h1>

          <p className="vv-explore-description">
            Discover stories, fresh perspectives, and experiences from
            people who have something worth sharing.
          </p>
        </header>

        <section className="vv-explore-controls">
          <form
            className="vv-explore-search"
            onSubmit={handleSearchSubmit}
          >
            <Search className="vv-explore-search-icon" size={19} />

            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search stories, topics, or authors..."
              aria-label="Search stories, topics, or authors"
            />

            {searchInput && (
              <button
                type="button"
                className="vv-explore-clear-search"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}

            <button type="submit" className="vv-explore-search-button">
              <Search size={15} />
              <span>Search</span>
            </button>
          </form>

          <div className="vv-explore-toolbar">
            <div className="vv-explore-filter-label">
              <SlidersHorizontal size={16} />
              <span>Discover your way</span>
            </div>

            <div className="vv-explore-sort">
              <label htmlFor="explore-sort">Sort:</label>

              <select
                id="explore-sort"
                value={activeSort}
                onChange={handleSortChange}
              >
                <option value="newest">Newest Stories</option>
                <option value="oldest">Oldest Stories</option>
                <option value="popular">Most Viewed</option>
                <option value="comments">Most Comments</option>
              </select>
            </div>
          </div>

          <div className="vv-explore-topics">
            {EDITORIAL_TOPICS.map((topic) => {
              const selected =
                (!activeTag && topic === 'All') ||
                activeTag.toLowerCase() === topic.toLowerCase();

              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleTopicClick(topic)}
                  className={`vv-explore-topic ${
                    selected ? 'is-active' : ''
                  }`}
                  aria-pressed={selected}
                >
                  {topic === 'All' && <Sparkles size={13} />}
                  {topic}
                </button>
              );
            })}
          </div>

          {isFiltering && (
            <div className="vv-explore-active-filters">
              <span>Active filters</span>

              {searchInput && (
                <button type="button" onClick={handleClearSearch}>
                  Search: {searchInput}
                  <X size={13} />
                </button>
              )}

              {activeTag && (
                <button type="button" onClick={() => handleTopicClick(activeTag)}>
                  {activeTag}
                  <X size={13} />
                </button>
              )}

              {activeSort !== 'newest' && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveSort('newest');
                    setCurrentPage(1);
                    updateURL(searchInput, activeTag, 'newest', 1);
                  }}
                >
                  Custom sorting
                  <X size={13} />
                </button>
              )}

              <button
                type="button"
                className="vv-explore-reset"
                onClick={handleClearFilters}
              >
                Clear all
              </button>
            </div>
          )}
        </section>

        <section className="vv-explore-results">
          <div className="vv-explore-results-heading">
            <div>
              <span className="vv-explore-results-kicker">
                <BookOpen size={15} />
                THE STORY COLLECTION
              </span>

              <h2>
                {activeTag ? `${activeTag} Stories` : 'Discover stories'}
              </h2>
            </div>

            {!loading && !error && (
              <p className="vv-explore-count">
                Showing <strong>{posts.length}</strong> of{' '}
                <strong>{pagination.totalPosts}</strong> stories
              </p>
            )}
          </div>

          {searchInput && (
            <p className="vv-explore-query">
              Results for <strong>“{searchInput}”</strong>
            </p>
          )}

          {loading ? (
            <div className="vv-explore-grid">
              {Array.from({ length: 6 }, (_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="vv-explore-empty">
              <div className="vv-explore-empty-icon">
                <Search size={26} />
              </div>

              <h3>Couldn't load stories</h3>
              <p>{error}</p>

              <button
                type="button"
                className="vv-explore-primary-button"
                onClick={() => setReloadKey((key) => key + 1)}
              >
                Try again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="vv-explore-empty">
              <div className="vv-explore-empty-icon">
                <Search size={26} />
              </div>

              <span className="vv-explore-empty-kicker">
                NO STORIES FOUND
              </span>

              <h3>Nothing here just yet.</h3>

              <p>
                We couldn't find stories matching your search. Try another
                keyword or clear your filters to explore everything.
              </p>

              <button
                type="button"
                className="vv-explore-primary-button"
                onClick={handleClearFilters}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="vv-explore-grid">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {!loading && !error && pagination.totalPages > 1 && (
            <nav
              className="vv-explore-pagination"
              aria-label="Stories pagination"
            >
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from(
                { length: pagination.totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  type="button"
                  key={page}
                  onClick={() => goToPage(page)}
                  className={currentPage === page ? 'is-current' : ''}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= pagination.totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </nav>
          )}
        </section>
      </div>
    </main>
  );
};

export default PostsPage;