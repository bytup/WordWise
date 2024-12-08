"use client";

import { useEffect, useState } from "react";
import DailyWord from "@/components/DailyWord";
import { getDailyWord } from "@/actions/word";
import { saveWord, getUserProgress } from "@/actions/user";
import { seedDatabaseAction } from "@/actions/seed";
import { generateWord } from "@/actions/generate";
import { useSession } from "next-auth/react";
import { IWord } from "@/types";

export default function DashboardPage() {
  const [word, setWord] = useState<IWord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedWords, setSavedWords] = useState<string[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user progress to get saved words
        const progressResult = await getUserProgress();
        if (progressResult.success && progressResult.progress) {
          setSavedWords(progressResult.progress.savedWords);
        }

        // Fetch daily word
        const wordResult = await getDailyWord();
        if (wordResult.success && wordResult.word) {
          setWord(wordResult.word);
        } else {
          setError(wordResult.error || "Failed to fetch word");
        }
      } catch (error) {
        setError("An error occurred while fetching data");
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSaveWord = async (wordId: string) => {
    try {
      const result = await saveWord(wordId);
      if (result.success && result.savedWords) {
        setSavedWords(result.savedWords);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error saving word:", error);
    }
  };

  const handleSeedDatabase = async () => {
    try {
      setIsSeeding(true);
      const result = await seedDatabaseAction();
      if (result.success) {
        alert("Database seeded successfully!");
        window.location.reload(); // Refresh to show new data
      } else {
        alert(result.error || "Failed to seed database");
      }
    } catch (error) {
      alert("Error seeding database");
      console.error(error);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleGenerateWord = async () => {
    try {
      setIsGenerating(true);
      const result = await generateWord();
      console.log('Generated word:', result);
      if (result.success && result.word) {
        setWord(result.word);
      } else {
        setError(result.error || "Failed to generate word");
      }
    } catch (error) {
      setError("An error occurred while generating word");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Only show seed button for test users
  const showSeedButton = session?.user?.email?.endsWith("@example.com");

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4 gap-4">
        <button
          onClick={handleGenerateWord}
          disabled={isGenerating}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
            isGenerating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          {isGenerating ? "Generating..." : "Random Word"}
        </button>
        {showSeedButton && (
          <div className="mb-8 text-center">
            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className={`px-4 py-2 rounded-lg text-white ${
                isSeeding
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isSeeding ? "Seeding..." : "Seed Database"}
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Warning: This will clear all existing data
            </p>
          </div>
        )}
      </div>
      {word && (
        <DailyWord
          word={word}
          onSaveWord={handleSaveWord}
          isSaved={savedWords.includes(word._id)}
        />
      )}

      {!word && !error && (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}
