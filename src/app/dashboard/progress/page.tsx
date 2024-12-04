"use client";

import { useEffect, useState } from "react";
import UserProgress from "@/components/UserProgress";
import { getUserProgress } from "@/actions/user";
import { getQuizStats } from "@/actions/quiz";

interface UserProgressData {
  streak: number;
  points: number;
  savedWords: string[];
  lastLoginDate: Date;
}

interface QuizStat {
  id: string;
  question: string;
  type: "multiple-choice" | "fill-blank" | "listening";
  difficulty: "easy" | "medium" | "hard";
  timesAnswered: number;
  successRate: number;
}

export default function ProgressPage() {
  const [userProgress, setUserProgress] = useState<UserProgressData | null>(
    null
  );
  const [quizStats, setQuizStats] = useState<QuizStat[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressResult, statsResult] = await Promise.all([
          getUserProgress(),
          getQuizStats(),
        ]);

        if (progressResult.success && progressResult.progress) {
          setUserProgress(progressResult.progress);
        }

        if (statsResult.success && statsResult.stats) {
          setQuizStats(statsResult.stats);
        }

        if (!progressResult.success || !statsResult.success) {
          setError(
            progressResult.error ||
              statsResult.error ||
              "Failed to load some progress data"
          );
        }
      } catch (err) {
        setError("Error loading progress data");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!userProgress) {
    return (
      <div className="text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <UserProgress user={userProgress} quizStats={quizStats} />;
}
