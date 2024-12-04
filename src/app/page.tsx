"use client";

import React, { useState } from "react";
import DailyWord from "../components/DailyWord";
import Quiz from "../components/Quiz";
import PersonalVocabularyList from "../components/PersonalVocabularyList";
import UserProgress from "../components/UserProgress";
import { mockWords, mockUser, mockQuizzes } from "../data/mockData";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<
    "daily" | "quiz" | "vocabulary" | "progress"
  >("daily");
  const [user, setUser] = useState(mockUser);
  const [savedWords, setSavedWords] = useState(
    mockWords.filter((word) => user.savedWords.includes(word.id))
  );

  const handleSaveWord = (wordId: string) => {
    if (!user.savedWords.includes(wordId)) {
      const updatedUser = {
        ...user,
        savedWords: [...user.savedWords, wordId],
        points: user.points + 10,
      };
      setUser(updatedUser);
      setSavedWords([...savedWords, mockWords.find((w) => w.id === wordId)!]);
    }
  };

  const handleRemoveWord = (wordId: string) => {
    const updatedUser = {
      ...user,
      savedWords: user.savedWords.filter((id) => id !== wordId),
    };
    setUser(updatedUser);
    setSavedWords(savedWords.filter((word) => word.id !== wordId));
  };

  const handleQuizComplete = (correct: boolean) => {
    if (correct) {
      setUser({
        ...user,
        points: user.points + 20,
      });
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case "daily":
        return <DailyWord word={mockWords[0]} onSaveWord={handleSaveWord} />;
      case "quiz":
        return <Quiz quiz={mockQuizzes[0]} onComplete={handleQuizComplete} />;
      case "vocabulary":
        return (
          <PersonalVocabularyList
            words={savedWords}
            onRemoveWord={handleRemoveWord}
          />
        );
      case "progress":
        return <UserProgress user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">WordWise</h1>
            <div className="flex items-center gap-4">
              <button className="text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all">
                Upgrade to WordWise+
              </button>
              <span className="text-sm text-gray-600">
                Welcome, {user.username}!
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "daily", name: "Daily Word" },
              { id: "quiz", name: "Quiz" },
              { id: "vocabulary", name: "My Vocabulary" },
              { id: "progress", name: "Progress" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as typeof currentTab)}
                className={`
                  px-3 py-4 text-sm font-medium border-b-2 -mb-px
                  ${
                    currentTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-gray-500 text-sm">
              © 2024 WordWise. All rights reserved.
            </p>
            <p className="text-xs text-gray-400">
              Unlock advanced features with{" "}
              <span className="text-indigo-600 font-semibold">WordWise+</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
