"use client";

import dynamic from "next/dynamic";

const RecycleRush = dynamic(() => import("@/components/games/RecycleRush"), {
  ssr: false,
});

export default function RecycleRushPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <RecycleRush />
    </div>
  );
}
