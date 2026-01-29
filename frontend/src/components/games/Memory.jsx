import React, { useState, useEffect } from 'react';
import { useIpod } from '../../context/IpodContext';

const INITIAL_EMOJIS = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍓', '🍍', '🥝'];

const Memory = ({ isActive = true }) => {
  const { handleCenter } = useIpod();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  // Initialize Game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledCards = [...INITIAL_EMOJIS, ...INITIAL_EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setSparkles([]);
    setMoves(0);
    setIsWon(false);
    setIsProcessing(false);
  };

  const handleCardClick = (index) => {
    // Prevent clicking if not active, processing, already flipped, or already matched
    if (!isActive || isProcessing || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    // Flip the clicked card
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    // If 2 cards are flipped, check for match
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      setIsProcessing(true);
      checkForMatch(newFlippedCards, newCards);
    }
  };

  const checkForMatch = (currentFlipped, currentCards) => {
    const [firstIndex, secondIndex] = currentFlipped;
    const firstCard = currentCards[firstIndex];
    const secondCard = currentCards[secondIndex];

    if (firstCard.emoji === secondCard.emoji) {
      // Match found
      const newCards = [...currentCards];
      newCards[firstIndex].isMatched = true;
      newCards[secondIndex].isMatched = true;
      setCards(newCards);
      setFlippedCards([]);
      setMatchedPairs(prev => prev + 1);
      
      // Trigger sparkle effect before removing
      setSparkles([firstIndex, secondIndex]);
      setTimeout(() => {
          setSparkles([]);
          setIsProcessing(false);
      }, 800);

    } else {
      // No match
      setTimeout(() => {
        const newCards = [...currentCards];
        newCards[firstIndex].isFlipped = false;
        newCards[secondIndex].isFlipped = false;
        setCards(newCards);
        setFlippedCards([]);
        setIsProcessing(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (matchedPairs === INITIAL_EMOJIS.length && matchedPairs > 0) {
      setIsWon(true);
    }
  }, [matchedPairs]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-black relative">
       {/* Exit Button - using handleCenter to go back */}
       <button 
        className="absolute top-2 right-2 px-2 py-0.5 border border-black text-[10px] font-bold hover:bg-black hover:text-white z-20 uppercase cursor-pointer bg-white"
        onClick={handleCenter}
        title="Exit Game"
      >
        Exit
      </button>

      <div className="flex justify-between w-full px-4 mb-2">
           <h2 className="text-sm font-bold">Memory</h2>
           <span className="text-xs font-semibold">Moves: {moves}</span>
      </div>

      {isWon ? (
          <div className="flex flex-col items-center animate-bounce">
              <h3 className="text-xl font-bold text-green-600 mb-2">You Won!</h3>
              <p className="text-xs mb-4">Total Moves: {moves}</p>
              <button 
                className="px-4 py-1 border-2 border-green-600 rounded bg-white font-bold hover:bg-green-600 hover:text-white text-xs"
                onClick={initializeGame}
              >
                Play Again
              </button>
          </div>
      ) : (
          <div className="grid grid-cols-4 gap-1 p-2 bg-gray-300 rounded">
            {cards.map((card, index) => {
              const isSparkling = sparkles.includes(index);
              
              // If fully matched and sparkle effect is done, hide the card (block removed)
              if (card.isMatched && !isSparkling) {
                  return <div key={card.id} className="w-8 h-8 opacity-0"></div>;
              }

              return (
                <div 
                  key={card.id} 
                  className={`w-8 h-8 flex items-center justify-center text-lg cursor-pointer rounded transition-all duration-300 transform 
                    ${isSparkling ? 'bg-yellow-100 scale-110 shadow-[0_0_15px_rgba(255,255,0,0.8)] border-2 border-yellow-400 z-10' : ''}
                    ${!isSparkling && (card.isFlipped || card.isMatched) ? 'bg-white rotate-y-180' : ''}
                    ${!isSparkling && !card.isFlipped && !card.isMatched ? 'bg-blue-500 hover:bg-blue-600' : ''}
                  `}
                  onClick={() => handleCardClick(index)}
                >
                    {isSparkling ? '✨' : (card.isFlipped || card.isMatched ? card.emoji : '')}
                </div>
              );
            })}
          </div>
      )}
      
      {!isWon && (
          <button 
             className="absolute bottom-2 text-[10px] text-gray-500 underline"
             onClick={initializeGame}
          >
              Reset
          </button>
      )}
    </div>
  );
};

export default Memory;
