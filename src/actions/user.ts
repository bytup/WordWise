"use server";

import { getServerSession } from "next-auth";
import { connectToMongoDB } from "@/lib/mongoose";
import User from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";

interface SaveWordResponse {
  success: boolean;
  error?: string;
  savedWords?: string[];
}

export async function saveWord(wordId: string): Promise<SaveWordResponse> {
  try {
    await connectToMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    // Check if word is already saved
    const existingUser = await User.findOne({
      email: session.user.email,
      savedWords: wordId,
    });

    if (existingUser) {
      return {
        success: false,
        error: "Word is already saved",
      };
    }

    // Add word to user's saved words
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $addToSet: { savedWords: wordId } },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/vocabulary");

    return {
      success: true,
      savedWords: user.savedWords,
    };
  } catch (error) {
    console.error("Error saving word:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save word",
    };
  }
}

export async function removeWord(wordId: string): Promise<SaveWordResponse> {
  try {
    await connectToMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $pull: { savedWords: wordId } },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/vocabulary");

    return {
      success: true,
      savedWords: user.savedWords,
    };
  } catch (error) {
    console.error("Error removing word:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove word",
    };
  }
}

export async function updateUserStreak() {
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

    await user.updateStreak();
    revalidatePath("/dashboard");

    return { success: true, streak: user.streak };
  } catch (error) {
    console.error("Error updating streak:", error);
    return { success: false, error: "Failed to update streak" };
  }
}

export async function getUserProgress() {
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

    return {
      success: true,
      progress: {
        streak: user.streak,
        points: user.points,
        savedWords: user.savedWords,
        lastLoginDate: user.lastLoginDate,
      },
    };
  } catch (error) {
    console.error("Error getting user progress:", error);
    return { success: false, error: "Failed to get user progress" };
  }
}
