"use client";

import { useEffect, useState } from "react";
import DailyWord from "@/components/DailyWord";
import { getDailyWord } from "@/actions/word";
import { saveWord } from "@/actions/user";
import { seedDatabaseAction } from "@/actions/seed";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const [word, setWord] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchWord = async () => {
      const result = await getDailyWord();
      if (result.success) {
        setWord(result.word);
      } else {
        setError(result.error as any);
      }
    };

    fetchWord();
  }, []);

  const handleSaveWord = async (wordId: string) => {
    const result = await saveWord(wordId);
    if (!result.success) {
      // Handle error
      console.error(result.error);
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
  //   const showSeedButton = session?.user?.email?.endsWith("@example.com");
  const showSeedButton = false;

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

      {word && <DailyWord word={word} onSaveWord={handleSaveWord} />}

      {!word && !error && (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}
