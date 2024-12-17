"use server";

import db from "@/db";
import { parseColor } from "@/lib/utils";
import { EVENT_CATEGORY_VALIDATION } from "@/lib/validator/category-validator";
import { currentUser } from "@clerk/nextjs/server";
import { startOfMonth } from "date-fns";

export const getEventCategoriesAction = async () => {
  try {
    const user = await getAuth();
    const categories = await db.eventCategory.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        emoji: true,
        color: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const now = new Date();
        const firstDayOfMonth = startOfMonth(now);
        const [uniqueFieldCount, eventsCount, lastPing] = await Promise.all([
          db.event
            .findMany({
              where: {
                eventCategoryId: category.id,
                createdAt: { gte: firstDayOfMonth },
              },
              select: { fields: true },
              distinct: ["fields"],
            })
            .then((events) => {
              const fieldsName = new Set<string>();

              events.forEach((event) => {
                Object.keys(event.fields as Object).forEach((key) => {
                  fieldsName.add(key);
                });
              });
              return fieldsName.size;
            }),
          db.event.count({
            where: {
              eventCategoryId: category.id,
              createdAt: { gte: firstDayOfMonth },
            },
          }),
          db.event.findFirst({
            where: { eventCategory: { id: category.id } },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),
        ]);
        return {
          ...category,
          uniqueFieldCount,
          eventsCount,
          lastPing: lastPing?.createdAt || null,
        };
      })
    );

    return categoriesWithCount;
  } catch (error) {
    return null;
  }
};

export const deleteEventCategoryAction = async (name: string) => {
  console.log("deleted");
  const user = await getAuth();
  await db.eventCategory.delete({
    where: {
      name_userId: {
        name,
        userId: user.id,
      },
    },
  });
};
async function getAuth() {
  "use server";
  const user = await currentUser();
  if (!user) throw new Error("You must be logged in.");
  const dbUser = await db.user.findUnique({
    where: {
      externalId: user.id,
    },
  });
  if (!dbUser) throw new Error("User not found");
  // console.log(dbUser);
  return dbUser;
}

export const createEventCategoryAction = async (
  data: EVENT_CATEGORY_VALIDATION
) => {
  const user = await getAuth();

  // TODO: ADD PAID PLANS

  const eventCategory = await db.eventCategory.create({
    data: {
      name: data.name.toLowerCase(),
      color: parseColor(data.color),
      emoji: data.emoji,
      userId: user.id,
    },
  });
  console.log("data");
  return eventCategory;
};

export const insertQuickEventCategoryAction = async () => {
  const user = await getAuth();

  const eventCategory = await db.eventCategory.createMany({
    data: [
      {
        name: "bug",
        color: 0xFDCB6E,
        emoji: "🐛",
        userId: user.id,
      },
      {
        name: "sale",
        color: 0xFF6B6B,
        emoji: "🤑",
        userId: user.id,
      },
      {
        name: "question",
        color: 0x6c5ce7,
        emoji: "🤔",
        userId: user.id,
      },
    ].map(category=>({
      ...category,
      userId:user.id
    }))
  });
  return {success:true, data:eventCategory.count}
};
