'use client';

import WordFinder from '@/components/WordFinder';

export default function GamePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">WordWise Game</h1>
        <WordFinder />
      </div>
    </div>
  );
}
