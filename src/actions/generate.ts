"use server";

import { generateRandomWord as generateWithGemini } from "@/lib/gemini";
import { generateRandomWord as generateWithOpenAI } from "@/lib/openai";
import { WordResponse, IWord } from "@/types";

export async function generateWord(): Promise<WordResponse> {
  try {
    // Try OpenAI first, fall back to Gemini if OpenAI key is not available
    const generator = process.env.OPENAI_API_KEY 
      ? generateWithOpenAI 
      : generateWithGemini;

    const generatedWord = await generator();
    
    // Ensure all required properties are present
    const word: IWord = {
      _id: "generated", // Temporary ID for generated words
      word: generatedWord.word || "",
      definition: generatedWord.definition || "",
      pronunciation: generatedWord.pronunciation || "",
      examples: generatedWord.examples || [],
      origin: generatedWord.origin || "",
      synonyms: generatedWord.synonyms || [],
      antonyms: generatedWord.antonyms || [],
      difficulty: generatedWord.difficulty || "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      success: true,
      word,
    };
  } catch (error) {
    console.error("Error in generateWord:", error);
    return {
      success: false,
      error: "Failed to generate word",
    };
  }
}
