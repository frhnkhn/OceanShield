import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-6xl font-black text-blue-900 tracking-tight text-center">
          OceanShield
        </h1>

        <p className="mt-4 max-w-2xl text-center text-slate-700 text-lg font-medium leading-relaxed">
          Unified Coastal Disaster Management & Real-time GIS Response Platform.
        </p>

        <div className="mt-8 flex gap-4">
          <Link href="/report" className="rounded bg-red-650 px-6 py-3 font-semibold text-white hover:bg-red-700 shadow-sm transition-all">
            Report Hazard
          </Link>

          <Link href="/dashboard" className="rounded border border-blue-900 px-6 py-3 font-semibold text-blue-900 hover:bg-blue-50 transition-all">
            Live Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
