"use server";

import { connectToMongoDB } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";
import Word from "@/models/Word";
import User from "@/models/User";

export async function getDailyWord() {
  try {
    await connectToMongoDB();
    const session = await getServerSession(authOptions);
    console.log("Session: ", session);

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    // Get a random word - in production, you might want to implement
    // a more sophisticated selection algorithm
    const word = await Word.findOne().lean();
    if (!word) {
      throw new Error("No word found");
    }

    // Convert MongoDB _id to string to make it serializable
    const serializedWord = {
      ...word,
      _id: word._id.toString(),
    };

    return { success: true, word: serializedWord };
  } catch (error) {
    console.error("Error getting daily word:", error);
    return { success: false, error: "Failed to get daily word" };
  }
}

export async function getWordsByDifficulty(
  difficulty: "easy" | "medium" | "hard"
) {
  try {
    await connectToMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const words = await Word.find({ difficulty })
      .sort({ usageCount: -1 })
      .limit(10)
      .lean();

    // Convert MongoDB _id to string for each word
    const serializedWords = words.map((word) => ({
      ...word,
      _id: word._id.toString(),
    }));

    return { success: true, words: serializedWords };
  } catch (error) {
    console.error("Error getting words by difficulty:", error);
    return { success: false, error: "Failed to get words" };
  }
}

export async function getSavedWords() {
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

    const words = await Word.find({
      _id: { $in: user.savedWords },
    }).lean();

    // Convert MongoDB _id to string for each word
    const serializedWords = words.map((word) => ({
      ...word,
      _id: word._id.toString(),
    }));

    return { success: true, words: serializedWords };
  } catch (error) {
    console.error("Error getting saved words:", error);
    return { success: false, error: "Failed to get saved words" };
  }
}
