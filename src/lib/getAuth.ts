"use server";
import db from "@/db";
import { currentUser } from "@clerk/nextjs/server";
export async function getAuth() {
  const user = await currentUser();
  if (!user) throw new Error("You must be logged in.");
  const dbUser = await db.user.findUnique({
    where: {
      externalId: user.id,
    },
  });
  if (!dbUser) throw new Error("User not found");
  return dbUser;
}
