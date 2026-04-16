# 📘 Learn With H

### Financial Blog Platform — Built on Supabase

A modern, full-stack financial blog platform delivering content on personal finance, investing, and money management — built with React and Supabase, designed for real-world usability and scale.

**Learn With H** is a production-ready blogging platform that covers the full content lifecycle — from user authentication and blog creation to categorized browsing and a responsive reading experience.

Built independently using React and Supabase as a complete backend solution, this project demonstrates clean architecture, real-world BaaS integration, and performance-focused design.

---

## 🚀 Live Demo

🌐 https://www.learnwithh.in/

---

## ✨ Features

### 📖 Reader Experience

* Browse blogs across categories (Investing, Personal Finance, etc.)
* Clean, distraction-free reading UI
* Fully responsive (desktop, tablet, mobile)

### ✍️ Content Management

* Create and publish blog posts
* Categorized content structure
* Scalable database design

### 🔐 Authentication

* Secure login/signup via Supabase Auth
* JWT-based session management
* Protected routes for authenticated users

---

## 🛠️ Tech Stack

| Layer          | Technology                |
| -------------- | ------------------------- |
| Frontend       | React.js                  |
| Backend        | Supabase (BaaS)           |
| Database       | PostgreSQL (via Supabase) |
| Authentication | Supabase Auth (JWT)       |
| APIs           | Auto-generated REST APIs  |
| Deployment     | Vercel + Supabase         |
| Tools          | Git, GitHub, VS Code      |

---

## 🔐 Authentication Flow

```
User Login / Register
        ↓
   Supabase Auth
        ↓
Password securely stored
        ↓
   JWT Token issued
        ↓
 Stored on client
        ↓
Protected routes validated
        ↓
 Access granted / denied
```

---

## 📝 Blog Publishing Flow

```
User creates blog
        ↓
Frontend validation
        ↓
Sent to Supabase API
        ↓
Stored in PostgreSQL
        ↓
Live for users
```

---

## ⚡ API Overview

| Module     | Operations                                  |
| ---------- | ------------------------------------------- |
| Auth       | Register, Login, Logout, Session Management |
| Blogs      | Create, Read, Update, Delete                |
| Categories | List, Filter                                |
| Users      | Profile Management                          |

---

## 🗄️ Database Design

* **Users** → profile, credentials
* **Posts** → title, content, category, author
* **Categories** → slug, label

Includes **Row-Level Security (RLS)** for secure data access.

---

## 📁 Project Structure

```
learn-with-h/
├── src/
│   ├── components/   # UI components
│   ├── pages/        # Pages (routes)
│   ├── services/     # Supabase logic
│   └── utils/        # Helpers
├── public/
├── .env.example
└── README.md
```

---

## 🏃 Getting Started

### Prerequisites

* Node.js (v18+)
* Supabase account

### Installation

```bash
git clone https://github.com/iamheet/learn-with-h
cd learn-with-h
npm install
```

### Setup

```bash
cp .env.example .env
```

Add your Supabase credentials:

```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### Run

```bash
npm run dev
```

---

## 💡 Key Highlights

* 🚀 Full BaaS architecture (no custom backend needed)
* 🔐 Secure authentication with RLS policies
* ⚡ Auto-generated APIs
* 🌍 Fully deployed production app
* 👨‍💻 Built end-to-end independently

---

## 🗺️ Roadmap

* AI-based blog recommendations
* Advanced search & filtering
* User dashboard
* Comments system
* Dark mode

---

## 🔮 Future Vision

* AI-powered content personalization
* Newsletter system
* Monetization (subscriptions)
* Writer analytics dashboard

---

## 👨‍💻 Author

**Heet Chokshi**
🔗 https://www.linkedin.com/in/iamheetchokshi/

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

---

Built with React, Supabase, and a belief that financial literacy should be accessible to everyone 📈
