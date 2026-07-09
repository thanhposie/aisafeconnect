# SafeConnect

> Real-time anonymous video chat platform with AI-powered harmful content moderation.

![SafeConnect](https://img.shields.io/badge/SafeConnect-v1.0.0-7c3aed?style=for-the-badge&logo=shield&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## Overview

SafeConnect is a cutting-edge anonymous video chat platform that leverages AI-powered content moderation to create safe and meaningful connections between users worldwide. Chat anonymously, report harmful behavior, and enjoy real-time video conversations in a protected environment.

## Features

- **Anonymous Matching** — Get paired with random users for secure, anonymous video conversations
- **Real-time Video Chat** — Crystal-clear WebRTC-powered peer-to-peer video and audio
- **AI Content Moderation** — Automated detection and filtering of harmful or inappropriate content
- **User Reporting** — Built-in reporting system to flag unsafe behavior
- **Privacy First** — No personal data stored; conversations are end-to-end encrypted

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React, TypeScript, Tailwind CSS   |
| Bundler    | Vite                              |
| Routing    | React Router                      |
| HTTP       | Axios                             |
| Real-time  | Socket.IO (planned)               |
| Video      | WebRTC (planned)                  |
| Backend    | Node.js, Express (planned)        |
| Database   | MongoDB (planned)                 |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd safeconnect

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start development server with HMR   |
| `npm run build`   | Type-check and build for production  |
| `npm run lint`    | Run OxLint for code quality          |
| `npm run preview` | Preview production build locally     |

## Project Structure

```
src/
├── assets/               # Static assets (images, icons)
├── components/
│   ├── common/           # Reusable UI components
│   └── layout/           # Layout components (Navbar, Footer, Hero)
├── contexts/             # React context providers
├── hooks/                # Custom React hooks
├── pages/                # Page-level components
├── routes/               # Route configuration
├── services/             # API, Socket.IO, and WebRTC services
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── App.tsx               # Root application component
└── main.tsx              # Application entry point
```

## Roadmap

- [x] Project scaffolding and routing
- [x] Home page with feature cards
- [x] Placeholder pages (Login, Register, Chat, Profile, Report)
- [ ] Backend API with Express + MongoDB
- [ ] Socket.IO real-time matchmaking
- [ ] WebRTC peer-to-peer video streaming
- [ ] AI content moderation engine
- [ ] User authentication (JWT)
- [ ] Admin dashboard

## License

This project is proprietary. All rights reserved.

---

**SafeConnect** — *Connect safely. Chat freely.*
