import React, { useState, useEffect, useCallback } from 'react';
import { useIpod } from '../../context/IpodContext';

const TicTacToe = ({ isActive = true }) => {
  const { handleCenter } = useIpod();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ player: 0, computer: 0 });
  
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
  };

  const handleClick = (index) => {
      if (board[index] || winner || !isActive) return;

      const newBoard = [...board];
      newBoard[index] = isXNext ? 'X' : 'O';
      setBoard(newBoard);
      
      const gameWinner = calculateWinner(newBoard);
      if (gameWinner) {
          setWinner(gameWinner);
      } else if (!newBoard.includes(null)) {
          setWinner('Draw');
      } else {
          setIsXNext(!isXNext);
      }
  };

  const resetGame = () => {
      setBoard(Array(9).fill(null));
      setIsXNext(true);
      setWinner(null);
  };

  useEffect(() => {
    if (winner) {
      if (winner === 'X') {
        setScores(prev => ({ ...prev, player: prev.player + 1 }));
      } else if (winner === 'O') {
        setScores(prev => ({ ...prev, computer: prev.computer + 1 }));
      }
      
      const timer = setTimeout(() => {
        resetGame();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  // AI Computer Move using Minimax Algorithm with Intermediate Difficulty
  useEffect(() => {
      if (!isXNext && !winner && isActive) {
          // Computer turn
          const timeout = setTimeout(() => {
            const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
            
            // Intermediate Difficulty: 30% chance to make a random mistake
            // 70% chance to play optimally (Minimax)
            const makeRandomMove = Math.random() < 0.3;

            if (makeRandomMove && emptyIndices.length > 0) {
                 const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                 const newBoard = [...board];
                 newBoard[randomIndex] = 'O';
                 setBoard(newBoard);
                 
                 const gameWinner = calculateWinner(newBoard);
                  if (gameWinner) {
                      setWinner(gameWinner);
                  } else if (!newBoard.includes(null)) {
                      setWinner('Draw');
                  } else {
                      setIsXNext(true);
                  }
                 return;
            }

            // Minimax algorithm to find the best move
            const minimax = (squares, depth, isMaximizing) => {
              const gameWinner = calculateWinner(squares);
              if (gameWinner === 'O') return 10 - depth;
              if (gameWinner === 'X') return depth - 10;
              if (!squares.includes(null)) return 0;

              if (isMaximizing) {
                let bestScore = -Infinity;
                for (let i = 0; i < 9; i++) {
                  if (squares[i] === null) {
                    squares[i] = 'O';
                    const score = minimax(squares, depth + 1, false);
                    squares[i] = null;
                    bestScore = Math.max(score, bestScore);
                  }
                }
                return bestScore;
              } else {
                let bestScore = Infinity;
                for (let i = 0; i < 9; i++) {
                  if (squares[i] === null) {
                    squares[i] = 'X';
                    const score = minimax(squares, depth + 1, true);
                    squares[i] = null;
                    bestScore = Math.min(score, bestScore);
                  }
                }
                return bestScore;
              }
            };

            let bestMove;
            let bestScore = -Infinity;

            // Optimization for the first move (center is generally best)
            if (emptyIndices.length === 9) {
                bestMove = 4;
            } else if (emptyIndices.length === 8 && board[4] === null) {
                 bestMove = 4;
            } else {
                for (let i = 0; i < 9; i++) {
                    if (board[i] === null) {
                        const newBoard = [...board];
                        newBoard[i] = 'O';
                        const score = minimax(newBoard, 0, false);
                        if (score > bestScore) {
                            bestScore = score;
                            bestMove = i;
                        }
                    }
                }
            }

            if (bestMove !== undefined) {
                  const newBoard = [...board];
                  newBoard[bestMove] = 'O';
                  setBoard(newBoard);
                  
                  const gameWinner = calculateWinner(newBoard);
                  if (gameWinner) {
                      setWinner(gameWinner);
                  } else if (!newBoard.includes(null)) {
                      setWinner('Draw');
                  } else {
                      setIsXNext(true);
                  }
            }
          }, 500);
          return () => clearTimeout(timeout);
      }
  }, [isXNext, winner, board, isActive]);


  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center bg-white text-black relative overflow-hidden">
       {/* Exit Button */}
       <button 
        className="absolute top-1 right-2 px-2 py-0.5 border border-black text-[9px] font-bold hover:bg-black hover:text-white z-20 uppercase cursor-pointer"
        onClick={handleCenter}
        title="Exit Game"
      >
        Exit
      </button>

      <h2 className="text-lg font-bold mb-1">Tic Tac Toe</h2>
      
      <div className="flex gap-4 text-[10px] font-bold mb-1">
        <div className="flex flex-col items-center">
            <span>Player (X)</span>
            <span>{scores.player}</span>
        </div>
        <div className="flex flex-col items-center">
            <span>Computer (O)</span>
            <span>{scores.computer}</span>
        </div>
      </div>

      <div className="mb-1 text-xs font-semibold">
          {winner ? (
              winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner}`
          ) : (
              `Turn: ${isXNext ? 'Player (X)' : 'Computer (O)'}`
          )}
      </div>

      <div className="grid grid-cols-3 gap-1 bg-black p-1">
          {board.map((cell, index) => (
              <div 
                key={index} 
                className="w-8 h-7 bg-white flex items-center justify-center text-xl font-bold cursor-pointer hover:bg-gray-200"
                onClick={() => isXNext && handleClick(index)}
              >
                  {cell}
              </div>
          ))}
      </div>

      {winner && (
          <button 
            className="mt-2 px-3 py-0.5 border-2 border-black font-bold hover:bg-black hover:text-white uppercase text-[10px]"
            onClick={resetGame}
          >
            Play Again
          </button>
      )}
    </div>
  );
};

export default TicTacToe;
