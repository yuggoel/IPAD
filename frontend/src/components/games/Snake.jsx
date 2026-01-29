import React, { useState, useEffect, useRef } from 'react';
import { useIpod } from '../../context/IpodContext';

const Snake = ({ isActive = true }) => {
  const { handleCenter } = useIpod();
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([[10, 10]]);
  const [foods, setFoods] = useState([
    [15, 15], [5, 5], [20, 10], [10, 18], [25, 5] // 5 Initial foods
  ]);
  const [dir, setDir] = useState([0, -1]); // Start moving up
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('snakeHighScore') || '0'));

  const GRID_SIZE = 20;
  const CELL_SIZE = 10; // Size of each square
  const CANVAS_WIDTH = 300;
  const CANVAS_HEIGHT = 200;

  // Handle Input (Keyboard for now, could be mapped to Wheel)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isActive) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (dir[1] !== 1) setDir([0, -1]);
          break;
        case 'ArrowDown':
          if (dir[1] !== -1) setDir([0, 1]);
          break;
        case 'ArrowLeft':
          if (dir[0] !== 1) setDir([-1, 0]);
          break;
        case 'ArrowRight':
          if (dir[0] !== -1) setDir([1, 0]);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir, isActive]);

  // Update high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  // Game Loop
  useEffect(() => {
    if (gameOver || !isActive) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        let nextX = prevSnake[0][0] + dir[0];
        let nextY = prevSnake[0][1] + dir[1];

        const gridW = CANVAS_WIDTH / CELL_SIZE;
        const gridH = CANVAS_HEIGHT / CELL_SIZE;

        // Wrap around walls (Left <-> Right, Top <-> Bottom)
        // Using modulo arithmetic for seamless wrapping
        // Adding grid dimension ensures result is positive before modulo
        nextX = (nextX + gridW) % gridW;
        nextY = (nextY + gridH) % gridH;

        const newHead = [nextX, nextY];

        // Check collision only with self
        if (prevSnake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision (any of the foods)
        const eatenFoodIndex = foods.findIndex(f => f[0] === newHead[0] && f[1] === newHead[1]);
        
        if (eatenFoodIndex !== -1) {
          setScore(s => s + 1);
          // Remove eaten food and add a new one in a random spot
          const newFoods = [...foods];
          newFoods[eatenFoodIndex] = [
            Math.floor(Math.random() * (CANVAS_WIDTH / CELL_SIZE)),
            Math.floor(Math.random() * (CANVAS_HEIGHT / CELL_SIZE))
          ];
          setFoods(newFoods);
          // Don't pop, so snake grows
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, 200);
    return () => clearInterval(gameInterval);
  }, [dir, foods, gameOver, isActive]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Clear
    ctx.fillStyle = '#99b19c'; // Classic LCD background color
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Snake
    ctx.fillStyle = '#000000';
    snake.forEach(([x, y]) => {
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
    });

    // Draw Foods
    ctx.fillStyle = '#000000';
    foods.forEach(([fx, fy]) => {
        ctx.fillRect(fx * CELL_SIZE, fy * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
    });

  }, [snake, foods]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#99b19c] text-black relative">
      {/* Exit Button */}
      <button 
        className="absolute top-2 right-4 px-2 py-1 border border-black text-[10px] font-bold hover:bg-black hover:text-[#99b19c] z-20 uppercase cursor-pointer"
        onClick={handleCenter}
        title="Exit Game"
      >
        Exit
      </button>

      <div className="flex w-[300px] justify-between mb-1 font-bold text-xs uppercase">
          <span>Score: {score}</span>
          <span>High: {highScore}</span>
      </div>
      
      {gameOver ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#99b19c]/90 z-10">
          <h2 className="text-2xl font-bold mb-4">Game Over</h2>
          <div className="mb-4 text-sm">Score: {score}</div>
          <button 
            className="px-6 py-2 border-2 border-black font-bold hover:bg-black hover:text-[#99b19c] uppercase text-sm cursor-pointer"
            onClick={() => {
              setSnake([[10, 10]]);
              setFoods([[15, 15], [5, 5], [20, 10], [10, 18], [25, 5]]);
              setDir([0, -1]);
              setScore(0);
              setGameOver(false);
            }}
          >
            Play Again
          </button>
        </div>
      ) : null}
      
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT} 
        className="border-2 border-black"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="mt-1 text-[10px] text-center opacity-70">
        Use Arrow Keys to Move
      </div>
    </div>
  );
};

export default Snake;
