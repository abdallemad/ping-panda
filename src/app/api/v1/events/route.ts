import { FREE_QUOTA, PRO_QUOTA } from "@/config";
import db from "@/db";
import { DiscordClient } from "@/lib/discord-client";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validator/category-validator";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const REQUEST_VALIDATOR = z
  .object({
    name: CATEGORY_NAME_VALIDATOR,
    fields: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
    description: z.string().optional(),
  })
  .strict();

export const POST = async (req: NextRequest) => {
  try {
    // validation
    const authHeader = req.headers.get("Authorization");
    if (!authHeader)
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    if (!authHeader.startsWith("Bearer "))
      return NextResponse.json(
        { message: "invalid  auth header format expected 'Bearer <token>" },
        { status: 401 }
      );
    const apiKey = authHeader.split(" ")[1];
    if (!apiKey || apiKey.trim().length === 0)
      return NextResponse.json({ message: "invalid api key" }, { status: 401 });
    const user = await db.user.findUnique({
      where: { apiKey },
      include: { EventCategories: true },
    });
    if (!user)
      return NextResponse.json({ message: "invalid api key" }, { status: 401 });
    if (!user.discordId)
      return NextResponse.json(
        { message: "please inter your discord id in your account sittings" },
        { status: 403 }
      );
    // business logic
    const currentDay = new Date();
    const currentMonth = currentDay.getMonth() + 1;
    const currentYear = currentDay.getFullYear();
    const quota = await db.quota.findUnique({
      where: {
        userId: user.id,
        month: currentMonth,
        year: currentYear,
      },
    });
    // quota limit
    const quotaLimit =
      user.plan === "FREE"
        ? FREE_QUOTA.maxEventsPerMonth
        : PRO_QUOTA.maxEventsPerMonth;
    if (quota && quota.count >= quotaLimit) {
      return NextResponse.json(
        { message: "quota limit reached" },
        { status: 429 }
      );
    }
    // discord
    const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN);
    const dmChannel = await discord.createDM(user.discordId);
    let requestData: unknown;
    try {
      requestData = await req.json();
    } catch (error) {
      return NextResponse.json(
        { message: "something went wrong" },
        { status: 400 }
      );
    }
    const validationResult = REQUEST_VALIDATOR.parse(requestData);

    const category = user.EventCategories.find(
      (category) => category.name === validationResult.name
    );
    if (!category)
      return NextResponse.json(
        { message: `category not found by name ${validationResult.name}` },
        { status: 404 }
      );
    const eventData = {
      title: `${category.emoji || "🔔"} ${category.name}`,
      description:
        validationResult.description || `New ${category.name} Event!`,
      color: category.color,
      timestamp: new Date().toISOString(),
      fields: Object.entries(validationResult.fields || {}).map(
        ([key, value]) => ({
          name: key,
          value: value.toString(),
          inline: true,
        })
      ),
    };
    const event = await db.event.create({
      data: {
        name: category.name,
        formattedMessage: `${eventData.title} \n\n ${eventData.description}`,
        fields: JSON.stringify(validationResult.fields || {}),
        userId: user.id,
        eventCategoryId: category.id,
      },
    });
    try {
      await discord.sendEmbed(dmChannel.id, eventData);
      await db.event.update({
        where: {
          id: event.id,
        },
        data: {
          deliveryStatus: "DELIVERED",
        },
      });
      await db.quota.upsert({
        where: {
          userId: user.id,
          month: currentMonth,
          year: currentYear,
        },
        update: { count: { increment: 1 } },
        create: {
          userId: user.id,
          month: currentMonth,
          year: currentYear,
          count: 1,
        },
      });
    } catch (error) {
      await db.event.update({
        where: {
          id: event.id,
        },
        data: { deliveryStatus: "FAILED" },
      });
      console.log(error);
      return NextResponse.json(
        { message: "something went wrong", eventId: event.id },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "success", eventId: event.id },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    if(error instanceof ZodError) return NextResponse.json({ message: error.message }, { status: 400 });
    return NextResponse.json({ message: "something went wrong" }, { status: 500 });
  }
};
