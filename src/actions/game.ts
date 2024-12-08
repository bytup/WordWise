'use server'

import { generateGameWord, isValidWord } from '@/lib/openai';
import { revalidatePath } from 'next/cache';

export type GameWordResponse = {
  word: string;
  error?: string;
};

export async function getGameWord(length: number = 5, usedWords: string[] = []): Promise<GameWordResponse> {
  try {
    const word = await generateGameWord(length, usedWords);
    
    // Log for development/monitoring (not visible to client)
    console.log('Generated new game word:', word);
    console.log('Total unique words used:', usedWords.length + 1);
    
    // Revalidate the game page
    revalidatePath('/game');
    
    return { word };
  } catch (error) {
    console.error('Error in getGameWord:', error);
    return {
      word: 'MINOR', // Fallback word
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
