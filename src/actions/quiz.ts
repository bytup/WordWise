"use server";

import { connectToMongoDB } from "@/lib/mongoose";
import Quiz from "@/models/Quiz";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";

export async function getRandomQuiz(difficulty?: "easy" | "medium" | "hard") {
  try {
    await connectToMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const quiz = await Quiz.getRandomByDifficulty(difficulty);
    if (!quiz) {
      throw new Error("No quiz found");
    }

    return { success: true, quiz };
  } catch (error) {
    console.error("Error getting random quiz:", error);
    return { success: false, error: "Failed to get quiz" };
  }
}

export async function submitQuizAnswer(quizId: string, answer: string) {
  try {
    await connectToMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    const isCorrect = quiz.correctAnswer.toLowerCase() === answer.toLowerCase();
    await quiz.recordAnswer(isCorrect);

    // Update user points if answer is correct
    if (isCorrect) {
      const user = await User.findOneAndUpdate(
        { email: session.user.email },
        { $inc: { points: 10 } },
        { new: true }
      );

      if (!user) {
        throw new Error("User not found");
      }
    }

    revalidatePath("/dashboard");
    return {
      success: true,
      isCorrect,
      explanation: quiz.explanation,
    };
  } catch (error) {
    console.error("Error submitting quiz answer:", error);
    return { success: false, error: "Failed to submit answer" };
  }
}

export async function getQuizStats() {
  try {
    await connectToMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const quizzes = await Quiz.find({
      timesAnswered: { $gt: 0 },
    })
      .sort({ successRate: -1 })
      .limit(10);

    return {
      success: true,
      stats: quizzes.map((quiz) => ({
        id: quiz._id,
        question: quiz.question,
        type: quiz.type,
        difficulty: quiz.difficulty,
        timesAnswered: quiz.timesAnswered,
        successRate: quiz.successRate,
      })),
    };
  } catch (error) {
    console.error("Error getting quiz stats:", error);
    return { success: false, error: "Failed to get quiz stats" };
  }
}
