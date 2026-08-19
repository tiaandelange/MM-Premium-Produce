import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import { paths } from "@/lib/routes";

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session || session.role !== "admin") {
    redirect(paths.adminLogin);
  }
  return session;
}
