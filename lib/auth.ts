import { cookies } from "next/headers";
import { db } from "./db";

export type Role = "ADMIN" | "CONSULTANT" | "CONTENT";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const cookieStore = cookies();
  const roleCookie = cookieStore.get("company_a_role")?.value as Role | undefined;
  const activeRole: Role = roleCookie && ["ADMIN", "CONSULTANT", "CONTENT"].includes(roleCookie) ? roleCookie : "ADMIN";

  const user = await db.user.findFirst({
    where: { role: activeRole },
  });

  if (user) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
    };
  }

  return {
    id: "default-admin",
    email: "admin@isocode.com",
    name: "Rajan (Founder & MD)",
    role: "ADMIN",
  };
}

