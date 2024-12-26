"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { updateDiscordIdAction } from "./action";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { title } from "process";

function SettingsPageContent({
  discordId: initialDiscordId,
}: {
  discordId: string;
}) {
  const [discordId, setDiscordId] = useState(initialDiscordId);
  const {toast} = useToast();
  const { mutate: updateDiscordId, isPending } = useMutation({
    mutationFn: async (discordId: string) => {
      return await updateDiscordIdAction(discordId);
    },
    onSuccess: ({success}) => {
      if (success) {
        toast({
          title:'Discord Id updated successfully',
        });
      } else {
        toast({
          title: 'Failed to update discord id',
          variant:'destructive',
        });
      }
    },
  });
  return (
    <Card className="max-w-xl w-full space-y-4">
      <div>
        <Label>Discord Id</Label>
        <Input
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          className="mt-1"
          placeholder="Enter your discord id"
        />
      </div>
      <p className="mt-2 text-sm/6 text-gray-600">
        Don't know how to find your discord id?{""}
        <Link
          href="https://www.youtube.com/watch?v=2eP6CFFpZ3E"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 hover:text-brand-500"
        >
          Learn how Obtain Discord Id.
        </Link>
      </p>
      <div className="pt-4">
        <Button
          onClick={() => updateDiscordId(discordId)}
          className=""
          disabled={!discordId}
        >
          {
            isPending ? "Saving..." : "Save changes"
          }
        </Button>
      </div>
    </Card>
  );
}

export default SettingsPageContent;
