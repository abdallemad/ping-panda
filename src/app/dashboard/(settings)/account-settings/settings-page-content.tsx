"use client";
import { useState } from "react";

function SettingsPageContent({
  discordId: initialDiscordId,
}: {
  discordId: string | null;
}) {
  const [discordId, setDiscordId] = useState(initialDiscordId)
  
  return <div></div>;
}

export default SettingsPageContent;
