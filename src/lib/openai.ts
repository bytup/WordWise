import OpenAI from 'openai';
import { IWord } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
export async function generateGameWord(length: number = 5): Promise<string> {
  try {
    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a word game API. Return only a single word in uppercase, no explanation or additional text."
        },
        {
          role: "user",
          content: `Generate a random ${length}-letter English word suitable for a word-finding game.
Requirements:
- Exactly ${length} letters long
- Common enough to be guessable
- Single word (no spaces/hyphens)
- Only letters (A-Z)
- Must be a real English word
Return ONLY the word in uppercase.`
        }
      ],
      max_tokens: 10,
      temperature: 0.7,
    });

    const word = completion.choices[0]?.message?.content?.trim().toUpperCase() || 'MINOR';
    
    const endTime = Date.now();
    console.log(`Generated game word in ${endTime - startTime}ms:`, word);

    // Validate the word
    if (word.length !== length || !/^[A-Z]+$/.test(word)) {
      console.log('Invalid word generated, using fallback');
      return 'MINOR'; // fallback word
    }

    return word;
  } catch (error) {
    console.error('Error generating game word:', error);
    return 'MINOR'; // fallback word
  }
}

// For validating game words
export async function isValidWord(word: string): Promise<boolean> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a word validation API. Respond with only 'true' or 'false'."
        },
        {
          role: "user",
          content: `Is "${word}" a valid English word? Respond with only 'true' or 'false'.`
        }
      ],
      max_tokens: 10,
      temperature: 0,
    });

    const response = completion.choices[0]?.message?.content?.trim().toLowerCase();
    return response === 'true';
  } catch (error) {
    console.error('Error validating word:', error);
    return true; // Allow the word if validation fails
  }
}
