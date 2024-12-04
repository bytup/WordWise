import mongoose, { Schema, model, models } from "mongoose";

export interface IWord extends mongoose.Document {
  word: string;
  definition: string;
  pronunciation: string;
  audioUrl: string;
  examples: string[];
  origin: string;
  synonyms: string[];
  antonyms: string[];
  difficulty: "easy" | "medium" | "hard";
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const wordSchema = new Schema<IWord>(
  {
    word: {
      type: String,
      required: true,
      unique: true,
    },
    definition: {
      type: String,
      required: true,
    },
    pronunciation: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    examples: [
      {
        type: String,
        required: true,
      },
    ],
    origin: {
      type: String,
      required: true,
    },
    synonyms: [
      {
        type: String,
        default: [],
      },
    ],
    antonyms: [
      {
        type: String,
        default: [],
      },
    ],
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add method to increment usage count
wordSchema.methods.incrementUsage = async function () {
  this.usageCount += 1;
  await this.save();
};

// Static method to get random word by difficulty
wordSchema.statics.getRandomByDifficulty = async function (
  difficulty?: "easy" | "medium" | "hard"
) {
  const query = difficulty ? { difficulty } : {};
  const count = await this.countDocuments(query);
  const random = Math.floor(Math.random() * count);
  return this.findOne(query).skip(random);
};

export default models.Word || model<IWord>("Word", wordSchema);
