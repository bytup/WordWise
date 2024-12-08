'use server'

import { generateGameWord, isValidWord } from '@/lib/openai';
import { revalidatePath } from 'next/cache';
import type { GameWordDetails } from '@/lib/openai';

export type GameWordResponse = {
  word: GameWordDetails;
  error?: string;
};

export async function getGameWord(length: number = 5, usedWords: string[] = []): Promise<GameWordResponse> {
  try {
    const wordDetails = await generateGameWord(length, usedWords);
    
    // Log for development/monitoring (not visible to client)
    console.log('Generated new game word:', wordDetails.word);
    console.log('Total unique words used:', usedWords.length + 1);
    
    // Revalidate the game page
    revalidatePath('/game');
    
    return { word: wordDetails };
  } catch (error) {
    console.error('Error in getGameWord:', error);
    return {
      word: {
        word: 'MINOR',
        meaning: 'Small or lesser in importance',
        example: 'It was a minor problem that was easily fixed.',
        difficulty: 'Easy',
        category: 'Common Words',
      },
      error: 'Failed to generate a unique word. Using fallback word.'
    };
  }
}

export async function validateWord(word: string): Promise<boolean> {
  try {
    return await isValidWord(word);
  } catch (error) {
    console.error('Error validating word:', error);
    return true; // Allow the word if validation fails
  }
}
