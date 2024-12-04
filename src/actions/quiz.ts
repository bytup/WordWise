"use server";

import { connectToMongoDB } from "@/lib/mongoose";
import QuizModel from "@/models/Quiz";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";
import { QuizResponse, QuizStatsResponse, IQuiz } from "@/types";
import { Document, Model } from "mongoose";

// Import the model interface
interface IQuizMethods {
  recordAnswer(isCorrect: boolean): Promise<void>;
}

interface IQuizModel extends Model<IQuiz, {}, IQuizMethods> {
  getRandomByDifficulty(
    difficulty?: "easy" | "medium" | "hard"
  ): Promise<(Document & IQuiz & IQuizMethods) | null>;
}

// Cast the model to the correct type
// @ts-ignore: Mongoose model typing issue
const Quiz = QuizModel as IQuizModel;

type MongoDoc<T> = Document & T;

function serializeQuiz(quiz: MongoDoc<IQuiz> & { _id: any }): IQuiz {
  return {
    ...quiz.toObject(),
    _id: quiz._id.toString(),
    wordId: quiz.wordId,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
  };
}

export async function getRandomQuiz(
  difficulty?: "easy" | "medium" | "hard"
): Promise<QuizResponse> {
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

    return { success: true, quiz: serializeQuiz(quiz) };
  } catch (error) {
    console.error("Error getting random quiz:", error);
    return { success: false, error: "Failed to get quiz" };
  }
}

export async function submitQuizAnswer(
  quizId: string,
  answer: string
): Promise<{ success: boolean; error?: string; isCorrect?: boolean }> {
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
    };
  } catch (error) {
    console.error("Error submitting quiz answer:", error);
    return { success: false, error: "Failed to submit answer" };
  }
}

export async function getQuizStats(): Promise<QuizStatsResponse> {
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

    const stats = quizzes.map((quiz) => ({
      id: quiz._id.toString(),
      question: quiz.question,
      type: quiz.type,
      difficulty: quiz.difficulty,
      timesAnswered: quiz.timesAnswered,
      successRate: quiz.get("successRate"),
    }));

    return { success: true, stats };
  } catch (error) {
    console.error("Error getting quiz stats:", error);
    return { success: false, error: "Failed to get quiz stats" };
  }
}
