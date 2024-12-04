import mongoose, { Document } from "mongoose";
import { IQuiz } from "@/types";

interface IQuizDocument extends Document, Omit<IQuiz, "_id"> {
  checkAnswer(answer: string): boolean;
}

type QuizModel = mongoose.Model<IQuizDocument>;

const quizSchema = new mongoose.Schema<IQuizDocument>(
  {
    wordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Word",
      required: true,
    },
    type: {
      type: String,
      enum: ["multiple-choice", "fill-blank", "listening"],
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: function (this: IQuizDocument) {
        return this.type === "multiple-choice";
      },
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    audioUrl: {
      type: String,
      required: function (this: IQuizDocument) {
        return this.type === "listening";
      },
    },
    timesAnswered: {
      type: Number,
      default: 0,
    },
    timesCorrect: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for success rate
quizSchema.virtual("successRate").get(function (this: IQuizDocument) {
  if (!this.timesAnswered) return 0;
  return (this.timesCorrect / this.timesAnswered) * 100;
});

// Method to check answer
quizSchema.method(
  "checkAnswer",
  function (this: IQuizDocument, answer: string): boolean {
    return this.correctAnswer.toLowerCase() === answer.toLowerCase();
  }
);

// Create indexes
quizSchema.index({ wordId: 1 });
quizSchema.index({ type: 1 });
quizSchema.index({ difficulty: 1 });

// Static method to get random quiz by difficulty
quizSchema.static(
  "getRandomByDifficulty",
  async function (difficulty?: "easy" | "medium" | "hard") {
    const query = difficulty ? { difficulty } : {};
    const count = await this.countDocuments(query);
    const random = Math.floor(Math.random() * count);
    return this.findOne(query).skip(random).populate("wordId");
  }
);

const Quiz =
  (mongoose.models.Quiz as QuizModel) ||
  mongoose.model<IQuizDocument, QuizModel>("Quiz", quizSchema);

export default Quiz;
