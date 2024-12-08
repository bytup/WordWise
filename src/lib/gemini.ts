import { GoogleGenerativeAI } from "@google/generative-ai";
import { IWord } from "@/types";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export async function generateRandomWord(): Promise<Partial<IWord>> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `You are a vocabulary API endpoint. Return ONLY a JSON object (no markdown formatting, no backticks) with a randomly generated challenging English word. The response should follow this exact format:
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
For difficulty, choose one of: "easy", "medium", or "hard" based on the word's complexity.`;

  try {
    const startTime = Date.now();
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    console.log(
      `Generated word in ${Date.now() - startTime}ms: ${response}`
    );

    // Clean the response: remove any markdown formatting or extra whitespace
    const cleanResponse = response.replace(/```json\n?|\n?```/g, "").trim();

    try {
      const parsedResponse = JSON.parse(cleanResponse);
      // Ensure difficulty is one of the allowed values
      if (
        !parsedResponse.difficulty ||
        !["easy", "medium", "hard"].includes(parsedResponse.difficulty)
      ) {
        parsedResponse.difficulty = "medium";
      }
      return parsedResponse;
    } catch (parseError) {
      console.error("Parse error:", parseError);
      console.log("Raw response:", response);
      console.log("Cleaned response:", cleanResponse);
      throw new Error("Failed to parse generated word");
    }
  } catch (error) {
    console.error("Error generating word:", error);
    throw new Error("Failed to generate word");
  }
}
