"use client";

import dynamic from "next/dynamic";

const MapWithArenas = dynamic(() => import("./map-inner"), {
  ssr: false,
});

export default function MapClientWrapper() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-md">
      <MapWithArenas />
    </div>
  );
}
