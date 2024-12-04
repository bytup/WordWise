import React from "react";
import { IQuiz } from "@/types";

interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface UserProgressProps {
  user: {
    streak: number;
    points: number;
    savedWords: string[];
    lastLoginDate: Date;
    badges?: Badge[];
  };
  quizStats: Array<{
    id: string;
    question: string;
    type: IQuiz["type"];
    difficulty: IQuiz["difficulty"];
    timesAnswered: number;
    successRate: number;
  }>;
}

// Mock badges data until we implement it in the backend
const mockBadges: Badge[] = [
  {
    id: "1",
    name: "Quick Learner",
    description: "Completed first 10 quizzes",
    imageUrl: "/badges/quick-learner.svg",
  },
  {
    id: "2",
    name: "Vocabulary Builder",
    description: "Saved 20 words",
    imageUrl: "/badges/vocabulary-builder.svg",
  },
  {
    id: "3",
    name: "Streak Master",
    description: "Maintained a 7-day streak",
    imageUrl: "/badges/streak-master.svg",
  },
  {
    id: "4",
    name: "Quiz Champion",
    description: "Achieved 90% success rate in quizzes",
    imageUrl: "/badges/quiz-champion.svg",
  },
];

const UserProgress: React.FC<UserProgressProps> = ({
  user,
  quizStats = [],
}) => {
  // Use mock badges for now
  const badges = user.badges || mockBadges;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak Section */}
        <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">
            Daily Streak
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-orange-600">
              {user.streak}
            </span>
            <span className="text-orange-700">days</span>
          </div>
          <p className="text-sm text-orange-600 mt-2">
            Keep learning daily to maintain your streak!
          </p>
        </div>

        {/* Points Section */}
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Total Points
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-blue-600">
              {user.points}
            </span>
            <span className="text-blue-700">points</span>
          </div>
          <p className="text-sm text-blue-600 mt-2">
            Earn points by completing quizzes and learning new words!
          </p>
        </div>

        {/* Words Learned Section */}
        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Words Learned
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-green-600">
              {user.savedWords.length}
            </span>
            <span className="text-green-700">words</span>
          </div>
          <p className="text-sm text-green-600 mt-2">
            Keep growing your vocabulary!
          </p>
        </div>
      </div>

      {/* Badges Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Earned Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl" role="img" aria-label={badge.name}>
                  {badge.id === "1"
                    ? "🎯"
                    : badge.id === "2"
                    ? "📚"
                    : badge.id === "3"
                    ? "🔥"
                    : "🏆"}
                </span>
              </div>
              <h4 className="font-medium text-gray-800">{badge.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Performance Section */}
      {quizStats.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Quiz Performance
          </h3>
          <div className="space-y-4">
            {quizStats.map((stat) => (
              <div
                key={stat.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {stat.question}
                    </h4>
                    <div className="flex gap-2 mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          stat.difficulty === "easy"
                            ? "bg-green-100 text-green-700"
                            : stat.difficulty === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {stat.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {stat.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Success Rate</div>
                    <div
                      className={`text-lg font-bold ${
                        stat.successRate >= 70
                          ? "text-green-600"
                          : stat.successRate >= 40
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {Math.round(stat.successRate)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {stat.timesAnswered} attempts
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Milestone Section */}
      <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">
          Next Milestone
        </h3>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-purple-800">
                Progress to next level
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-purple-800">
                75%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
            <div
              style={{ width: "75%" }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
            ></div>
          </div>
          <p className="text-sm text-purple-700">
            25 more points until you unlock the "Vocabulary Expert" badge!
          </p>
        </div>
      </div>

      {quizStats.length === 0 && (
        <div className="mt-8 text-center text-gray-500">
          <p>
            No quiz data available yet. Start taking quizzes to see your
            performance!
          </p>
        </div>
      )}
    </div>
  );
};

export default UserProgress;
