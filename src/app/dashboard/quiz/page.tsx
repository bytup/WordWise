"use client";

import { useEffect, useState } from "react";
import Quiz from "@/components/Quiz";
import { getRandomQuiz, submitQuizAnswer } from "@/actions/quiz";
import { IQuiz } from "@/types";

export default function QuizPage() {
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const result = await getRandomQuiz();
      if (result.success && result.quiz) {
        setQuiz(result.quiz);
      } else {
        setError(result.error || "Failed to fetch quiz");
      }
    };

    fetchQuiz();
  }, []);

  const handleQuizComplete = async (answer: string) => {
    if (!quiz) return;

    const result = await submitQuizAnswer(quiz._id, answer);
    if (result.success) {
      // Fetch new quiz after completion
      const newQuizResult = await getRandomQuiz();
      if (newQuizResult.success && newQuizResult.quiz) {
        setQuiz(newQuizResult.quiz);
      }
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <Quiz quiz={quiz} onComplete={handleQuizComplete} />;
}
