import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/VibeVlog_platform';

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Database connected successfully.');

    // Clear existing data
    console.log('[Seed] Clearing existing collections...');
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});
    console.log('[Seed] Collections cleared.');

    // 1. Create Users
    console.log('[Seed] Creating demo users...');
    const users = await User.create([
      {
        name: 'Sarah Chen',
        username: 'sarah_chen',
        email: 'sarah@example.com',
        password: 'password123',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        bio: 'Lead Frontend Architect & open-source contributor. Passionate about React, performance optimization, and sleek UI craftsmanship.',
      },
      {
        name: 'Alex Rivera',
        username: 'alex_rivera',
        email: 'alex@example.com',
        password: 'password123',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bio: 'Distributed systems & cloud engineer. Writing about scalable backend architectures, Node.js, and databases.',
      },
      {
        name: 'Marcus Vance',
        username: 'marcus_vance',
        email: 'marcus@example.com',
        password: 'password123',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        bio: 'Full-stack software engineer & design systems enthusiast. Believes beautiful code produces beautiful interfaces.',
      },
      {
        name: 'Elena Rostova',
        username: 'elena_rostova',
        email: 'elena@example.com',
        password: 'password123',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: 'AI Platform Engineer building next-generation agentic workflows and intelligent developer tools.',
      },
    ]);

    const [sarah, alex, marcus, elena] = users;
    console.log(`[Seed] Created ${users.length} users.`);

    // 2. Create VibeVlog Posts
    console.log('[Seed] Creating demo VibeVlog posts...');
    const postsData = [
      {
        title: 'Mastering React 19: Actions, useOptimistic, and Server Architecture',
        slug: 'mastering-react-19-actions-and-server-architecture',
        author: sarah._id,
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'Explore the revolutionary features in React 19, including native form actions, optimistic state transitions, and server components that minimize client bundles.',
        tags: ['React', 'JavaScript', 'WebDevelopment', 'Frontend'],
        status: 'published',
        views: 342,
        content: `React 19 marks one of the most substantial leaps forward for UI engineering. The shift toward native Actions and integrated asynchronous workflows streamlines application logic and eliminates massive boilerplate.

### Why Actions Change Everything

Traditionally, managing async mutations required manual tracking of pending states, error handling, and manual cache invalidation:

\`\`\`javascript
// The legacy pattern
const [isPending, setIsPending] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsPending(true);
  try {
    await updateProfile(formData);
  } catch (err) {
    setError(err);
  } finally {
    setIsPending(false);
  }
};
\`\`\`

With React 19 Actions and \`useActionState\`, the pending lifecycle, error boundary, and optimistic updates become first-class framework primitives.

### The useOptimistic Hook

User expectations for instantaneous feedback have never been higher. The \`useOptimistic\` hook allows you to project the expected state immediately while the backend confirms the operation. If a network error occurs, React automatically rolls back without messy manual state management.

### Key Takeaways
1. Native Actions reduce client-side state boilerplate by over 40%.
2. Optimistic mutations yield zero-perceived-latency interfaces.
3. React Compiler provides effortless memoization under the hood.`,
      },
      {
        title: 'Building Resilient REST APIs with Node.js, Express, and MongoDB',
        slug: 'building-resilient-rest-apis-with-nodejs-and-mongodb',
        author: alex._id,
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'A comprehensive blueprint for building scalable, secure, and production-grade REST APIs with robust error handling, connection resilience, and indexing.',
        tags: ['Node.js', 'Express', 'MongoDB', 'Backend', 'API'],
        status: 'published',
        views: 512,
        content: `Designing a backend that behaves reliably under high concurrency requires thoughtful architectural decisions from day one. In this article, we break down essential patterns for Node.js and MongoDB.

### 1. Connection Pool Optimization

Default Mongoose settings are suitable for development, but in high-throughput environments you must configure pool sizes and timeouts:

\`\`\`javascript
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 50,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
\`\`\`

### 2. Centralized Error Middleware

Never scatter try/catch blocks that return mismatched error formats. Create a single error handler that intercepts standard errors, Mongoose validation errors, and JWT expiration tokens into predictable JSON contracts:

\`\`\`javascript
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
  });
};
\`\`\`

### 3. Smart Indexing Strategies

Queries with compound filters must leverage compound indexes. Without them, MongoDB executes collection scans that degrade performance exponentially as records grow.`,
      },
      {
        title: 'The Modern Frontend Architecture Playbook for 2026',
        slug: 'modern-frontend-architecture-playbook-2026',
        author: marcus._id,
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'How modern engineering teams structure design systems, modular state stores, component boundaries, and testing pipelines for enterprise scale.',
        tags: ['Architecture', 'WebDevelopment', 'DesignSystems', 'CSS'],
        status: 'published',
        views: 289,
        content: `Frontend development has matured from fragmented script tags into sophisticated software engineering systems. Let us dissect what defines a world-class frontend architecture today.

### Atomic Design and Token-Based Theming

Design tokens form the bedrock of a scalable design system. By establishing semantic tokens for spacing, typography, surfaces, and elevations, you decouple visual identity from arbitrary hardcoded pixels:

- **Surface Tokens:** \`bg-canvas\`, \`bg-surface\`, \`bg-overlay\`
- **Accent Tokens:** \`primary-500\`, \`primary-glow\`, \`accent-amber\`
- **Border Tokens:** \`border-subtle\`, \`border-hover\`

### Separation of Concerns

Keep presentational components strictly decoupled from data fetching. Components should receive props and emit events, while custom hooks encapsulate business logic and API interactions.`,
      },
      {
        title: 'Zero-Trust Security for Full-Stack Applications: A Pragmatic Guide',
        slug: 'zero-trust-security-for-full-stack-applications',
        author: alex._id,
        coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'Learn how to secure JWT sessions, prevent XSS and NoSQL injection, enforce rigorous input sanitization, and safeguard user privacy.',
        tags: ['Security', 'Node.js', 'Auth', 'WebDevelopment'],
        status: 'published',
        views: 418,
        content: `Security is not an afterthought or an add-on; it is an intrinsic pillar of full-stack software development.

### Protecting Authentication Endpoints

Passwords must always be hashed using slow cryptographic algorithms such as bcrypt with adequate work factors (salt rounds 10 or 12). Plaintext passwords must never hit your persistence layer or logs.

\`\`\`javascript
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(rawPassword, salt);
\`\`\`

### Mitigating Injection Attacks

1. Always validate and sanitize user inputs using schema validators.
2. In MongoDB, avoid passing unsanitized query objects directly from \`req.body\` or \`req.query\` to prevent operator injection (\`$ne\`, \`$gt\`).
3. Sanitize HTML output before rendering to extinguish Cross-Site Scripting (XSS).`,
      },
      {
        title: 'Tailwind CSS v4: Deep Dive into the High-Performance Engine',
        slug: 'tailwind-css-v4-deep-dive-into-the-engine',
        author: sarah._id,
        coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'An in-depth look at Tailwind CSS v4, the Rust-powered compiler, native CSS cascaded layers, and how it transforms build speed and ergonomics.',
        tags: ['TailwindCSS', 'CSS', 'Frontend', 'WebDevelopment'],
        status: 'published',
        views: 630,
        content: `Tailwind CSS v4 is a total ground-up redesign of the beloved utility-first CSS framework. Gone are complex configuration files and slow PostCSS pipelines; in their place stands an extraordinarily fast engine.

### Zero Configuration by Default

In v4, a single \`@import "tailwindcss";\` directive in your main stylesheet is all you need. The compiler automatically scans your template files without needing a verbose \`content\` array in a config file.

### Native CSS Variable Integration

Color palettes and theme tokens are mapped directly into native CSS variables, making dynamic runtime theming and dark mode effortless without generating redundant class permutations.`,
      },
      {
        title: 'Database Indexing Strategies: Accelerating Mongoose Queries by 10x',
        slug: 'database-indexing-strategies-accelerating-mongoose-queries',
        author: alex._id,
        coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'Stop relying on slow collection scans. Understand B-tree indexing, compound indexes, text search indexes, and how to profile queries using explain().',
        tags: ['MongoDB', 'Database', 'Backend', 'Performance'],
        status: 'published',
        views: 310,
        content: `When your database has 100 documents, almost any query feels instantaneous. When your collection grows to 500,000 documents, unindexed lookups will bring your node event loop to a grinding halt.

### Understanding the Equality, Sort, Range (ESR) Rule

When designing compound indexes in MongoDB, adhere strictly to the ESR rule:
1. **Equality:** Fields tested for exact matches go first.
2. **Sort:** Fields by which results will be ordered come next.
3. **Range:** Fields filtered with range operators (\`$gt\`, \`$in\`, \`$regex\`) go last.

\`\`\`javascript
// Ideal index for: find({ status: 'published', createdAt: { $gt: date } }).sort({ views: -1 })
postSchema.index({ status: 1, views: -1, createdAt: 1 });
\`\`\`

Utilize \`.explain("executionStats")\` to verify that your queries are fulfilling using an \`IXSCAN\` rather than a \`COLLSCAN\`.`,
      },
      {
        title: 'Architecting Intelligent Web Experiences with AI Agents',
        slug: 'architecting-intelligent-web-experiences-with-ai-agents',
        author: elena._id,
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'How modern web applications integrate autonomous agentic workflows, streaming completions, tool-calling interfaces, and vector databases.',
        tags: ['AI', 'Architecture', 'JavaScript', 'WebDevelopment'],
        status: 'published',
        views: 890,
        content: `The intersection of web development and generative artificial intelligence is shifting from simple chatbot wrappers to deeply integrated agentic workflows.

### Tool Calling and Structured Outputs

Modern language models can output deterministic JSON conforming to JSON Schema. This allows web applications to empower agents with tools: querying APIs, modifying database records, and fetching external data on behalf of the user.

### Streaming UX Patterns

Never make users stare at a static loading spinner for 10 seconds. Using Server-Sent Events (SSE) or WebSockets, stream token responses incrementally to provide instant feedback and an engaging reading experience.`,
      },
      {
        title: 'State Management in Modern Web Apps: Signals vs Stores vs Context',
        slug: 'state-management-in-modern-web-apps-signals-vs-stores',
        author: marcus._id,
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'Evaluating fine-grained reactivity, atomic stores, and React Context. Learn how to choose the right state primitive without over-engineering.',
        tags: ['React', 'JavaScript', 'WebDevelopment', 'Architecture'],
        status: 'published',
        views: 450,
        content: `State management remains one of the most vigorously debated topics in web development. Let us objectively analyze when to reach for each state solution.

### The Rule of Locality

Before reaching for an external store:
1. **Local State (\`useState\`):** Keeps state encapsulated within the component that owns it.
2. **Lifted State:** Share state between closely related siblings.
3. **Context API:** Ideal for low-frequency global values like authentication state, active theme, and locale.
4. **Dedicated Stores (Zustand, Signals):** Indispensable for high-frequency updates and complex decoupled graphs.`,
      },
      {
        title: 'Crafting Modern Developer Experiences with Antigravity',
        slug: 'crafting-modern-developer-experiences-with-antigravity',
        author: sarah._id,
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'How agentic pair programming tools like Antigravity empower software engineers to rapidly build, test, and ship complete full-stack web applications.',
        tags: ['Programming', 'WebDevelopment', 'AI', 'JavaScript'],
        status: 'published',
        views: 720,
        content: `Modern software engineering is undergoing a transformative shift. Autonomous AI coding partners allow developers to focus on high-level architecture and user experience while automating repetitive implementation tasks.

### The Power of End-to-End Execution

Instead of isolated snippets, full-stack orchestration allows developers to build entire REST APIs, configure database schemas, create beautiful responsive UI components, and test integrated flows in a single workflow.`,
      },
    ];

    const posts = await Post.create(postsData);
    console.log(`[Seed] Created ${posts.length} VibeVlog posts.`);

    // 3. Create Comments
    console.log('[Seed] Creating demo comments...');
    const commentsData = [
      {
        content: 'Exceptional breakdown of React 19 Actions! We migrated our dashboard forms to useActionState and the reduction in boilerplate was immediate.',
        author: alex._id,
        post: posts[0]._id,
      },
      {
        content: 'useOptimistic was the missing link for our chat and reaction components. Great article, Sarah!',
        author: marcus._id,
        post: posts[0]._id,
      },
      {
        content: 'Solid advice on MongoDB connection pooling and ESR indexing. We had an unindexed compound sort that was spiking our CPU until we fixed the index order.',
        author: sarah._id,
        post: posts[1]._id,
      },
      {
        content: 'The centralized error handling pattern is clean and maintainable. Thanks for sharing this blueprint.',
        author: elena._id,
        post: posts[1]._id,
      },
      {
        content: 'The section on design tokens and separation of concerns resonates so much. Clean architecture pays massive dividends over time.',
        author: alex._id,
        post: posts[2]._id,
      },
      {
        content: 'Crucial reminders on input sanitization. Security should never be compromised for delivery speed.',
        author: marcus._id,
        post: posts[3]._id,
      },
      {
        content: 'Tailwind v4 is blazing fast! The zero-config setup combined with native CSS variables makes styling pure joy.',
        author: elena._id,
        post: posts[4]._id,
      },
      {
        content: 'The ESR rule explanation is gold. Bookmarked for reference!',
        author: sarah._id,
        post: posts[5]._id,
      },
      {
        content: 'Streaming responses with Server-Sent Events really is the key to delightful UX in AI apps.',
        author: alex._id,
        post: posts[6]._id,
      },
      {
        content: 'The rule of locality is spot on. Too many projects jump into complex global stores prematurely.',
        author: sarah._id,
        post: posts[7]._id,
      },
    ];

    await Comment.create(commentsData);
    console.log(`[Seed] Created ${commentsData.length} comments.`);

    console.log('\n=============================================');
    console.log(' SEEDING COMPLETED SUCCESSFULLY!');
    console.log(' Sample Accounts Available for Testing:');
    console.log(' 1. sarah_chen   | sarah@example.com   | password123');
    console.log(' 2. alex_rivera  | alex@example.com    | password123');
    console.log(' 3. marcus_vance | marcus@example.com  | password123');
    console.log(' 4. elena_rostova| elena@example.com   | password123');
    console.log('=============================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
