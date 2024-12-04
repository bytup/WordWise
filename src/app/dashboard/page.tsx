"use client";

import { useEffect, useState } from "react";
import DailyWord from "@/components/DailyWord";
import { getDailyWord } from "@/actions/word";
import { saveWord, getUserProgress } from "@/actions/user";
import { seedDatabaseAction } from "@/actions/seed";
import { useSession } from "next-auth/react";
import { IWord } from "@/types";

export default function DashboardPage() {
  const [word, setWord] = useState<IWord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
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
