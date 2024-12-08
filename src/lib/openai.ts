import OpenAI from 'openai';
import { IWord } from "@/types";
import { GoogleGenerativeAI } from '@google/generative-ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// For vocabulary training
export async function generateRandomWord(): Promise<Partial<IWord>> {
  try {
    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a vocabulary API endpoint. Return ONLY a JSON object with a randomly generated challenging English word."
        },
        {
          role: "user",
          content: `Generate a vocabulary word following this exact format:
{
  "word": "challenging English word",
  "definition": "clear and concise definition",
  "pronunciation": "phonetic pronunciation",
  "examples": ["example sentence 1", "example sentence 2"],
  "origin": "brief etymology",
  "synonyms": ["synonym1", "synonym2", "synonym3"],
  "antonyms": ["antonym1", "antonym2"],
  "difficulty": "medium"
}`
        }
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || "";

    const endTime = Date.now();
    console.log(`Generated word in ${endTime - startTime}ms`);
    
    try {
      const parsedResponse = JSON.parse(response);
      // Ensure difficulty is one of the allowed values
      if (!parsedResponse.difficulty || !["easy", "medium", "hard"].includes(parsedResponse.difficulty)) {
        parsedResponse.difficulty = "medium";
      }
      return parsedResponse;
    } catch (parseError) {
      console.error("Parse error:", parseError);
      console.log("Raw response:", response);
      throw new Error("Failed to parse generated word");
    }
  } catch (error) {
    console.error("Error generating word:", error);
    throw new Error("Failed to generate word");
  }
}

// For word finder game
export async function generateGameWord(length: number = 5, usedWords: string[] = []): Promise<string> {
  try {
    const prompt = `Generate a ${length}-letter word for a word-guessing game.

Requirements:
- Word must be exactly ${length} letters long
- Must be a common English word that children would know
- Must be a single word (no spaces or hyphens)
- Must be appropriate for children
- Must NOT be any of these previously used words: ${usedWords.join(', ')}

Return ONLY the word in uppercase letters, nothing else.`;

    // Try OpenAI first
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a word game assistant that generates appropriate words for children's vocabulary learning."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 10,
      });

      const word = completion.choices[0]?.message?.content?.trim().toUpperCase() || '';
      if (word.length === length && !usedWords.includes(word)) {
        return word;
      }
    } catch (error) {
      console.error('OpenAI error:', error);
    }

    // Fallback to Gemini if OpenAI fails or returns invalid word
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text().trim().toUpperCase();
      
      if (text.length === length && !usedWords.includes(text)) {
        return text;
      }
    } catch (error) {
      console.error('Gemini error:', error);
    }

    // If both APIs fail, throw error
    throw new Error('Failed to generate valid word from both APIs');
  } catch (error) {
    console.error('Error generating word:', error);
    throw error;
  }
}

// For validating game words
export async function isValidWord(word: string): Promise<boolean> {
  try {
    const prompt = `Is "${word}" a valid English word? Respond with only "YES" or "NO".`;

    // Try OpenAI first
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a word validation assistant that checks if words are valid English words."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "gpt-3.5-turbo",
        temperature: 0,
        max_tokens: 10,
      });

      const response = completion.choices[0]?.message?.content?.trim().toUpperCase();
      if (response === 'YES' || response === 'NO') {
        return response === 'YES';
      }
    } catch (error) {
      console.error('OpenAI validation error:', error);
    }

    // Fallback to Gemini
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text().trim().toUpperCase();
      
      if (text === 'YES' || text === 'NO') {
        return text === 'YES';
      }
    } catch (error) {
      console.error('Gemini validation error:', error);
    }

    // If both APIs fail, assume word is valid to not block gameplay
    return true;
  } catch (error) {
    console.error('Error validating word:', error);
    return true;
  }
}
