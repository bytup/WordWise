"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import DailyWord from "../../components/DailyWord";
import Quiz from "../../components/Quiz";
import PersonalVocabularyList from "../../components/PersonalVocabularyList";
import UserProgress from "../../components/UserProgress";
import { mockWords, mockUser, mockQuizzes } from "../../data/mockData";

export default function Dashboard() {
  const { data: session } = useSession();
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
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                WordWise
              </Link>
              <span className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                Dashboard
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all">
                Upgrade to WordWise+
              </button>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {session?.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-600">
                    {session?.user?.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "daily", name: "Daily Word", icon: "📚" },
              { id: "quiz", name: "Quiz", icon: "✍️" },
              { id: "vocabulary", name: "My Vocabulary", icon: "📖" },
              { id: "progress", name: "Progress", icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as typeof currentTab)}
                className={`
                  px-4 py-4 text-sm font-medium border-b-2 -mb-px flex items-center gap-2
                  ${
                    currentTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <span>{tab.icon}</span>
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
