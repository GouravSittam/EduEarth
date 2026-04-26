"use client";

import dynamic from "next/dynamic";

const EcoStrike = dynamic(() => import("@/components/games/EcoStrike"), {
  ssr: false,
});

export default function EcoStrikePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <EcoStrike />
    </div>
  );
}
