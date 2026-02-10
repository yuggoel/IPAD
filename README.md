# IPOD — iPod-style Music Player (React + Vite)

A stunning React project that emulates an iPod-style UI and music player with **advanced 3D effects**. Built with Vite and Tailwind CSS; the UI and app logic live under the `frontend` folder.

## Features
- 🎨 **Advanced 3D iPod Interface** with realistic depth and materials
  - Interactive mouse-controlled rotation (25° range on X/Y axes)
  - Floating animation with pulsing glow effects
  - Multi-layered shadows for realistic depth perception
  - Glass screen with reflections and lighting effects
  - Metallic click wheel with touch-ring gradient
  - Smooth physics-based transitions and damping
- 🎵 iPod-like click wheel navigation UI
- 📱 Music list, now playing, search, and settings screens
- 🎮 Simple built-in games (Memory, Snake, TicTacToe)
- 🌊 Dynamic liquid ether background that responds to iPod color theme

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
- **3D Effects**: The iPod features advanced CSS transforms with `perspective`, `translateZ`, and interactive rotation via mouse tracking
- **Animations**: Includes floating animation (6s cycle), glow pulse (4s cycle), shimmer effects, and smooth cubic-bezier easing
- **Performance**: Optimized with `requestAnimationFrame` for smooth 60fps rotation and `willChange` CSS hints
- If you plan to commit, consider adding `.env` or other personal configs to `.gitignore`.

## 3D Technology Stack
- **CSS Transforms**: Multi-layer 3D transforms with `preserve-3d`
- **Animations**: Keyframe animations for floating, glowing, and shimmer effects
- **Interactive Physics**: Mouse-controlled parallax with smooth damping
- **Materials**: Radial/conic gradients for realistic glass, metal, and plastic surfaces
- **Lighting**: Multiple pseudo-elements for reflections, highlights, and shadows

## Want help?
If you'd like, I can:
- Add screenshots or GIFs demonstrating the 3D effects
- Create deployment instructions for Vercel/Netlify
- Add a contributing guide or development checklist

## Screenshots
Move your mouse over the iPod to experience the interactive 3D rotation! The device features:
- Realistic depth with elevated screen (25px) and click wheel (15px)
- Dynamic lighting that changes with viewing angle
- Premium material effects (glass screen, metallic wheel, glossy case)
- Smooth animations and responsive interactions

Enjoy!
