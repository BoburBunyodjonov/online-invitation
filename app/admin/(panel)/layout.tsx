import { redirect } from "next/navigation";
import { auth } from "@/lib/server/auth";
import { AdminShell } from "@/components/admin/AdminShell";

/** Authoritative auth guard for the admin panel (Node runtime, can use Prisma). */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return <AdminShell email={session.user.email ?? ""}>{children}</AdminShell>;
}
