"use client";

import { useEffect, useState } from "react";
import PersonalVocabularyList from "@/components/PersonalVocabularyList";
import { getSavedWords } from "@/actions/word";
import { removeWord } from "@/actions/user";

export default function VocabularyPage() {
  const [words, setWords] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      const result = await getSavedWords();
      if (result.success) {
        setWords(result.words);
      } else {
        setError(result.error);
      }
    };

    fetchWords();
  }, []);

  const handleRemoveWord = async (wordId: string) => {
    const result = await removeWord(wordId);
    if (result.success) {
      setWords(words.filter((word) => word.id !== wordId));
    } else {
      // Handle error
      console.error(result.error);
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <PersonalVocabularyList words={words} onRemoveWord={handleRemoveWord} />
  );
}
