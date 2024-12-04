import React, { useState } from "react";
import { IQuiz } from "@/types";

interface QuizProps {
  quiz: IQuiz;
  onComplete: (answer: string) => Promise<void>;
}

const Quiz: React.FC<QuizProps> = ({ quiz, onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = async () => {
    const correct =
      selectedAnswer.toLowerCase() === quiz.correctAnswer.toLowerCase();
    setIsCorrect(correct);
    setShowExplanation(true);
    await onComplete(selectedAnswer);
  };

  const renderQuizContent = () => {
    switch (quiz.type) {
      case "multiple-choice":
        return (
          <div className="space-y-3">
            {quiz.options?.map((option, index) => (
              <label
                key={index}
                className={`block p-3 rounded-lg border cursor-pointer transition-colors
                  ${
                    selectedAnswer === option
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        );

      case "fill-blank":
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      case "listening":
        return (
          <div className="space-y-3">
            <button
              onClick={() => new Audio(quiz.audioUrl).play()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              🔊 Play Audio
            </button>
            <input
              type="text"
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              placeholder="Type what you hear..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {quiz.question}
      </h3>

      {renderQuizContent()}

      <div className="mt-6 space-y-4">
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer || showExplanation}
          className={`w-full py-2 px-4 rounded-lg font-medium
            ${
              !selectedAnswer || showExplanation
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
        >
          Submit Answer
        </button>

        {showExplanation && (
          <div
            className={`p-4 rounded-lg ${
              isCorrect
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <p className="font-medium mb-2">
              {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
            </p>
            <p>{quiz.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
