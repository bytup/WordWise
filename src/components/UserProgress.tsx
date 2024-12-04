import React from "react";
import { User } from "../data/mockData";

interface UserProgressProps {
  user: User;
}

const UserProgress: React.FC<UserProgressProps> = ({ user }) => {
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
          {user.badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
            >
              <img
                src={badge.imageUrl}
                alt={badge.name}
                className="w-16 h-16 mx-auto mb-3"
              />
              <h4 className="font-medium text-gray-800">{badge.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Milestone */}
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
    </div>
  );
};

export default UserProgress;
