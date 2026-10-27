# BlogSphere — Full-Stack Blog Platform with Comments

A modern, production-quality blogging platform built with **React 19**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**. Features end-to-end JWT authentication, full blog post CRUD, interactive comments, search and tag filtering, author dashboard, profile management, sleek "Midnight Editorial" developer aesthetic, and an automated **Admin Email Notification System** for user registrations and logins.

---

## 🚀 Features

- **Authentication System & Admin Alerts**
  - Secure registration with client and server validation (email format, password confirmation, duplicate checks)
  - Bcrypt password salting and hashing (no plaintext storage)
  - Stateless JWT authentication with Bearer token header injection
  - **Admin Email Notification System**: Dispatches instant, secure HTML/plaintext notification emails to the administrator (`hariomanand62@gmail.com`) upon new user registration and successful logins.
  - Strict privacy standards: **Never** transmits or logs passwords, hashes, or JWT tokens.
  - 1-Click Demo Accounts for rapid testing and evaluation
  - Secure logout and protected route guards

- **Blog Post Management (CRUD)**
  - Create new articles with live preview, Markdown syntax formatting helpers, and cover image presets
  - Read individual posts with automated reading time estimation, author profiles, and view counters
  - Edit existing articles (strictly author-only authorization)
  - Delete articles with modal confirmations and automated cascading comment deletion
  - Draft vs Published status support

- **Interactive Comments System**
  - Publicly readable comment threads on every blog post
  - Authenticated commenting with instant updates
  - Comment deletion with strict author ownership enforcement
  - Friendly guest login prompt for unauthenticated readers

- **Discovery & Search**
  - Real-time search across titles, contents, excerpts, tags, and author names
  - Interactive tag filtering chips
  - Multi-attribute sorting (Newest, Oldest, Most Viewed, Most Comments)
  - Pagination controls with responsive grid cards

- **Author Dashboard & Profile**
  - Author metrics: Total Posts, Published vs Drafts, Lifetime Views, and Comments
  - Post management table with quick View, Edit, and Delete actions
  - Editable user profile: Display Name, Username uniqueness check, Bio, and Avatar selector

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router 7, Axios, Lucide React, Framer Motion |
| **Backend** | Node.js, Express.js, RESTful APIs, Morgan logger, Cors |
| **Email Service** | Nodemailer, Transactional HTML Templates, User-Agent Device/OS Parser |
| **Database** | MongoDB, Mongoose ODM with compound indexing and virtuals |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js |

---

## 📁 Project Structure

```text
blog-platform/
│
├── client/                      # Frontend React + Vite application
│   ├── src/
│   │   ├── components/          # Navbar, Footer, PostCard, CommentSection, Modals, Skeletons
│   │   ├── pages/               # HomePage, PostsPage, SinglePostPage, CreatePostPage, etc.
│   │   ├── layouts/             # RootLayout with ambient background & scroll restoration
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # Centralized Axios API service with interceptors
│   │   ├── context/             # AuthContext, ThemeContext, ToastContext
│   │   ├── utils/               # Formatters (dates, reading time, avatars)
│   │   ├── App.jsx              # Application routing table
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Midnight Editorial design tokens & Source Serif 4
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Backend Express + Node.js API
│   ├── config/                  # Mongoose MongoDB connection & Nodemailer transporter
│   │   ├── db.js
│   │   └── email.js
│   ├── controllers/             # Auth, User, Post, and Comment business logic
│   ├── middleware/              # JWT auth guard, optional auth, and error handlers
│   ├── models/                  # User, Post, and Comment schemas
│   ├── routes/                  # Express API route declarations
│   ├── services/                # Admin email notification service
│   │   └── emailService.js
│   ├── templates/               # Branded HTML email templates
│   │   ├── registrationEmail.js
│   │   └── loginEmail.js
│   ├── utils/                   # Device/OS/Browser parser & JWT token generation
│   │   └── deviceParser.js
│   ├── scripts/                 # Realistic database seed script
│   ├── server.js                # Express app entry point
│   └── package.json
│
├── .env.example                 # Example environment variables template
├── .gitignore                   # Ignored files (node_modules, .env, dist)
├── package.json                 # Root script runner (concurrently)
└── README.md                    # Project documentation
```

---

## ⚙️ Quick Start & Installation

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a remote MongoDB Atlas URI

### 1. Clone & Install Dependencies

From the project root:

```bash
# Install root orchestration tools
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
cd ..
```

Or run all installs in one step from root:
```bash
npm run install:all
```

---

### 2. Environment Variables Configuration

Copy `.env.example` into `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/blog_platform
JWT_SECRET=supersecret_jwt_key_change_in_production_12345
NODE_ENV=development

# Admin Email Notification Configuration
ADMIN_EMAIL=hariomanand62@gmail.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM="BlogSphere Admin" <notifications@blogsphere.dev>
```

> **Note on Email Notifications**:
> If SMTP credentials (`EMAIL_USER` / `EMAIL_PASSWORD`) are not set, Nodemailer utilizes a development fallback transporter that logs delivery previews and audit events to the server console without interruption. To deliver emails directly to `hariomanand62@gmail.com`, simply provide your SMTP credentials or Gmail App Password in `EMAIL_USER` and `EMAIL_PASSWORD`.

---

### 3. Seed Realistic Demo Data

Populate the database with 4 authors, 9 technical blog articles, and reader comments:

```bash
npm run seed
```

#### Pre-Configured Demo Accounts:
| User | Email | Password | Role |
|---|---|---|---|
| **Sarah Chen** | `sarah@example.com` | `password123` | Frontend Architect |
| **Alex Rivera** | `alex@example.com` | `password123` | Cloud & Distributed Systems |
| **Marcus Vance** | `marcus@example.com` | `password123` | Full-Stack UI/UX |
| **Elena Rostova** | `elena@example.com` | `password123` | AI Platform Engineer |

---

### 4. Run the Full Application

From the root directory, start both the Express backend and Vite frontend concurrently:

```bash
npm run dev
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Backend API Server:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📧 Admin Notification System Details

### 1. User Registration Event
Triggered automatically when a new author signs up via `POST /api/auth/register`:
- **Recipient:** `hariomanand62@gmail.com`
- **Subject:** `New BlogSphere User Registration`
- **Payload:** User Name, Username, Email, Registration Time, MongoDB User ID.
- **Privacy:** User password is encrypted with bcrypt and is **never** included in email or logs.

### 2. User Login Event
Triggered automatically on successful authentication via `POST /api/auth/login`:
- **Recipient:** `hariomanand62@gmail.com`
- **Subject:** `BlogSphere Login Activity — [USERNAME]`
- **Payload:** User Name, Username, Email, Login Time, Client IP Address, Device Category, Operating System, Browser.
- **Privacy:** Passwords, password hashes, and JWT tokens are **never** included. Failed attempts do not trigger login success notifications.

---

## 🛡️ Security & Privacy Implementation

1. **Zero Credential Exposure**: Passwords, hashes, and JWT tokens are completely excluded from email templates, service calls, and audit logs.
2. **Bcrypt Password Hashing**: Passwords are salted and hashed with a factor of 10 prior to persistence.
3. **Strict Resource Ownership**: Only authors can modify or delete their respective posts and comments.
4. **Resilient Notification Dispatch**: If an email delivery fails, the error is securely logged and will never abort or crash the user's registration or login response.
5. **No Secrets in Frontend**: Email configuration and SMTP credentials exist purely on the Express backend.

---

## 📄 License
MIT License. Created with Antigravity.
