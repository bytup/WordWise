import OpenAI from 'openai';
import { IWord } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
}
For difficulty, choose one of: "easy", "medium", or "hard" based on the word's complexity.`
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
