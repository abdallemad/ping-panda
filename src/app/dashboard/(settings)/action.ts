'use server';

import db from "@/db";
import { getAuth } from "@/lib/getAuth";


export const updateDiscordIdAction = async (discordId: string) => {
  try {
    const user = await getAuth();
    await db.user.update({
      where: { externalId: user.id },
      data: { discordId },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

