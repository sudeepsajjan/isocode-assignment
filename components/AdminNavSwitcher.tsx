"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CurrentUser, Role } from "@/lib/auth";
import { ChevronDown, Shield, User, FileText } from "lucide-react";

export function AdminNavSwitcher({ currentUser }: { currentUser: CurrentUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function switchRole(role: Role) {
    document.cookie = `company_a_role=${role}; path=/; max-age=86400`;
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span>{currentUser.name}</span>
        <span className="rounded bg-zinc-100 px-1.5 py-0.2 text-[10px] text-zinc-500 uppercase">
          {currentUser.role}
        </span>
        <ChevronDown className="h-3 w-3 text-zinc-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-lg z-50">
          <p className="px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            Switch Staff Role
          </p>
          <button
            onClick={() => switchRole("ADMIN")}
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-left ${
              currentUser.role === "ADMIN" ? "bg-zinc-100 font-semibold" : "hover:bg-zinc-50"
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Admin (Rajan)</span>
          </button>
          <button
            onClick={() => switchRole("CONSULTANT")}
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-left ${
              currentUser.role === "CONSULTANT" ? "bg-zinc-100 font-semibold" : "hover:bg-zinc-50"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Consultant (Chandran)</span>
          </button>
          <button
            onClick={() => switchRole("CONTENT")}
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-left ${
              currentUser.role === "CONTENT" ? "bg-zinc-100 font-semibold" : "hover:bg-zinc-50"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Content Writer (Leela)</span>
          </button>
        </div>
      )}
    </div>
  );
}

