"use client";

import { useEffect, useState } from "react";
import UserProgress from "@/components/UserProgress";
import { getUserProgress } from "@/actions/user";
import { getQuizStats } from "@/actions/quiz";

export default function ProgressPage() {
  const [userProgress, setUserProgress] = useState<any>(null);
  const [quizStats, setQuizStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressResult, statsResult] = await Promise.all([
          getUserProgress(),
          getQuizStats(),
        ]);

        if (progressResult.success) {
          setUserProgress(progressResult.progress);
        }

        if (statsResult.success) {
          setQuizStats(statsResult.stats);
        }

        if (!progressResult.success || !statsResult.success) {
          setError("Failed to load some progress data");
        }
      } catch (err) {
        setError("Error loading progress data");
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

  if (!userProgress || !quizStats) {
    return (
      <div className="text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <UserProgress user={userProgress} quizStats={quizStats} />;
}
