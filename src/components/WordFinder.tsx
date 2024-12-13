import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGameWord } from '@/actions/game';
import type { GameWordDetails } from '@/lib/openai';
import { soundManager } from '@/lib/sounds';

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
  currentWordDetails?: GameWordDetails;
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
      playedWords,
      currentWordDetails: undefined
    };
  });

  // Save played words to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState.playedWords));
    }
  }, [gameState.playedWords]);

  const [showWordModal, setShowWordModal] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [isSoundMuted, setIsSoundMuted] = useState(() => 
    typeof window !== 'undefined' ? soundManager.isMuted() : false
  );

  const startNewGame = async () => {
    setGameState(prev => ({ ...prev, isLoading: true, error: undefined }));
    try {
      const response = await getGameWord(wordLength, gameState.playedWords);
      if (response.error) {
        setGameState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: response.error
        }));
        return;
      }
      
      setGameState(prev => ({
        board: Array(maxAttempts).fill(null).map(() => 
          Array(wordLength).fill(null).map(() => ({ letter: '', state: 'empty' }))
        ),
        currentRow: 0,
        currentCol: 0,
        targetWord: response.word.word,
        currentWordDetails: response.word,
        gameStatus: 'playing',
        isLoading: false,
        keyStates: {},
        error: undefined,
        playedWords: [...prev.playedWords, response.word.word]
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

  const clearPlayedWords = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setGameState(prev => ({
        ...prev,
        playedWords: [],
        error: undefined
      }));
      startNewGame();
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameState.gameStatus !== 'playing') return;

    if (key === 'Backspace') {
      if (gameState.currentCol > 0) {
        soundManager.play('keyPress');
        setGameState(prev => {
          const newBoard = [...prev.board];
          newBoard[prev.currentRow][prev.currentCol - 1] = { letter: '', state: 'empty' };
          return {
            ...prev,
            board: newBoard,
            currentCol: prev.currentCol - 1
          };
        });
      }
      return;
    }

    if (key === 'Enter') {
      if (gameState.currentCol === wordLength) {
        checkWord();
      }
      return;
    }

    if (key.length === 1 && /^[A-Z]$/i.test(key)) {
      if (gameState.currentCol < wordLength) {
        soundManager.play('keyPress');
        setGameState(prev => {
          const newBoard = [...prev.board];
          newBoard[prev.currentRow][prev.currentCol] = { letter: key.toUpperCase(), state: 'empty' };
          return {
            ...prev,
            board: newBoard,
            currentCol: prev.currentCol + 1
          };
        });
      }
    }
  };

  const checkWord = () => {
    const currentWord = gameState.board[gameState.currentRow]
      .map(cell => cell.letter)
      .join('');
    
    const newBoard = [...gameState.board];
    const newKeyStates = { ...gameState.keyStates };
    let allCorrect = true;

    // First pass: mark correct letters
    for (let i = 0; i < wordLength; i++) {
      if (currentWord[i] === gameState.targetWord[i]) {
        newBoard[gameState.currentRow][i].state = 'correct';
        newKeyStates[currentWord[i]] = 'correct';
      } else {
        allCorrect = false;
      }
    }

    // Second pass: mark present letters
    for (let i = 0; i < wordLength; i++) {
      if (currentWord[i] !== gameState.targetWord[i]) {
        if (gameState.targetWord.includes(currentWord[i])) {
          newBoard[gameState.currentRow][i].state = 'present';
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

    if (allCorrect) {
      setTimeout(() => soundManager.play('win'), 500);
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        keyStates: newKeyStates,
        gameStatus: 'won'
      }));
    } else if (gameState.currentRow === maxAttempts - 1) {
      setTimeout(() => soundManager.play('lose'), 500);
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        keyStates: newKeyStates,
        gameStatus: 'lost'
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        keyStates: newKeyStates,
        currentRow: prev.currentRow + 1,
        currentCol: 0
      }));
    }
  };

  const renderKeyboard = () => {
    const keyboardLayout = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
    ];

    return (
      <div className="w-full max-w-3xl mx-auto">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 mb-1">
            {row.map((key) => {
              const isSpecialKey = key === 'Enter' || key === 'Backspace';
              const keyState = gameState.keyStates[key] || 'unused';
              
              return (
                <motion.button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`
                    ${isSpecialKey ? 'px-3 sm:px-4' : 'px-2 sm:px-3'} 
                    py-3 sm:py-4 
                    rounded 
                    font-semibold 
                    text-sm sm:text-base
                    transition-colors
                    ${keyState === 'correct' ? 'bg-green-500 text-white' :
                      keyState === 'present' ? 'bg-yellow-500 text-white' :
                      keyState === 'absent' ? 'bg-gray-400 text-white' :
                      'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                    ${isSpecialKey ? 'flex-grow-0 flex-shrink-0' : ''}
                    touch-manipulation
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {key === 'Backspace' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.707 4.879A3 3 0 018.828 4H15a3 3 0 013 3v6a3 3 0 01-3 3H8.828a3 3 0 01-2.12-.879l-4.415-4.414a1 1 0 010-1.414l4.414-4.414zm4.586 6.414a1 1 0 00-1.414 0L8.586 12.586a1 1 0 001.414 1.414L11.293 13l1.293 1.293a1 1 0 001.414-1.414L12.707 13l1.293-1.293a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : key}
                </motion.button>
              );
            })}
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
      {/* Game Controls */}
      <div className="flex gap-4 mb-4 items-center">
        <motion.button
          onClick={clearPlayedWords}
          className="px-4 py-2 bg-blue-500 text-sm text-white rounded-lg font-semibold hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={gameState.isLoading}
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh Words
          </div>
        </motion.button>
        
        {/* Sound Toggle */}
        <motion.button
          onClick={() => {
            const newMuted = soundManager.toggleMute();
            setIsSoundMuted(newMuted);
          }}
          className="p-2 rounded-full hover:bg-gray-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isSoundMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          )}
        </motion.button>
        
        <motion.div 
          className="text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {gameState.playedWords.length} words played
        </motion.div>
      </div>

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
      <div className="grid gap-1 mb-4">
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
                className={`relative w-14 h-14 flex items-center justify-center text-2xl font-bold border-2 
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
                {/* Info Icon only when word is guessed correctly */}
                {gameState.gameStatus === 'won' && 
                 rowIndex === gameState.currentRow - 1 && // Only on the winning row
                 cell.state === 'correct' && 
                 colIndex === wordLength - 1 && // Only on the last letter
                 gameState.currentWordDetails && (
                  <motion.button
                    className="absolute -right-3 -top-3 bg-blue-500 rounded-full p-1 text-white shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowWordModal(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                )}
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Virtual Keyboard */}
      <motion.div
        className="w-full mt-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {renderKeyboard()}
      </motion.div>

      {/* Word Details Modal */}
      <AnimatePresence>
        {showWordModal && gameState.currentWordDetails && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWordModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full space-y-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {gameState.currentWordDetails.word}
                </h2>
                <span className={`px-2 py-1 rounded text-sm font-semibold
                  ${gameState.currentWordDetails.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    gameState.currentWordDetails.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}
                >
                  {gameState.currentWordDetails.difficulty}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-700">Meaning</h3>
                  <p className="text-gray-600">{gameState.currentWordDetails.meaning}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">Example</h3>
                  <p className="text-gray-600 italic">"{gameState.currentWordDetails.example}"</p>
                </div>
                
                {gameState.currentWordDetails.funFact && (
                  <div>
                    <h3 className="font-semibold text-gray-700">Fun Fact</h3>
                    <p className="text-gray-600">{gameState.currentWordDetails.funFact}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold text-gray-700">Category</h3>
                  <p className="text-gray-600">{gameState.currentWordDetails.category}</p>
                </div>
              </div>

              <motion.button
                className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowWordModal(false)}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  );
}
