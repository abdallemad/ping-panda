"use server";
import db from "@/db";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validator/category-validator";
import { currentUser } from "@clerk/nextjs/server";
import { startOfDay, startOfMonth, startOfWeek } from "date-fns";

async function getAuth() {
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

export const pollCategory = async (rawName: string) => {
  const user = await getAuth();
  const data = CATEGORY_NAME_VALIDATOR.safeParse(rawName);
  if (!data.success) throw new Error("please provide correct name");
  const name = data.data;
  const category = await db.eventCategory.findUnique({
    where: {
      name_userId: {
        name,
        userId: user.id,
      },
    },
    include: { _count: { select: { events: true } } },
  });
  if (!category) throw new Error("category not found");
  const hasEvents = category._count.events > 0;
  return { hasEvents };
};
export const getEventsByCategoryName = async ({
  categoryName:name,
  page,
  limit,
  timeRange,
}: {
  categoryName: string;
  page: number;
  limit: number;
  timeRange: "week" | "month" | "today";
}) => {
  const user = await getAuth();
  const now = new Date()
  let startDate: Date

  switch (timeRange) {
    case "today":
      startDate = startOfDay(now)
      break
    case "week":
      startDate = startOfWeek(now, { weekStartsOn: 0 })
      break
    case "month":
      startDate = startOfMonth(now)
      break
  }

  const [events, eventsCount, uniqueFieldCount] = await Promise.all([
    db.event.findMany({
      where: {
        eventCategory: { name, userId: user.id },
        createdAt: { gte: startDate },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.event.count({
      where: {
        eventCategory: { name, userId: user.id },
        createdAt: { gte: startDate },
      },
    }),
    db.event
      .findMany({
        where: {
          eventCategory: { name, userId: user.id },
          createdAt: { gte: startDate },
        },
        select: {
          fields: true,
        },
        distinct: ["fields"],
      })
      .then((events) => {
        const fieldNames = new Set<string>()
        events.forEach((event) => {
          Object.keys(event.fields as object).forEach((fieldName) => {
            fieldNames.add(fieldName)
          })
        })
        return fieldNames.size
      }),
  ])

  return ({
    events,
    eventsCount,
    uniqueFieldCount,
  })
};

export const getPlanAction = async ()=>{
  const user = await getAuth();
  return {plan:user.plan}
}