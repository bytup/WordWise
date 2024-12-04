import mongoose from "mongoose";
import { connectToMongoDB } from "../lib/mongoose";
import Word from "../models/Word";
import Quiz from "../models/Quiz";
import User from "../models/User";

export const words: Partial<any>[] = [
  {
    word: "serendipity",
    definition:
      "The occurrence and development of events by chance in a happy or beneficial way",
    pronunciation: "ˌserənˈdipədē",
    audioUrl: "https://example.com/audio/serendipity.mp3",
    examples: [
      "The discovery of penicillin was a case of pure serendipity",
      "Finding my dream job was serendipity",
    ],
    origin:
      "Coined by Horace Walpole in 1754 based on the Persian fairy tale 'The Three Princes of Serendip'",
    synonyms: ["chance", "fate", "luck", "providence"],
    antonyms: ["misfortune", "design", "plan"],
    difficulty: "hard",
  },
  {
    word: "ephemeral",
    definition: "Lasting for a very short time",
    pronunciation: "əˈfem(ə)rəl",
    audioUrl: "https://example.com/audio/ephemeral.mp3",
    examples: [
      "The ephemeral nature of fashion trends",
      "Social media posts are often ephemeral",
    ],
    origin: "From Greek ephēmeros 'lasting only one day'",
    synonyms: ["fleeting", "temporary", "transient", "brief"],
    antonyms: ["permanent", "lasting", "eternal"],
    difficulty: "hard",
  },
  {
    word: "cat",
    definition: "A small domesticated carnivorous mammal",
    pronunciation: "kat",
    audioUrl: "https://example.com/audio/cat.mp3",
    examples: ["The cat sat on the mat", "She has three cats as pets"],
    origin: "From Old English catt, from Late Latin cattus",
    synonyms: ["feline", "kitty", "kitten"],
    antonyms: [],
    difficulty: "easy",
  },
];

export const quizzes: Partial<any>[] = [
  {
    type: "multiple-choice",
    question: "What is the meaning of 'serendipity'?",
    options: [
      "The occurrence of events by chance in a beneficial way",
      "A state of complete disorder",
      "A formal written agreement",
      "A type of ancient weapon",
    ],
    correctAnswer: "The occurrence of events by chance in a beneficial way",
    explanation:
      "Serendipity refers to finding something good without looking for it",
    difficulty: "hard",
  },
  {
    type: "fill-blank",
    question: "The _______ beauty of cherry blossoms makes them special.",
    correctAnswer: "ephemeral",
    explanation:
      "Ephemeral means lasting for a very short time, which perfectly describes the brief blooming period of cherry blossoms",
    difficulty: "hard",
  },
  {
    type: "multiple-choice",
    question: "Which animal is a cat?",
    options: [
      "A small domesticated carnivorous mammal",
      "A large aquatic mammal",
      "A type of bird",
      "A reptile",
    ],
    correctAnswer: "A small domesticated carnivorous mammal",
    explanation:
      "A cat is a small domesticated carnivorous mammal, often kept as a pet",
    difficulty: "easy",
  },
];

export const users = [
  {
    email: "test@example.com",
    name: "Test User",
    image: "https://example.com/avatar.jpg",
    savedWords: [],
    streak: 5,
    points: 100,
  },
  {
    email: "demo@example.com",
    name: "Demo User",
    savedWords: [],
    streak: 3,
    points: 50,
  },
];

export async function seedDatabase() {
  try {
    await connectToMongoDB();

    // Clear existing data
    await Promise.all([
      Word.deleteMany({}),
      Quiz.deleteMany({}),
      User.deleteMany({}),
    ]);

    // Insert words
    const insertedWords = await Word.insertMany(words);
    console.log("✅ Words seeded");

    // Create quizzes with word references
    const quizzesWithRefs = quizzes.map((quiz, index) => ({
      ...quiz,
      wordId: insertedWords[index]._id,
    }));
    await Quiz.insertMany(quizzesWithRefs);
    console.log("✅ Quizzes seeded");

    // Insert users
    await User.insertMany(users);
    console.log("✅ Users seeded");

    console.log("🌱 Database seeded successfully");
    return { success: true };
  } catch (error) {
    console.error("Error seeding database:", error);
    return { success: false, error: "Failed to seed database" };
  }
}

// Only run if this file is being executed directly
if (require.main === module) {
  seedDatabase().then(() => mongoose.disconnect());
}
