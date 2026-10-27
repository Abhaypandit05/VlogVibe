import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Compass,
  Heart,
  MessageCircle,
  PenSquare,
  Sparkles,
  Users,
  ArrowRight,
  Quote,
} from "lucide-react";

const AboutPage = () => {
  const features = [
    {
      icon: PenSquare,
      title: "Share Your Stories",
      description:
        "Turn your thoughts, experiences, knowledge, and ideas into stories that people can discover and enjoy.",
      color: "pink",
    },
    {
      icon: Compass,
      title: "Discover New Perspectives",
      description:
        "Explore different topics, discover fresh ideas, and find stories that match your interests and curiosity.",
      color: "purple",
    },
    {
      icon: MessageCircle,
      title: "Join the Conversation",
      description:
        "Share your thoughts through comments, exchange perspectives, and connect with people who enjoy meaningful discussions.",
      color: "blue",
    },
    {
      icon: Users,
      title: "Build Your Community",
      description:
        "Give your voice a place to grow, connect with readers, and become part of a community built around storytelling.",
      color: "green",
    },
  ];

  return (
    <div className="vv-about-page">
      {/* Hero section */}
      <section className="vv-about-hero">
        <div className="vv-about-glow vv-about-glow-one" />
        <div className="vv-about-glow vv-about-glow-two" />

        <div className="vv-about-hero-content">
          <div className="vv-about-badge">
            <Sparkles size={15} />
            <span>Every Story Has a Vibe</span>
          </div>

          <h1 className="vv-about-title">
            More than words.
            <br />
            <span className="gradient-text">
              Stories that connect.
            </span>
          </h1>

          <p className="vv-about-intro">
            Welcome to VibeVlog, a place where ideas find their voice,
            experiences become stories, and different perspectives bring
            people together. Discover something new, share what matters
            to you, and make every story count.
          </p>

          <div className="vv-about-actions">
            <Link to="/posts" className="btn-primary">
              <BookOpen size={17} />
              Explore Stories
              <ArrowRight size={16} />
            </Link>

            <Link to="/create-post" className="btn-secondary">
              <PenSquare size={17} />
              Write Your Story
            </Link>
          </div>
        </div>

        <div className="vv-about-hero-image">
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=85"
            alt="Notebook and pen ready for a new story"
          />

          <div className="vv-about-image-overlay" />

          <div className="vv-about-image-caption">
            <span className="vv-about-caption-icon">
              <Quote size={18} />
            </span>

            <div>
              <p>Every voice matters.</p>
              <span>Your story deserves to be heard.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our purpose */}
      <section className="vv-about-section">
        <div className="vv-about-section-heading">
          <span className="vv-about-eyebrow">
            WHY VIBEVLOG EXISTS
          </span>

          <h2>
            A home for ideas,
            <br />
            <span className="gradient-text">experiences, and voices.</span>
          </h2>
        </div>

        <div className="vv-about-purpose">
          <div className="vv-about-purpose-icon">
            <Heart size={25} />
          </div>

          <div>
            <h3>Built around the power of storytelling</h3>

            <p>
              Everyone has a story worth sharing. It might be a lesson
              learned, a personal experience, a creative idea, a travel
              memory, or a perspective that helps someone see the world
              differently.
            </p>

            <p>
              VibeVlog brings these stories together in one place. Our
              goal is to make discovering and sharing content feel
              simple, welcoming, and meaningful, whether you're here to
              write your first post or find your next interesting read.
            </p>
          </div>
        </div>
      </section>

      {/* What you can do */}
      <section className="vv-about-section">
        <div className="vv-about-section-heading">
          <span className="vv-about-eyebrow">
            THE VIBEVLOG EXPERIENCE
          </span>

          <h2>
            Discover. Share.
            <span className="gradient-text"> Connect.</span>
          </h2>

          <p>
            Everything starts with a story. Here's how you can be part
            of the experience.
          </p>
        </div>

        <div className="vv-about-features">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <article
                className="vv-about-feature-card"
                key={feature.title}
              >
                <div className={`vv-about-feature-icon ${feature.color}`}>
                  <Icon size={22} />
                </div>

                <span className="vv-about-feature-number">
                  0{index + 1}
                </span>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Community values */}
      <section className="vv-about-values">
        <div className="vv-about-values-content">
          <span className="vv-about-eyebrow">
            WHAT WE BELIEVE IN
          </span>

          <h2>
            Good stories create
            <br />
            <span className="gradient-text">meaningful connections.</span>
          </h2>

          <p>
            We believe in curiosity, creativity, authentic voices, and
            the freedom to share ideas. Every reader brings a different
            perspective, and every writer has something unique to offer.
            VibeVlog is where those perspectives meet.
          </p>

          <div className="vv-about-value-list">
            <div>
              <span className="vv-about-value-dot" />
              <span>Authentic expression</span>
            </div>

            <div>
              <span className="vv-about-value-dot" />
              <span>Curiosity and discovery</span>
            </div>

            <div>
              <span className="vv-about-value-dot" />
              <span>Respectful conversations</span>
            </div>

            <div>
              <span className="vv-about-value-dot" />
              <span>Ideas worth sharing</span>
            </div>
          </div>
        </div>

        <div className="vv-about-values-art">
          <div className="vv-about-orbit vv-about-orbit-one" />
          <div className="vv-about-orbit vv-about-orbit-two" />

          <div className="vv-about-values-center">
            <Sparkles size={34} />
            <span>Find Your Vibe</span>
          </div>

          <div className="vv-about-floating-icon vv-about-floating-one">
            <BookOpen size={21} />
          </div>

          <div className="vv-about-floating-icon vv-about-floating-two">
            <Heart size={21} />
          </div>

          <div className="vv-about-floating-icon vv-about-floating-three">
            <MessageCircle size={21} />
          </div>
        </div>
      </section>

      {/* Final call to action */}
      <section className="vv-about-cta">
        <div className="vv-about-cta-icon">
          <PenSquare size={25} />
        </div>

        <span className="vv-about-eyebrow">
          YOUR STORY STARTS HERE
        </span>

        <h2>
          Have a story to tell?
          <br />
          <span className="gradient-text">We'd love to read it.</span>
        </h2>

        <p>
          Start writing, discover new perspectives, and become part of
          the VibeVlog community.
        </p>

        <div className="vv-about-actions">
          <Link to="/create-post" className="btn-primary">
            Start Writing
            <ArrowRight size={17} />
          </Link>

          <Link to="/posts" className="btn-secondary">
            Discover Stories
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
