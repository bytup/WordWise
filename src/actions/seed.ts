"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { seedDatabase } from "@/scripts/seed";

export async function seedDatabaseAction() {
  try {
    const session = await getServerSession(authOptions);

    // Only allow admin users to seed the database
    if (!session?.user?.email || !session.user.email.endsWith("@gmail.com")) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await seedDatabase();
    return result;
  } catch (error) {
    console.error("Error in seed action:", error);
    return { success: false, error: "Failed to seed database" };
  }
}
