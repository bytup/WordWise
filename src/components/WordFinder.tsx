import React, { useState, useEffect } from 'react';
import { getGameWord } from '@/actions/game';

interface WordFinderProps {
  maxAttempts?: number;
  wordLength?: number;
}

type CellState = {
  letter: string;
  state: 'correct' | 'present' | 'absent' | 'empty';
};

type GameState = {
  board: CellState[][];
  currentRow: number;
  currentCol: number;
  targetWord: string;
  gameStatus: 'playing' | 'won' | 'lost';
  isLoading: boolean;
};

export default function WordFinder({ maxAttempts = 6, wordLength = 5 }: WordFinderProps) {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(maxAttempts).fill(null).map(() => 
      Array(wordLength).fill(null).map(() => ({ letter: '', state: 'empty' }))
    ),
    currentRow: 0,
    currentCol: 0,
    targetWord: '',
    gameStatus: 'playing',
    isLoading: false
  });

  const startNewGame = async () => {
    setGameState(prev => ({ ...prev, isLoading: true }));
    try {
      const { word } = await getGameWord(wordLength);
      console.log('New game started with word:', word); // For development
      setGameState({
        board: Array(maxAttempts).fill(null).map(() => 
          Array(wordLength).fill(null).map(() => ({ letter: '', state: 'empty' }))
        ),
        currentRow: 0,
        currentCol: 0,
        targetWord: word,
        gameStatus: 'playing',
        isLoading: false
      });
    } catch (error) {
      console.error('Error starting new game:', error);
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameState.gameStatus !== 'playing') return;

    if (key === 'Enter') {
      handleEnter();
    } else if (key === 'Backspace') {
      handleBackspace();
    } else if (/^[A-Za-z]$/.test(key) && gameState.currentCol < wordLength) {
      handleLetter(key.toUpperCase());
    }
  };

  const handleLetter = (letter: string) => {
    if (gameState.currentCol >= wordLength) return;

    const newBoard = [...gameState.board];
    newBoard[gameState.currentRow][gameState.currentCol] = {
      letter,
      state: 'empty'
    };

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentCol: prev.currentCol + 1
    }));
  };

  const handleBackspace = () => {
    if (gameState.currentCol === 0) return;

    const newBoard = [...gameState.board];
    newBoard[gameState.currentRow][gameState.currentCol - 1] = {
      letter: '',
      state: 'empty'
    };

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentCol: prev.currentCol - 1
    }));
  };

  const handleEnter = () => {
    if (gameState.currentCol !== wordLength) return;

    const currentWord = gameState.board[gameState.currentRow]
      .map(cell => cell.letter)
      .join('');

    const newBoard = [...gameState.board];
    const letterCount: { [key: string]: number } = {};
    
    // Count letters in target word
    for (const letter of gameState.targetWord) {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    // First pass: mark correct letters
    for (let i = 0; i < wordLength; i++) {
      if (currentWord[i] === gameState.targetWord[i]) {
        newBoard[gameState.currentRow][i].state = 'correct';
        letterCount[currentWord[i]]--;
      }
    }

    // Second pass: mark present/absent letters
    for (let i = 0; i < wordLength; i++) {
      if (currentWord[i] !== gameState.targetWord[i]) {
        if (letterCount[currentWord[i]] > 0) {
          newBoard[gameState.currentRow][i].state = 'present';
          letterCount[currentWord[i]]--;
        } else {
          newBoard[gameState.currentRow][i].state = 'absent';
        }
      }
    }

    const isWon = currentWord === gameState.targetWord;
    const isLost = !isWon && gameState.currentRow === maxAttempts - 1;

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentRow: prev.currentRow + 1,
      currentCol: 0,
      gameStatus: isWon ? 'won' : isLost ? 'lost' : 'playing'
    }));
  };

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyPress(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Game Board */}
      <div className="grid gap-1">
        {gameState.board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-14 h-14 flex items-center justify-center text-2xl font-bold border-2 
                  ${cell.state === 'correct' ? 'bg-green-500 text-white border-green-600' :
                    cell.state === 'present' ? 'bg-yellow-500 text-white border-yellow-600' :
                    cell.state === 'absent' ? 'bg-gray-400 text-white border-gray-500' :
                    'bg-white border-gray-300'}`}
              >
                {cell.letter}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Game Status and New Game Button */}
      {gameState.gameStatus !== 'playing' && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="text-xl font-bold">
            {gameState.gameStatus === 'won' ? 
              '🎉 You Won! 🎉' : 
              `Game Over! The word was ${gameState.targetWord}`
            }
          </div>
          <button
            onClick={startNewGame}
            disabled={gameState.isLoading}
            className={`px-6 py-3 rounded-lg font-bold text-white transition-colors
              ${gameState.isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
              }`}
          >
            {gameState.isLoading ? 'Loading...' : 'New Game'}
          </button>
        </div>
      )}
    </div>
  );
}
