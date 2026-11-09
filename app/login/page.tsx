"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, User, FileText, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function setRoleCookieAndRedirect(role: "ADMIN" | "CONSULTANT" | "CONTENT") {
    document.cookie = `company_a_role=${role}; path=/; max-age=86400`;
    router.push("/admin/inbox");
    router.refresh();
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email === "admin" && password === "admin@123") {
      setRoleCookieAndRedirect("ADMIN");
    } else if (email === "consultant" && password === "consultant@123") {
      setRoleCookieAndRedirect("CONSULTANT");
    } else if (email === "content" && password === "content@123") {
      setRoleCookieAndRedirect("CONTENT");
    } else {
      setError("Invalid username or password. You can also use the 1-click role buttons below.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <Link href="/" className="text-xs font-semibold tracking-wider uppercase text-zinc-400 hover:text-zinc-900">
            ← Back to Public Site
          </Link>
          <h1 className="mt-4 text-2xl font-normal tracking-tight text-zinc-950">
            Company A Workspace
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Staff access for packages, enquiries, and quotes
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-2.5 text-center text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700">Username</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin, consultant, or content"
              className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-950 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-800"
          >
            Sign in
          </button>
        </form>

        <div className="mt-8 border-t border-zinc-100 pt-6">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            Or test with 1-click role preview:
          </p>
          <div className="mt-3 space-y-2">
            <button
              onClick={() => setRoleCookieAndRedirect("ADMIN")}
              className="flex w-full items-center justify-between rounded-lg border border-zinc-200 p-2.5 text-left text-xs font-medium text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50 transition-all"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-zinc-950" />
                <div>
                  <p className="font-semibold text-zinc-900">Admin (Rajan)</p>
                  <p className="text-[10px] text-zinc-400">Full control, pricing, rollback</p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
            </button>

            <button
              onClick={() => setRoleCookieAndRedirect("CONSULTANT")}
              className="flex w-full items-center justify-between rounded-lg border border-zinc-200 p-2.5 text-left text-xs font-medium text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50 transition-all"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-zinc-950" />
                <div>
                  <p className="font-semibold text-zinc-900">Consultant (Chandran)</p>
                  <p className="text-[10px] text-zinc-400">Enquiry triage, AI quotes, statuses</p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
            </button>

            <button
              onClick={() => setRoleCookieAndRedirect("CONTENT")}
              className="flex w-full items-center justify-between rounded-lg border border-zinc-200 p-2.5 text-left text-xs font-medium text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50 transition-all"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-zinc-950" />
                <div>
                  <p className="font-semibold text-zinc-900">Content Writer (Leela)</p>
                  <p className="text-[10px] text-zinc-400">Draft itineraries, packages, blogs</p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

