import React, { lazy, Suspense } from 'react';
import { useIpod } from '../context/IpodContext';

// Lazy load game components for better performance
const Snake = lazy(() => import('./games/Snake'));
const TicTacToe = lazy(() => import('./games/TicTacToe'));
const Memory = lazy(() => import('./games/Memory'));

const GameScreen = () => {
  const { activeSection, data } = useIpod();
  
  // Loading fallback for lazy-loaded games
  const GameLoader = () => (
    <div className="game-screen">
      <div className="menu-header">
        <h2 className="menu-title">{activeSection}</h2>
      </div>
      <div className="game-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎮</div>
          <div>Loading game...</div>
        </div>
      </div>
    </div>
  );
  
  // Render specific game based on activeSection name
  if (activeSection === 'Snake') {
    return (
      <Suspense fallback={<GameLoader />}>
        <Snake isActive={true} />
      </Suspense>
    );
  }
  if (activeSection === 'Tic Tac Toe' || activeSection === 'TicTacToe') {
    return (
      <Suspense fallback={<GameLoader />}>
        <TicTacToe isActive={true} />
      </Suspense>
    );
  }
  if (activeSection === 'Memory Game' || activeSection === 'Memory') {
    return (
      <Suspense fallback={<GameLoader />}>
        <Memory isActive={true} />
      </Suspense>
    );
  }

  // Fallback for generic games fetched from DB but not implemented locally
  const game = data.find(g => g.name === activeSection) || { name: activeSection, description: 'Loading...', status: 'unknown' };

  return (
    <div className="game-screen">
      <div className="menu-header">
        <h2 className="menu-title">{game.name}</h2>
      </div>
      <div className="game-content">
        <div className="game-placeholder">
          <div className="game-icon">🎮</div>
          <p className="game-desc">{game.description}</p>
          <p className="game-status">Status: {game.status}</p>
          <p className="blink">Press MENU to exit</p>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
