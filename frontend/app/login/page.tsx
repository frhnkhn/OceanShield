"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/firebaseAuth";
import { User, Shield, Heart } from "lucide-react";

type UserRole = "citizen" | "govt" | "volunteer";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("citizen");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      await loginUser(email, password);

      // Save role choice to localStorage for role-based dashboard views
      localStorage.setItem("user_role", role);

      router.push("/dashboard");

    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Unable to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white border border-slate-200 p-8 shadow-sm">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            OceanShield Portal
          </h1>
          <p className="text-slate-500 text-xs mt-1.5 leading-normal">
            Coastal disaster monitoring and emergency operations command
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-6">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole("citizen")}
              className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-all ${
                role === "citizen"
                  ? "border-blue-900 bg-blue-50 text-blue-900 font-bold"
                  : "border-slate-250 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <User className="h-5 w-5 mb-1 text-slate-500" />
              <span className="text-[10px] font-bold">Citizen</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("govt")}
              className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-all ${
                role === "govt"
                  ? "border-blue-900 bg-blue-50 text-blue-900 font-bold"
                  : "border-slate-250 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Shield className="h-5 w-5 mb-1 text-slate-500" />
              <span className="text-[10px] font-bold">Govt Official</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("volunteer")}
              className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-all ${
                role === "volunteer"
                  ? "border-blue-900 bg-blue-50 text-blue-900 font-bold"
                  : "border-slate-250 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Heart className="h-5 w-5 mb-1 text-slate-500" />
              <span className="text-[10px] font-bold">Volunteer</span>
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder={role === "govt" ? "officer@oceanshield.gov" : "email@domain.com"}
              className="w-full rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded bg-blue-900 hover:bg-blue-800 py-3 font-semibold text-white transition-colors text-sm"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

      </div>
    </main>
  );
}
