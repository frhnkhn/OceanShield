import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6">
        <h1 className="text-6xl font-extrabold text-cyan-400">
          OceanShield AI
        </h1>

        <p className="mt-6 max-w-2xl text-center text-xl text-slate-300">
          AI-Powered Coastal Disaster Intelligence Platform for Smart India Hackathon 2026.
        </p>

        <div className="mt-10 flex gap-4">
          <Link href="/report" className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400">
            Report Hazard
          </Link>

          <Link href="/map" className="rounded-xl border border-cyan-500 px-6 py-3 font-semibold hover:bg-cyan-500 hover:text-black">
            Live Dashboard
          </Link>
        </div>
      </main>
    </>
  );
}
