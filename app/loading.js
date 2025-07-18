// app/loading.js
"use client";

import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <Loader className="w-6 h-6 text-white animate-spin" />
    </div>
  );
}
