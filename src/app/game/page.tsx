"use client";

import React, { useState, useEffect } from 'react';
import WordFinder from '@/components/WordFinder';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Define interface for game settings
interface GameSettings {
  wordLength: number;
  maxAttempts: number;
}

const DEFAULT_SETTINGS: GameSettings = {
  wordLength: 5,
  maxAttempts: 6,
};

export default function GamePage() {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [isNewGame, setIsNewGame] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('wordwise_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage whenever they change
  const updateSettings = (newSettings: Partial<GameSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('wordwise_settings', JSON.stringify(updatedSettings));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Home
            </motion.div>
          </Link>
          <h1 className="text-xl lg:text-3xl font-bold text-center text-gray-800">
            WordWise
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              {" "}Game
            </span>
          </h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Game Component */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-6 mb-8 shadow-lg"
          >
            <motion.button
              className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-full hover:bg-gray-200 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSettings(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </motion.button>
            {/* Pass isNewGame to trigger reset when settings change */}
            <WordFinder 
              key={isNewGame ? 'new' : 'current'} 
              wordLength={settings.wordLength} 
              maxAttempts={settings.maxAttempts} 
            />
          </motion.div>
        </div>

        {/* Game Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 text-gray-600 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800">How to Play</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Try to guess the word in {settings.maxAttempts} attempts or less</li>
            <li>Each guess must be a valid {settings.wordLength}-letter word</li>
            <li>After each guess, the color of the tiles will change to show how close your guess was</li>
          </ul>
        </motion.div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Game Settings</h2>
                
                {/* Word Length Setting */}
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Word Length
                  </label>
                  <div className="flex gap-2">
                    {[4, 5, 6, 7, 8].map((length) => (
                      <button
                        key={length}
                        onClick={() => updateSettings({ wordLength: length })}
                        className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                          settings.wordLength === length
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {length}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Attempts Setting */}
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Maximum Attempts
                  </label>
                  <div className="flex gap-2">
                    {[4, 5, 6, 7, 8].map((attempts) => (
                      <button
                        key={attempts}
                        onClick={() => updateSettings({ maxAttempts: attempts })}
                        className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                          settings.maxAttempts === attempts
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {attempts}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowSettings(false);
                      setIsNewGame(prev => !prev); // Toggle to force component reset
                    }}
                    className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
                  >
                    Apply & Restart
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          Made with ❤️ by WordWise Team
        </motion.div>
      </div>
    </div>
  );
}
