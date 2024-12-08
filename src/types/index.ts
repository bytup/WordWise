import { Types } from "mongoose";

export interface IWord {
  _id: string;
  word: string;
  definition: string;
  pronunciation: string;
  audioUrl?: string;
  examples: string[];
  origin: string;
  synonyms: string[];
  antonyms: string[];
  difficulty: "easy" | "medium" | "hard";
  usageCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuiz {
  _id: string;
  type: "multiple-choice" | "fill-blank" | "listening";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  wordId: Types.ObjectId;
  difficulty: "easy" | "medium" | "hard";
  audioUrl?: string;
  timesAnswered: number;
  timesCorrect: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  _id: string;
  email: string;
  name: string;
  image?: string;
  savedWords: string[];
  streak: number;
  points: number;
  lastLoginDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
}

export interface WordResponse extends ApiResponse<IWord> {
  word?: IWord;
}

export interface WordsResponse extends ApiResponse<IWord[]> {
  words?: IWord[];
}

export interface QuizResponse extends ApiResponse<IQuiz> {
  quiz?: IQuiz;
}

export interface QuizStatsResponse
  extends ApiResponse<
    Array<{
      id: string;
      question: string;
      type: IQuiz["type"];
      difficulty: IQuiz["difficulty"];
      timesAnswered: number;
      successRate: number;
    }>
  > {
  stats?: Array<{
    id: string;
    question: string;
    type: IQuiz["type"];
    difficulty: IQuiz["difficulty"];
    timesAnswered: number;
    successRate: number;
  }>;
}

export interface UserProgressResponse
  extends ApiResponse<{
    streak: number;
    points: number;
    savedWords: string[];
    lastLoginDate: Date;
  }> {
  progress?: {
    streak: number;
    points: number;
    savedWords: string[];
    lastLoginDate: Date;
  };
}
