"use server";
import { ArrowLeft } from "lucide-react";
import React from "react";
import Heading from "../globals/Heading";
import { Button } from "../ui/button";

interface Props {
  title: string;
  children?: React.ReactNode;
  hideBackButton?: boolean;
  cta?: React.ReactNode;
}
async function DashboardPage({ title, children, hideBackButton, cta }: Props) {
  return (
    <section className="flex-1 h-full w-full flex flex-col">
      <div className="w-full p-6 sm:p-8 flex justify-between border-b border-gray-200">
        <div className=" w-full flex flex-col sm:flex-row sm:items-center gap-y-2 gap-x-8">
          <div className="flex flex-wrap items-center gap-2">
            {!hideBackButton && (
              <Button className="w-fit bg-white " variant={"outline"}>
                <ArrowLeft className="size-4" />
              </Button>
            )}
            <Heading>{title}</Heading>
          </div>
          {cta && <div className="w-ful">{cta}</div>}
        </div>
      </div>
      <div className="flex-1 p-6 sm:p-8 flex flex-col overflow-y-auto">
        {children}
      </div>
    </section>
  );
}

export default DashboardPage;
