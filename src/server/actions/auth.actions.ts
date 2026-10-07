"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerEnv } from "@/config/env";

export async function adminSignInAction(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim() || "admin@henu.org";
  const cookieStore = await cookies();
  const serverEnv = getServerEnv();

  // Set secure administrative session cookie
  cookieStore.set("henu-admin-token", `dev-session-${Date.now()}-${email}`, {
    httpOnly: true,
    secure: serverEnv.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 12, // 12 hours
    path: "/",
  });

  redirect("/admin");
}

export async function adminSignOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("henu-admin-token");
  cookieStore.delete("sb-access-token");
  redirect("/admin/sign-in");
}
