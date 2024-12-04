"use client";

import { useEffect, useState } from "react";
import Quiz from "@/components/Quiz";
import { getRandomQuiz, submitQuizAnswer } from "@/actions/quiz";

export default function QuizPage() {
  const [quiz, setQuiz] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const result = await getRandomQuiz();
      if (result.success) {
        setQuiz(result.quiz);
      } else {
        setError(result.error);
      }
    };

    fetchQuiz();
  }, []);

  const handleQuizComplete = async (answer: string) => {
    if (!quiz) return;

    const result = await submitQuizAnswer(quiz.id, answer);
    if (result.success) {
      // Fetch new quiz after completion
      const newQuizResult = await getRandomQuiz();
      if (newQuizResult.success) {
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
