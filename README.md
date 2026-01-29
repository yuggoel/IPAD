# IPAD — iPod-style Music Player (React + Vite)

A small React project that emulates an iPod-style UI and music player. Built with Vite and Tailwind CSS; the UI and app logic live under the `frontend` folder.

## Features
- iPod-like click wheel navigation UI
- Music list, now playing, search, and settings screens
- Simple built-in games (Memory, Snake, TicTacToe)

## Project structure
- `frontend/` — React app (Vite + Tailwind)
  - `src/` — application source
  - `src/components/` — UI components (ClickWheel, Menu, Screens, Games)
  - `src/services/` — simple services (e.g., `musicService.js`)

## Prerequisites
- Node.js 18+ (recommended)
- npm (or yarn)

## Install
From the project root, install dependencies for the frontend:

```bash
cd frontend
npm install
```

## Development
Run the dev server (Vite):

```bash
cd frontend
npm run dev
```

Open the app at the URL shown by Vite (typically http://localhost:5173).

## Build / Preview
Build the production bundle:

```bash
cd frontend
npm run build
```

Preview the production build locally:

```bash
cd frontend
npm run preview
```

## Linting
Run ESLint for the frontend:

```bash
cd frontend
npm run lint
```

## Notes
- The project uses React 18 and Vite. Tailwind is configured in `frontend/tailwind.config.js`.
- If you plan to commit, consider adding `.env` or other personal configs to `.gitignore`.

## Want help?
If you'd like, I can:
- Commit the README for you,
- Add a short contributing or development checklist,
- Or create a minimal README in `frontend/` as well.

Enjoy!
