"use client";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { pollCategory } from "./action";
import { Card } from "@/components/ui/card";
import { Prism as SyntaxHeighLighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function EmptyCategoryState({ categoryName }: { categoryName: string }) {
  const { data } = useQuery({
    queryKey: ["category", categoryName, "hasEvents"],
    queryFn: async () => await pollCategory(categoryName),
    refetchInterval(query) {
      return query.state.data?.hasEvents ? false : 1000;
    },
  });
  const router = useRouter();
  const hasEvents = data?.hasEvents;
  useEffect(() => {
    if (hasEvents) router.refresh();
  }, [hasEvents, router]);
  const codeSnip = `await fetch('https://localhost:3000/api/events', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    category: '${categoryName}',
    fields: {
      field1: 'value1', // for example: user id
      field2: 'value2' // for example: user email
    }
  })
})`;
  return (
    <Card
      contentClassName="max-w-2xl w-full flex flex-col items-center p-6"
      className="flex-1 flex items-center justify-center"
    >
      <h2 className="text-xl/8 font-medium text-center tracking-tight text-gray-950">
        Create your first {categoryName}
      </h2>
      <p className="text-sm/6 text-gray-600 mb-8 max-w-md text-center text-pretty">
        Get started by sending a request to our API:
      </p>
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
          <div className="space-x-2 flex">
            <div className="size-3 rounded-full bg-red-500" />
            <div className="size-3 rounded-full bg-yellow-500" />
            <div className="size-3 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-400 text-sm">your-first-event.js</span>
        </div>
        <SyntaxHeighLighter
          language="javascript"
          style={oneDark}
          customStyle={{
            borderRadius: "0px",
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.5rem",
          }}
        >
          {codeSnip}
        </SyntaxHeighLighter>
      </div>
      <div className="mt-8 flex flex-col items-center space-x-2">
        <div className="flex gap-2 items-center ">
          <div className=" size-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600">
            listening to incoming events..
          </span>
        </div>
        <p className="text-sm/6 text-gray-600 mr-2">
          Need help? Check our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            documentation
          </a>{" "}
          or{" "}
          <a href="#" className="text-blue-600 hover:underline">
            contact support
          </a>
        </p>
      </div>
    </Card>
  );
}

export default EmptyCategoryState;
