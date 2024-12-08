"use client";
import { SignIn } from "@clerk/nextjs";
import React from "react";

function Page() {
  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <SignIn path="/sing-in" routing="path" afterSignInUrl="/welcome" />
    </div>
  );
}

export default Page;
