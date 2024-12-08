"use client";

import React from 'react';
import WordFinder from '@/components/WordFinder';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function GamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/"
            className="text-blue-600 hover:text-purple-600 transition-colors"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 mb-8 shadow-lg"
        >
          <WordFinder />
        </motion.div>

        {/* Game Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 text-gray-600 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800">How to Play</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Guess the word in 6 tries</li>
            <li>Each guess must be a valid 5-letter word</li>
            <li>After each guess, the color of the tiles will change to show how close your guess was</li>
            <li>Green means the letter is correct and in the right spot</li>
            <li>Yellow means the letter is in the word but in the wrong spot</li>
            <li>Gray means the letter is not in the word</li>
          </ul>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 text-gray-500 text-sm"
        >
          <p>Built with AI-powered word generation for Indian students</p>
        </motion.div>
      </div>
    </div>
  );
}
