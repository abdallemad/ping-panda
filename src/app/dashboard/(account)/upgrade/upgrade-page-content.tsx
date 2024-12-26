"use client";

import { Plan } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { upgradePlanAction, getUsageAction } from "./action";
import { Card } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { formatDate } from "date-fns";

function UpgradePageContent({ plan }: { plan: Plan }) {
  const router = useRouter();
  const { mutate: createCheckoutSession } = useMutation({
    mutationFn: async () => await upgradePlanAction(),
    onSuccess: (data) => {
      if (data?.url) router.push(data.url);
    },
  });
  const { data: usageData } = useQuery({
    queryKey: ["usage"],
    queryFn: async () => {
      return await getUsageAction();
    },
  });
  return (
    <div className="max-w-3xl flex flex-col gap-8">
      <div>
        <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">
          {plan === "PRO" ? "Plan: Pro" : "Plan: Free"}
        </h1>
        <p className="text-sm/6 text-gray-600 max-w-prose">
          {plan == "PRO"
            ? "Thank you for being a Pro member!"
            : "You are currently on the free plan. Upgrade to Pro for more features."}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-brand-700">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">Total Events</p>
            <BarChart className="size-4 text-muted-foreground" />
          </div>

          <div>
            <p className="text-2xl font-bold">
              {usageData?.eventsUsed || 0} of{" "}
              {usageData?.eventsLimit.toLocaleString() || 100}
            </p>
            <p className="text-xs/5 text-muted-foreground">
              Events this period
            </p>
          </div>
        </Card>
        <Card className="">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">Event Categories</p>
            <BarChart className="size-4 text-muted-foreground" />
          </div>

          <div>
            <p className="text-2xl font-bold">
              {usageData?.categoriesUsed || 0} of{" "}
              {usageData?.categoriesLimit.toLocaleString() || 10}
            </p>
            <p className="text-xs/5 text-muted-foreground">Active Categories</p>
          </div>
        </Card>
      </div>
      <p className="text-sm text-gray-500">
        Usage will reset{" "}
        {usageData?.resetDate ? (
          formatDate(new Date(usageData.resetDate), "MMMM d, yyyy")
        ) : (
          <span
            className="animate-pulse w-8 h-4 bg-gray-200
          "
          ></span>
        )}
        {plan === "FREE" && (
          <span
            onClick={() => createCheckoutSession()}
            className="underline text-brand-700 cursor-pointer"
          >
            {" "}
            Upgrade to increase your limit &rarr;
          </span>
        )}
      </p>
    </div>
  );
}

export default UpgradePageContent;
