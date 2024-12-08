import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGameWord } from '@/actions/game';

const LOCAL_STORAGE_KEY = 'wordwise_played_words';

interface WordFinderProps {
  maxAttempts?: number;
  wordLength?: number;
}

interface CellState {
  letter: string;
  state: 'empty' | 'correct' | 'present' | 'absent';
}

type GameState = {
  board: CellState[][];
  currentRow: number;
  currentCol: number;
  targetWord: string;
  gameStatus: 'playing' | 'won' | 'lost';
  isLoading: boolean;
  keyStates: { [key: string]: 'correct' | 'present' | 'absent' | null };
  error?: string;
  playedWords: string[];
};

export default function WordFinder({ maxAttempts = 6, wordLength = 5 }: WordFinderProps) {
  // Initialize game state
  const [gameState, setGameState] = useState<GameState>(() => {
    // Load played words from localStorage
    const playedWords = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]') 
      : [];

    return {
      board: Array(maxAttempts).fill(null).map(() => 
        Array(wordLength).fill(null).map(() => ({ letter: '', state: 'empty' }))
      ),
      currentRow: 0,
      currentCol: 0,
      targetWord: '',
      gameStatus: 'playing',
      isLoading: false,
      keyStates: {},
      error: undefined,
      playedWords
    };
  });

  // Save played words to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState.playedWords));
    }
  }, [gameState.playedWords]);

  const startNewGame = async () => {
    setGameState(prev => ({ ...prev, isLoading: true, error: undefined }));
    try {
      const { word, error } = await getGameWord(wordLength, gameState.playedWords);
      if (error) {
        setGameState(prev => ({ 
          ...prev, 
          isLoading: false,
          error
        }));
        return;
      }
      
      setGameState(prev => ({
        board: Array(maxAttempts).fill(null).map(() => 
          Array(wordLength).fill(null).map(() => ({ letter: '', state: 'empty' }))
        ),
        currentRow: 0,
        currentCol: 0,
        targetWord: word,
        gameStatus: 'playing',
        isLoading: false,
        keyStates: {},
        error: undefined,
        playedWords: [...prev.playedWords, word]
      }));
    } catch (error) {
      console.error('Error starting new game:', error);
      setGameState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Failed to start new game. Please try again.'
      }));
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
    const newKeyStates = { ...gameState.keyStates };
    
    // Count letters in target word
    for (const letter of gameState.targetWord) {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    // First pass: mark correct letters
    for (let i = 0; i < wordLength; i++) {
      if (currentWord[i] === gameState.targetWord[i]) {
        newBoard[gameState.currentRow][i].state = 'correct';
        letterCount[currentWord[i]]--;
        newKeyStates[currentWord[i]] = 'correct';
      }
    }

    // Second pass: mark present/absent letters
    for (let i = 0; i < wordLength; i++) {
      if (currentWord[i] !== gameState.targetWord[i]) {
        if (letterCount[currentWord[i]] > 0) {
          newBoard[gameState.currentRow][i].state = 'present';
          letterCount[currentWord[i]]--;
          if (newKeyStates[currentWord[i]] !== 'correct') {
            newKeyStates[currentWord[i]] = 'present';
          }
        } else {
          newBoard[gameState.currentRow][i].state = 'absent';
          if (!newKeyStates[currentWord[i]]) {
            newKeyStates[currentWord[i]] = 'absent';
          }
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
      gameStatus: isWon ? 'won' : isLost ? 'lost' : 'playing',
      keyStates: newKeyStates
    }));
  };

  const renderKeyboard = () => {
    const rows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
    ];

    const getKeyColor = (key: string) => {
      const state = gameState.keyStates[key];
      switch (state) {
        case 'correct':
          return 'bg-green-500 text-white border-green-600';
        case 'present':
          return 'bg-yellow-500 text-white border-yellow-600';
        case 'absent':
          return 'bg-gray-400 text-white border-gray-500';
        default:
          return 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400';
      }
    };

    return (
      <div className="mt-8">
        {rows.map((row, i) => (
          <div key={i} className="flex justify-center gap-1 my-1">
            {row.map((key) => (
              <motion.button
                key={key}
                onClick={() => handleKeyPress(key === '⌫' ? 'Backspace' : key)}
                className={`
                  ${key === 'Enter' || key === '⌫' ? 'px-4' : 'px-3'} 
                  py-4 rounded font-bold text-sm
                  ${key.length === 1 ? getKeyColor(key) : 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400'}
                  transition-colors duration-150
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.1 + (row.indexOf(key) * 0.05),
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                {key}
              </motion.button>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Start first game on component mount
  useEffect(() => {
    if (!gameState.targetWord) {
      startNewGame();
    }
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
      {/* Error Message */}
      <AnimatePresence>
        {gameState.error && (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {gameState.error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Board */}
      <div className="grid gap-1">
        {gameState.board.map((row, rowIndex) => (
          <motion.div
            key={rowIndex}
            className="flex gap-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rowIndex * 0.1 }}
          >
            {row.map((cell, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={`w-14 h-14 flex items-center justify-center text-2xl font-bold border-2 
                  ${cell.state === 'correct' ? 'bg-green-500 text-white border-green-600' :
                    cell.state === 'present' ? 'bg-yellow-500 text-white border-yellow-600' :
                    cell.state === 'absent' ? 'bg-gray-400 text-white border-gray-500' :
                    'bg-white border-gray-300'}`}
                initial={cell.letter ? { scale: 0 } : false}
                animate={cell.letter ? { scale: 1 } : false}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {cell.letter}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Game Status and New Game Button */}
      <AnimatePresence>
        {gameState.gameStatus !== 'playing' && (
          <motion.div
            className="mt-4 flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <motion.div
              className="text-xl font-bold"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              {gameState.gameStatus === 'won' ? 
                '🎉 You Won! 🎉' : 
                `Game Over! The word was ${gameState.targetWord}`
              }
            </motion.div>
            <motion.button
              onClick={startNewGame}
              disabled={gameState.isLoading}
              className={`px-6 py-3 rounded-lg font-bold text-white transition-colors
                ${gameState.isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {gameState.isLoading ? 'Loading...' : 'New Game'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Virtual Keyboard */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {renderKeyboard()}
      </motion.div>
    </div>
  );
}
