## Complete Guide for New Developers

This section provides a step-by-step walkthrough for developers new to React, Vite, or web development. Follow these instructions to get started, understand the project, and begin contributing.

### 1. Prerequisites
- **Install Node.js:** Download and install Node.js (v16 or higher) from [nodejs.org](https://nodejs.org/).
- **Install a Code Editor:** [Visual Studio Code](https://code.visualstudio.com/) is recommended.
- **Clone the Repository:** Use Git or download the project ZIP and extract it.

### 2. Project Setup
Open a terminal and run the following commands:

```bash
cd frontend
npm install
```
This installs all required packages.

### 3. Running the App
Start the development server:

```bash
npm run dev
```
Open your browser to the address shown in the terminal (usually http://localhost:5173).

### 4. Project Structure Overview
- **public/songs/**: Place your MP3 files here for playback.
- **src/components/**: UI building blocks (menus, screens, games, etc.).
- **src/api/musicApi.js**: Handles all communication with the backend API using axios.
- **src/context/IpodContext.jsx**: Manages app state and navigation logic.

### 5. Making Changes
- Edit components in `src/components/` to change the UI or add features.
- Update `src/api/musicApi.js` if you need to change how the frontend talks to the backend.
- Use `npm run dev` to see your changes live.

### 6. Troubleshooting
- If you see errors, check the terminal and browser console for details.
- Make sure the backend server is running and accessible at the expected URL.
- If music does not play, ensure your MP3 files are in `public/songs/` and the backend is seeded with matching data.

### 7. Learning Resources
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

This guide is designed to help you get started quickly, even if you are new to web development. For more details, review the rest of this README and explore the codebase.

# iPod Classic Frontend

This frontend is a React application (Vite, Tailwind CSS) that emulates the iPod Classic interface, including music playback and games. It communicates with the backend via RESTful API calls using axios.


## Project Structure

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── public/
│   └── songs/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── api/
    │   └── musicApi.js
    ├── context/
    │   └── IpodContext.jsx
    └── components/
        ├── IpodScreen.jsx
        ├── Screen.jsx
        ├── ClickWheel.jsx
        ├── Menu.jsx
        ├── NowPlaying.jsx
        ├── GamesMenu.jsx
        └── games/
            ├── Memory.jsx
            ├── Snake.jsx
            └── TicTacToe.jsx
```


## Dependencies

See `package.json` for all dependencies. Install with:

```bash
npm install
```


## Prerequisites

- Node.js v16+
- npm (bundled with Node.js)


## Setup

1. Clone the repository and open the frontend folder.
2. Install dependencies:
    ```bash
    npm install
    ```
3. (Optional) Add MP3 files to `public/songs/`.
4. Start the development server:
    ```bash
    npm run dev
    ```
5. Open `http://localhost:5173` in your browser.


## Key Files

- `App.jsx`: Main application logic
- `ClickWheel.jsx`: Click wheel navigation
- `NowPlaying.jsx`: Music playback UI
- `GamesMenu.jsx`: Game selection
- `MusicMenu.jsx`: Music navigation
- `api/musicApi.js`: API calls (axios)
- `context/IpodContext.jsx`: Global state


## API Integration

All API calls use axios. The base URL is set in `src/api/musicApi.js`.

## Features

- iPod Classic UI with click wheel navigation
- Music playback (MP3)
- Album, artist, playlist browsing
- Now Playing screen with cover art
- Built-in games: Snake, Memory, Tic-Tac-Toe
- Settings menu

## Customization

- Add music: Place MP3 files in `public/songs/` and update backend seed data if needed.
- Change theme/colors: Edit `tailwind.config.js`.
- API base URL: Update in `src/api/musicApi.js` if backend is hosted elsewhere.

## Production Build

To build for production:

```bash
npm run build
```

Output is in `dist/`. Deploy with any static site host (Vercel, Netlify, etc.).

## Backend Integration

The frontend uses axios for all API requests. Ensure the backend is running and accessible at the expected base URL (`http://localhost:8000/api/v1`).
