"use server";

import { connectToMongoDB } from "@/lib/mongoose";
import QuizModel from "@/models/Quiz";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";
import { QuizResponse, QuizStatsResponse, IQuiz } from "@/types";
import { Document, Model } from "mongoose";
import QuizAttempt from "@/models/QuizAttempt";

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

export async function submitQuizAnswer(quizId: string, answer: string) {
  try {
    await connectToMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const quiz = (await Quiz.findById(quizId)) as any;
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    const isCorrect = quiz.checkAnswer(answer);

    // Record the attempt
    await QuizAttempt.create({
      userEmail: session.user.email,
      quiz: quizId,
      isCorrect,
      answer,
    });

    // Update quiz stats
    quiz.timesAnswered = (quiz.timesAnswered || 0) + 1;
    if (isCorrect) {
      quiz.timesCorrect = (quiz.timesCorrect || 0) + 1;
    }
    await quiz.save();

    revalidatePath("/dashboard/quiz");
    revalidatePath("/dashboard/progress");

    return {
      success: true,
      isCorrect,
      correctAnswer: isCorrect ? undefined : quiz.answer,
    };
  } catch (error) {
    console.error("Error submitting quiz answer:", error);
    return {
      success: false,
      error: "Failed to submit quiz answer",
    };
  }
}

export async function getQuizStats() {
  try {
    await connectToMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    // Get all quiz attempts by the user
    const attempts = await QuizAttempt.find({ userEmail: session.user.email })
      .populate("quiz")
      .lean();

    // Group attempts by quiz and calculate stats
    const quizMap = new Map();
    attempts.forEach((attempt) => {
      const quizId = attempt.quiz._id.toString();
      if (!quizMap.has(quizId)) {
        quizMap.set(quizId, {
          id: quizId,
          question: attempt.quiz.question,
          type: attempt.quiz.type,
          difficulty: attempt.quiz.difficulty,
          correctAttempts: 0,
          totalAttempts: 0,
        });
      }

      const stats = quizMap.get(quizId);
      stats.totalAttempts++;
      if (attempt.isCorrect) {
        stats.correctAttempts++;
      }
    });

    // Calculate success rates
    const stats = Array.from(quizMap.values()).map((stat) => ({
      id: stat.id,
      question: stat.question,
      type: stat.type,
      difficulty: stat.difficulty,
      timesAnswered: stat.totalAttempts,
      successRate: (stat.correctAttempts / stat.totalAttempts) * 100,
    }));

    return {
      success: true,
      stats,
    };
  } catch (error) {
    console.error("Error getting quiz stats:", error);
    return {
      success: false,
      error: "Failed to get quiz statistics",
    };
  }
}
