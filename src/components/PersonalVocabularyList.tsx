import React, { useState } from "react";
import { Word } from "../data/mockData";

interface PersonalVocabularyListProps {
  words: Word[];
  onRemoveWord: (wordId: string) => void;
}

const PersonalVocabularyList: React.FC<PersonalVocabularyListProps> = ({
  words,
  onRemoveWord,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const filteredWords = words.filter((word) => {
    const matchesSearch =
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === "all" || word.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          My Vocabulary List
        </h2>

        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredWords.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No words found matching your criteria.
          </p>
        ) : (
          filteredWords.map((word) => (
            <div
              key={word.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {word.word}
                  </h3>
                  <p className="text-gray-600 mt-1">{word.definition}</p>

                  <div className="flex gap-2 mt-2">
                    <span
                      className={`
                      px-2 py-1 rounded-full text-sm
                      ${
                        word.difficulty === "easy"
                          ? "bg-green-100 text-green-700"
                          : word.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                    >
                      {word.difficulty.charAt(0).toUpperCase() +
                        word.difficulty.slice(1)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveWord(word.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Synonyms: </span>
                  <span className="text-gray-700">
                    {word.synonyms.join(", ")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Antonyms: </span>
                  <span className="text-gray-700">
                    {word.antonyms.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PersonalVocabularyList;
