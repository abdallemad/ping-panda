"use client";
import { SignUp } from "@clerk/nextjs";
import React from "react";

function Page() {
  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <SignUp path="/sing-up" routing="path" afterSignInUrl="/welcome" />
    </div>
  );
}

export default Page;
