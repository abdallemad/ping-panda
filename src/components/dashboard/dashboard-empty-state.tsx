"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { insertQuickEventCategoryAction } from "@/app/dashboard/actions";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import CreateEventCategoryModal from "./create-event-category-modal";

function DashboardEmptyState() {
  const queryClient = useQueryClient();

  const { mutate: insertQuickStartCategory, isPending } = useMutation({
    mutationFn: async () => await insertQuickEventCategoryAction(),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["user-event-categories"],
      });
    },
  });
  return (
    <Card className="flex flex-col items-center justify-center rounded-2xl text-center flex-1 p-6">
      <div className="flex justify-center w-full">
        <img
          src="/brand-asset-wave.png"
          alt="no category"
          className="size-48 -mt-24"
        />
      </div>
      <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">
        No Event Categories yet
      </h1>
      <p className="text-sm/6 text-gray-600 max-w-prose mt-2 mb-8">
        Start tracking event by creating your first category.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button
          className="w-full flex items-center space-x-2 sm:w-auto"
          disabled={isPending}
          variant={"outline"}
          onClick={() => insertQuickStartCategory()}
        >
          <span className="size-5">🚀</span>
          {isPending ? "Creating..." : "Quic start"}
        </Button>
        <CreateEventCategoryModal wrapperClassName="w-full sm:w-auto">
          <Button className="w-full flex items-center space-x-2 sm:w-auto">
            {" "}
            Add Category
          </Button>
        </CreateEventCategoryModal>
      </div>
    </Card>
  );
}

export default DashboardEmptyState;
