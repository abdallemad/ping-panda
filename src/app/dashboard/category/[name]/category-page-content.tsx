"use client";
import Heading from "@/components/globals/Heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Event, EventCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { isAfter, isToday, startOfMonth, startOfWeek } from "date-fns";
import { ArrowUpDown, BarChart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getEventsByCategoryName } from "./action";
import EmptyCategoryState from "./empty-category-state";
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

  const numericFieldSums = useMemo(() => {
    if (!data?.events || data.events.length === 0) return {};

    const sums: Record<
      string,
      {
        total: number;
        thisWeek: number;
        thisMonth: number;
        today: number;
      }
    > = {};

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const monthStart = startOfMonth(now);

    data.events.forEach((event) => {
      const eventDate = event.createdAt;

      Object.entries(JSON.parse(event.fields as string) as object).forEach(
        ([field, value]) => {
          if (typeof value === "number") {
            if (!sums[field]) {
              sums[field] = { total: 0, thisWeek: 0, thisMonth: 0, today: 0 };
            }

            sums[field].total += value;

            if (
              isAfter(eventDate, weekStart) ||
              eventDate.getTime() === weekStart.getTime()
            ) {
              sums[field].thisWeek += value;
            }

            if (
              isAfter(eventDate, monthStart) ||
              eventDate.getTime() === monthStart.getTime()
            ) {
              sums[field].thisMonth += value;
            }

            if (isToday(eventDate)) {
              sums[field].today += value;
            }
          }
        }
      );
    });

    return sums;
  }, [data?.events]);
  console.log(data?.events);
  const NumericFieldSumCards = () => {
    if (Object.keys(numericFieldSums).length === 0) return null;

    return Object.entries(numericFieldSums).map(([field, sums]) => {
      const relevantSum =
        activeTap === "today"
          ? sums.today
          : activeTap === "week"
          ? sums.thisWeek
          : sums.thisMonth;

      return (
        <Card key={field}>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </p>
            <BarChart className="size-4 text-muted-foreground" />
          </div>

          <div>
            <p className="text-2xl font-bold">{relevantSum.toFixed(2)}</p>
            <p className="text-xs/5 text-muted-foreground">
              {activeTap === "today"
                ? "today"
                : activeTap === "week"
                ? "this week"
                : "this month"}
            </p>
          </div>
        </Card>
      );
    });
  };
  const columns: ColumnDef<Event>[] = useMemo(() => {
    return [
      {
        accessorKey: "category",
        header: "Category",
        cell: () => <span>{category.name || "Uncategorized"}</span>,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Date
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          return new Date(row.getValue("createdAt")).toLocaleString();
        },
      },
      ...(data?.events[0]
        ? Object.keys(JSON.parse(data.events[0].fields as string) as object)
            .filter((field) => typeof field === "string") // Only include string keys
            .map((field) => ({
              accessorFn: (row: Event) => {
                const value = (
                  JSON.parse(row.fields as string) as Record<string, any>
                )[field];
                // Handle nested or JSON values
                return typeof value === "object"
                  ? JSON.stringify(value, null, 2) // Convert to a string for display
                  : value || "-"; // Use the value or a fallback
              },
              header: field, // Use the key as the header
              cell: ({ row }: { row: Row<Event> }) => {
                const value = (
                  JSON.parse(row.original.fields as string) as Record<
                    string,
                    any
                  >
                )[field];
                return typeof value === "object"
                  ? JSON.stringify(value, null, 2) // Display objects as JSON strings
                  : value || "-"; // Use the value or a fallback
              },
            }))
        : []),
      {
        accessorKey: "deliveryStatus",
        header: "Delivery Status",
        cell: ({ row }) => (
          <span
            className={cn("px-2 py-1 rounded-full text-xs font-semibold", {
              "bg-green-100 text-green-800":
                row.getValue("deliveryStatus") === "DELIVERED",
              "bg-red-100 text-red-800":
                row.getValue("deliveryStatus") === "FAILED",
              "bg-yellow-100 text-yellow-800":
                row.getValue("deliveryStatus") === "PENDING",
            })}
          >
            {row.getValue("deliveryStatus")}
          </span>
        ),
      },
    ];
  }, [category.name, data?.events]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: data?.events || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((data?.eventsCount || 0) / pagination.pageSize),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });
  if (!pollingData.hasEvents)
    return <EmptyCategoryState categoryName={category.name} />;
  return (
    <div className="space-y-6">
      <Tabs
        value={activeTap}
        onValueChange={(value) =>
          setActiveTap(value as "today" | "month" | "week")
        }
      >
        <TabsList className="mb-2">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTap}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            <Card className="border-2 border-brand-700">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm/6 font-medium">Total Events</p>
                <BarChart className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-2xl font-bold">{data?.eventsCount || 0}</p>
                <p className="text-xs/5 text-muted-foreground">
                  Events{" "}
                  {activeTap === "today"
                    ? "today"
                    : activeTap === "week"
                    ? "this week"
                    : "this month"}
                </p>
              </div>
            </Card>
            <NumericFieldSumCards />
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="w-full flex flex-col gap-4">
            <Heading className="text-3xl text-pretty">Events overview</Heading>
          </div>
        </div>
        {/* Table */}
        <Card contentClassName="px-6 py-4">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isFetching ? (
                [...Array(5)].map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default CategoryPageContent;
