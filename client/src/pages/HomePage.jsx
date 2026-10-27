import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PenSquare,
  Search,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock3,
  RefreshCw,
  Hash,
  Plus,
  Layers,
} from "lucide-react";

import { postsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const HERO_IMAGE = "/anime-room.png";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";

const DEFAULT_CATEGORIES = [
  "All Stories",
  "Technology",
  "Travel",
  "Lifestyle",
  "Photography",
  "Food",
  "Education",
  "Personal",
];

const DEFAULT_TAGS = [
  "webdevelopment",
  "travel",
  "technology",
  "lifestyle",
  "photography",
  "programming",
  "design",
  "productivity",
];

/* -----------------------------------------
   HELPERS
----------------------------------------- */

function getPostsFromResponse(response) {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.posts)) return data.posts;
  if (Array.isArray(data?.data?.posts)) return data.data.posts;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;

  return [];
}

function getAuthor(post) {
  const author = post?.author || post?.user || post?.createdBy;

  if (typeof author === "string") {
    return {
      name: author,
      avatar: DEFAULT_AVATAR,
    };
  }

  return {
    name:
      author?.name ||
      author?.username ||
      author?.fullName ||
      post?.authorName ||
      "VibeVlog Writer",

    avatar:
      author?.avatar ||
      author?.avatarUrl ||
      author?.profileImage ||
      author?.profilePicture ||
      post?.authorAvatar ||
      DEFAULT_AVATAR,
  };
}

function getCategory(post) {
  if (typeof post?.category === "string") {
    return post.category;
  }

  return post?.category?.name || post?.categoryName || "Stories";
}

function getTags(post) {
  if (!Array.isArray(post?.tags)) return [];

  return post.tags
    .map((tag) =>
      typeof tag === "string" ? tag : tag?.name || tag?.label || ""
    )
    .filter(Boolean);
}

function getExcerpt(post) {
  const content =
    post?.excerpt ||
    post?.description ||
    post?.summary ||
    post?.content ||
    "";

  if (typeof content !== "string") {
    return "Discover the ideas, experiences, and stories behind this post.";
  }

  const text = content.replace(/<[^>]*>/g, "").trim();

  if (!text) {
    return "Discover the ideas, experiences, and stories behind this post.";
  }

  return text.length > 140
    ? `${text.slice(0, 140).trim()}...`
    : text;
}

function getDate(post) {
  const value = post?.createdAt || post?.publishedAt || post?.date;

  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getPostUrl(post) {
  const identifier = post?.slug || post?._id || post?.id;

  return identifier ? `/posts/${identifier}` : "/posts";
}

function getPostImage(post) {
  return (
    post?.coverImage ||
    post?.coverImageUrl ||
    post?.thumbnail ||
    post?.image ||
    post?.featuredImage ||
    HERO_IMAGE
  );
}

/* -----------------------------------------
   STORY CARD
----------------------------------------- */

function PostCard({ post }) {
  const author = getAuthor(post);
  const category = getCategory(post);
  const tags = getTags(post);
  const title = post?.title || "Untitled Story";

  return (
    <article className="video-card">
      <Link to={getPostUrl(post)} aria-label={`Read ${title}`}>
        <div className="video-thumbnail">
          <img
            src={getPostImage(post)}
            alt={title}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = HERO_IMAGE;
            }}
          />

          <div className="vv-thumbnail-overlay" />

          <span className="vv-post-badge">{category}</span>

          {post?.readingTime && (
            <span className="vv-post-duration">
              {typeof post.readingTime === "number"
                ? `${post.readingTime} min read`
                : post.readingTime}
            </span>
          )}
        </div>
      </Link>

      <div className="vv-post-body">
        <span className="vv-post-category">{category}</span>

        <Link to={getPostUrl(post)}>
          <h3 className="video-title">{title}</h3>
        </Link>

        <p className="vv-post-excerpt">{getExcerpt(post)}</p>

        {tags.length > 0 && (
          <div className="vv-tags vv-post-tags">
            {tags.slice(0, 2).map((tag) => (
              <span className="vv-tag" key={tag}>
                #{tag.replace(/^#/, "")}
              </span>
            ))}
          </div>
        )}

        <div className="video-meta">
          <img
            className="vv-author-avatar"
            src={author.avatar}
            alt={author.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = DEFAULT_AVATAR;
            }}
          />

          <span className="vv-author-name">{author.name}</span>

          <span className="vv-meta-spacer" />

          {getDate(post) && (
            <span className="vv-post-date">{getDate(post)}</span>
          )}
        </div>
      </div>
    </article>
  );
}

/* -----------------------------------------
   HOMEPAGE
----------------------------------------- */

export default function HomePage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const user = auth?.user || auth?.currentUser || null;

  const authenticated =
    Boolean(user) || Boolean(auth?.isAuthenticated);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Stories");

  /* Fetch posts */

  async function fetchPosts() {
    setLoading(true);
    setError("");

    try {
      const response = await postsAPI.getPosts({
        limit: 20,
        sort: "newest",
      });

      setPosts(getPostsFromResponse(response));
    } catch (err) {
      console.error("Unable to load posts:", err);

      setError(
        err?.message || "Unable to load stories. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  /* Categories */

  const categories = useMemo(() => {
    const actualCategories = posts
      .map(getCategory)
      .filter((category) => category && category !== "Stories");

    return [
      ...new Set([
        ...DEFAULT_CATEGORIES,
        ...actualCategories,
      ]),
    ];
  }, [posts]);

  /* Search and category filtering */

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesSearch =
        !query ||
        (post?.title || "").toLowerCase().includes(query) ||
        getExcerpt(post).toLowerCase().includes(query) ||
        getAuthor(post).name.toLowerCase().includes(query) ||
        getTags(post).join(" ").toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === "All Stories" ||
        getCategory(post).toLowerCase() ===
          activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [posts, search, activeCategory]);

  /* Trending tags */

  const popularTags = useMemo(() => {
    const tagsFromPosts = posts.flatMap(getTags);

    return [
      ...new Set([...tagsFromPosts, ...DEFAULT_TAGS]),
    ].slice(0, 8);
  }, [posts]);

  function searchTag(tag) {
    setSearch(tag.replace(/^#/, ""));
    setActiveCategory("All Stories");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* Render */

  return (
    <div className="vv-home-content">
      <main className="vv-main">
        {/* Page heading and search */}

        <header className="vv-topbar">
          <div>
            <div className="vv-eyebrow">
              <Sparkles size={14} />
              <span>Your daily dose of stories</span>
            </div>

            <h1 className="vv-page-title">
              Find your next{" "}
              <span className="gradient-text">vibe.</span>
            </h1>

            <p className="vv-page-description">
              Discover fresh perspectives, inspiring ideas, and stories
              worth your time.
            </p>
          </div>
        </header>

        {/* Hero banner */}

        <section
          className="vv-hero"
          style={{
            backgroundImage: `url("${HERO_IMAGE}")`,
          }}
        >
          <div className="vv-hero-content">
            <span className="vv-hero-badge">
              <TrendingUp size={14} />
              STORIES THAT INSPIRE
            </span>

            <h2 className="vv-hero-title">
              Every story has
              <br />
              its own <span className="gradient-text">vibe.</span>
            </h2>

            <p className="vv-hero-description">
              A space for curious minds, creative thinkers, and people
              with something meaningful to share.
            </p>

            <div className="vv-hero-actions">
              <Link to="/posts" className="btn-primary">
                Explore Stories
                <ArrowRight size={16} />
              </Link>

              <Link
                to={authenticated ? "/create-post" : "/register"}
                className="btn-secondary"
              >
                <PenSquare size={16} />
                Start Writing
              </Link>
            </div>
          </div>
        </section>

        {/* Categories */}

        <section className="vv-section">
          <div className="vv-section-heading">
            <div>
              <h2 className="vv-section-title">
                Explore Categories
              </h2>

              <p className="vv-section-subtitle">
                Find stories that match your interests.
              </p>
            </div>
          </div>

          <div className="vv-categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-pill ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category === "All Stories" && (
                  <Layers size={14} />
                )}

                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Latest stories */}

        <section className="vv-section" id="latest-stories">
          <div className="vv-section-heading">
            <div>
              <div className="vv-eyebrow">
                <Clock3 size={13} />
                LATEST UPDATES
              </div>

              <h2
                className="vv-section-title"
                style={{ marginTop: 8 }}
              >
                {search
                  ? "Search Results"
                  : activeCategory === "All Stories"
                    ? "Fresh Stories"
                    : activeCategory}
              </h2>

              <p className="vv-section-subtitle">
                {loading
                  ? "Finding the latest stories..."
                  : `${filteredPosts.length} ${
                      filteredPosts.length === 1
                        ? "story"
                        : "stories"
                    } to explore`}
              </p>
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={fetchPosts}
              disabled={loading}
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="vv-post-grid">
              {[1, 2, 3].map((item) => (
                <div className="editorial-card" key={item}>
                  <div
                    className="vv-skeleton"
                    style={{ aspectRatio: "16 / 10" }}
                  />

                  <div className="vv-skeleton-content">
                    <div
                      className="vv-skeleton vv-skeleton-category"
                    />

                    <div
                      className="vv-skeleton vv-skeleton-title"
                    />

                    <div
                      className="vv-skeleton vv-skeleton-description"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="vv-state">
              <RefreshCw size={28} />

              <h3>Something went wrong</h3>

              <p>{error}</p>

              <button
                type="button"
                className="btn-primary vv-state-action"
                onClick={fetchPosts}
              >
                Try Again
              </button>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="vv-post-grid">
              {filteredPosts.map((post, index) => (
                <PostCard
                  key={
                    post?._id ||
                    post?.id ||
                    post?.slug ||
                    index
                  }
                  post={post}
                />
              ))}
            </div>
          ) : (
            <div className="vv-state">
              <Search size={30} />

              <h3>No stories found</h3>

              <p>
                {search
                  ? `No stories match "${search}". Try another search.`
                  : "There are no stories in this category yet."}
              </p>

              <button
                type="button"
                className="btn-secondary vv-state-action"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All Stories");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {!loading && !error && filteredPosts.length > 0 && (
            <div className="vv-explore-all">
              <Link to="/posts" className="btn-secondary">
                Explore All Stories
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>

        {/* Trending topics */}

        <section className="vv-section">
          <div className="vv-section-heading">
            <div>
              <div className="vv-eyebrow">
                <Hash size={13} />
                TRENDING TOPICS
              </div>

              <h2
                className="vv-section-title"
                style={{ marginTop: 8 }}
              >
                Explore by Interest
              </h2>

              <p className="vv-section-subtitle">
                Jump into topics you want to read about.
              </p>
            </div>
          </div>

          <div className="vv-tags">
            {popularTags.map((tag) => (
              <button
                type="button"
                key={tag}
                className="vv-tag"
                onClick={() => searchTag(tag)}
              >
                #{tag.replace(/^#/, "")}
              </button>
            ))}
          </div>
        </section>

        {/* Create-story call to action */}

        <section className="vv-cta">
          <div className="vv-eyebrow">
            <Sparkles size={14} />
            YOUR STORY STARTS HERE
          </div>

          <h2 style={{ marginTop: 12 }}>
            Have something to{" "}
            <span className="gradient-text">share?</span>
          </h2>

          <p>
            Turn your ideas, experiences, and knowledge into stories.
            Connect with readers and give your perspective a place to shine.
          </p>

          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              navigate(
                authenticated ? "/create-post" : "/register"
              )
            }
          >
            <Plus size={17} />
            Create Your Story
            <ArrowRight size={16} />
          </button>
        </section>
      </main>
    </div>
  );
}
