import React from "react";
import { Word } from "../data/mockData";

interface DailyWordProps {
  word: Word;
  onSaveWord: (wordId: string) => void;
}

const DailyWord: React.FC<DailyWordProps> = ({ word, onSaveWord }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-3xl font-bold text-gray-800">{word.word}</h2>
        <button
          onClick={() => onSaveWord(word.id)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
        >
          Save Word
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <span className="text-gray-600 italic">{word.pronunciation}</span>
        <button
          onClick={() => new Audio(word.audioUrl).play()}
          className="text-blue-500 hover:text-blue-600"
        >
          🔊 Listen
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700">Definition</h3>
          <p className="text-gray-600">{word.definition}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Examples</h3>
          <ul className="list-disc list-inside text-gray-600">
            {word.examples.map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700">Synonyms</h3>
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
            <h3 className="font-semibold text-gray-700">Antonyms</h3>
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
          <h3 className="font-semibold text-gray-700">Origin</h3>
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
            {word.difficulty.charAt(0).toUpperCase() + word.difficulty.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DailyWord;
