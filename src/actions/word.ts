"use server";

import { connectToMongoDB } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";
import WordModel from "@/models/Word";
import User from "@/models/User";
import { WordResponse, WordsResponse, IWord } from "@/types";
import { Document, Model } from "mongoose";

// Import the model interface
interface IWordMethods {
  incrementUsage(): Promise<void>;
}

interface IWordModel extends Model<IWord, {}, IWordMethods> {
  getRandomByDifficulty(
    difficulty?: "easy" | "medium" | "hard"
  ): Promise<(Document & IWord & IWordMethods) | null>;
}

// Cast the model to the correct type
// @ts-ignore: Mongoose model typing issue
const Word = WordModel as IWordModel;

type MongoDoc<T> = Document & T;

function serializeWord(word: MongoDoc<IWord> & { _id: any }): IWord {
  return {
    ...word.toObject(),
    _id: word._id.toString(),
    createdAt: word.createdAt,
    updatedAt: word.updatedAt,
  };
}

export async function getDailyWord(): Promise<WordResponse> {
  try {
    await connectToMongoDB();
    const session = await getServerSession(authOptions);
    console.log("Session: ", session);

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const word = await Word.getRandomByDifficulty();
    if (!word) {
      throw new Error("No word found");
    }

    await word.incrementUsage();
    return { success: true, word: serializeWord(word) };
  } catch (error) {
    console.error("Error getting daily word:", error);
    return { success: false, error: "Failed to get daily word" };
  }
}

export async function getWordsByDifficulty(
  difficulty: "easy" | "medium" | "hard"
): Promise<WordsResponse> {
  try {
    await connectToMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const words = await Word.find({ difficulty })
      .sort({ usageCount: -1 })
      .limit(10);

    const serializedWords = words.map((word) => serializeWord(word));

    return { success: true, words: serializedWords };
  } catch (error) {
    console.error("Error getting words by difficulty:", error);
    return { success: false, error: "Failed to get words" };
  }
}

export async function getSavedWords(): Promise<WordsResponse> {
  try {
    await connectToMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      throw new Error("User not found");
    }

    console.log('Saved Words: ', user.savedWords);
    const words = await Word.find({
      _id: { $in: user.savedWords },
    });

    const serializedWords = words.map((word) => serializeWord(word));

    return { success: true, words: serializedWords };
  } catch (error) {
    console.error("Error getting saved words:", error);
    return { success: false, error: "Failed to get saved words" };
  }
}
