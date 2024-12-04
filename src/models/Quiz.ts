import mongoose, { Schema, model, models } from "mongoose";

export interface IQuiz extends mongoose.Document {
  type: "multiple-choice" | "fill-blank" | "listening";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  wordId: mongoose.Types.ObjectId;
  difficulty: "easy" | "medium" | "hard";
  audioUrl?: string;
  timesAnswered: number;
  timesCorrect: number;
  createdAt: Date;
  updatedAt: Date;
}

const quizSchema = new Schema<IQuiz>(
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

export default models.Quiz || model<IQuiz>("Quiz", quizSchema);
