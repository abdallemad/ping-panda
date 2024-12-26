"use server";

import { FREE_QUOTA, PRO_QUOTA } from "@/config";
import db from "@/db";
import { getAuth } from "@/lib/getAuth";
import { createCheckoutSession } from "@/lib/stripe";
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
