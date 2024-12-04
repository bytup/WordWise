import React from "react";
import { IWord } from "@/types";

interface PersonalVocabularyListProps {
  words: IWord[];
  onRemoveWord: (wordId: string) => void;
}

const PersonalVocabularyList: React.FC<PersonalVocabularyListProps> = ({
  words,
  onRemoveWord,
}) => {
  if (words.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>No saved words yet. Start saving words to build your vocabulary!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {words.map((word) => (
        <div
          key={word._id}
          className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-[1.02]"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{word.word}</h3>
              <p className="text-gray-600 italic">{word.pronunciation}</p>
            </div>
            <button
              onClick={() => onRemoveWord(word._id)}
              className="text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700">Definition</h4>
              <p className="text-gray-600">{word.definition}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700">Examples</h4>
              <ul className="list-disc list-inside text-gray-600">
                {word.examples.map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700">Synonyms</h4>
                <div className="flex flex-wrap gap-2">
                  {word.synonyms.map((synonym, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                    >
                      {synonym}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700">Antonyms</h4>
                <div className="flex flex-wrap gap-2">
                  {word.antonyms.map((antonym, index) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm"
                    >
                      {antonym}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700">Origin</h4>
              <p className="text-gray-600">{word.origin}</p>
            </div>

            <div className="mt-4">
              <span
                className={`
                px-3 py-1 rounded-full text-sm
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
        </div>
      ))}
    </div>
  );
};

export default PersonalVocabularyList;
