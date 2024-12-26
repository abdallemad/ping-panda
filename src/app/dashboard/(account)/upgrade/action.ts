"use server";

import { FREE_QUOTA, PRO_QUOTA } from "@/config";
import db from "@/db";
import { createCheckoutSession } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { addMonths, startOfMonth } from "date-fns";

export const upgradePlanAction = async () => {
  const user = await getAuth();

  const session = await createCheckoutSession({
    userEmail: user.email,
    userId: user.id,
  });

  return { url: session.url };
};

export const getUsageAction = async () => {
  const user = await getAuth();
  const currentDate = startOfMonth(new Date());
  const [quota,categoryCount] = await Promise.all([
    db.quota.findFirst({
      where: {
        userId: user.id,
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
      },
    }),
    db.eventCategory.count({
      where: {
        userId: user.id,
      },
    }),
  ]);
  const eventCount = quota?.count ?? 0;
  const limit = user.plan === "PRO" ? PRO_QUOTA : FREE_QUOTA;
  const resetDate = addMonths(currentDate, 1);
  return {
    categoriesUsed: categoryCount,
    categoriesLimit:limit.maxEventsCategories,
    eventsUsed: eventCount,
    eventsLimit: limit.maxEventsPerMonth,
    resetDate
  }
};

async function getAuth() {
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
