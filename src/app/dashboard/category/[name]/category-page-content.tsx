"use client";
import { EventCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import EmptyCategoryState from "./empty-category-state";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { getEventsByCategoryName } from "./action";
interface Props {
  hasEvents: boolean;
  category: EventCategory;
}

function CategoryPageContent({ hasEvents: initialHasEvents, category }: Props) {
  const [activeTap, setActiveTap] = useState<"today" | "month" | "week">(
    "today"
  );
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: limit,
  });
  const { data: pollingData } = useQuery({
    queryKey: ["category", category.name, "hasEvents"],
    initialData: { hasEvents: initialHasEvents },
  });
  if (!pollingData.hasEvents)
    return <EmptyCategoryState categoryName={category.name} />;

  const { data, isFetching } = useQuery({
    queryKey: [
      "events",
      category.name,
      pagination.pageIndex,
      pagination.pageSize,
      activeTap,
    ],
    queryFn: async () =>
      await getEventsByCategoryName({
        categoryName: category.name,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        timeRange: activeTap,
      }),
    refetchOnWindowFocus: false,
    enabled: pollingData.hasEvents,
  });

  return (
    <div>content</div>
  )
}

export default CategoryPageContent;
