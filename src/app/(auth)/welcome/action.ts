"use server";

import db from "@/db";
import { currentUser } from "@clerk/nextjs/server";


export const syncUserAction = async () => {
  const auth = await currentUser();
  if (!auth)
    return {
      isSynced: false,
    };
  const user = await db.user.findFirst({
    where: {
      externalId: auth.id,
    },
  });
  if (!user) {
    await db.user.create({
      data: {
        externalId: auth.id,
        email: auth.emailAddresses[0].emailAddress,
        quotaLimit: 100,
        apiKey: `api_${auth.id}`,
      },
    });
    return {
      isSynced: true,
    };
  }

  return {
    isSynced: true,
  };
};
