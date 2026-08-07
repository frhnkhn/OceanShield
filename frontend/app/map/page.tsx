"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";

const MapView = dynamic(
  () => import("@/components/map/MapView"),
  {
    ssr: false,
  }
);

export default function MapPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen"><MapView /></main>
    </>
  );
}
