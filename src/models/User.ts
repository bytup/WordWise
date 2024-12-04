import mongoose, { Schema, model, models } from "mongoose";

export interface IUser extends mongoose.Document {
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

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: String,
    savedWords: [
      {
        type: String,
        default: [],
      },
    ],
    streak: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
    lastLoginDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add method to update streak
userSchema.methods.updateStreak = async function () {
  const now = new Date();
  const lastLogin = this.lastLoginDate;
  const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day login
    this.streak += 1;
  } else if (diffDays > 1) {
    // Streak broken
    this.streak = 1;
  }
  // If diffDays === 0, user logged in multiple times same day, don't change streak

  this.lastLoginDate = now;
  await this.save();
};

export default models.User || model<IUser>("User", userSchema);
