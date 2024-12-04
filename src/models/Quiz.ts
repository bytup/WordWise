import mongoose, { Schema, model, models, Model } from "mongoose";
import { IQuiz } from "@/types";

interface IQuizMethods {
  recordAnswer(isCorrect: boolean): Promise<void>;
}

interface IQuizModel extends Model<IQuiz, {}, IQuizMethods> {
  getRandomByDifficulty(
    difficulty?: "easy" | "medium" | "hard"
  ): Promise<IQuiz | null>;
}

const quizSchema = new Schema<IQuiz, IQuizModel, IQuizMethods>(
  {
    type: {
      type: String,
      enum: ["multiple-choice", "fill-blank", "listening"],
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: [
      {
        type: String,
      },
    ],
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    wordId: {
      type: Schema.Types.ObjectId,
      ref: "Word",
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    audioUrl: String,
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
  }
);

// Method to record an answer
quizSchema.methods.recordAnswer = async function (isCorrect: boolean) {
  this.timesAnswered += 1;
  if (isCorrect) {
    this.timesCorrect += 1;
  }
  await this.save();
};

// Static method to get random quiz by difficulty
quizSchema.statics.getRandomByDifficulty = async function (
  difficulty?: "easy" | "medium" | "hard"
) {
  const query = difficulty ? { difficulty } : {};
  const count = await this.countDocuments(query);
  const random = Math.floor(Math.random() * count);
  return this.findOne(query).populate("wordId").skip(random);
};

// Virtual for success rate
quizSchema.virtual("successRate").get(function () {
  if (this.timesAnswered === 0) return 0;
  return (this.timesCorrect / this.timesAnswered) * 100;
});

export default models.Quiz || model<IQuiz, IQuizModel>("Quiz", quizSchema);
