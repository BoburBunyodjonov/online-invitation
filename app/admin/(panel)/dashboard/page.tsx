import { getAdminStats } from "@/lib/server/stats";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function DashboardPage() {
  const stats = await getAdminStats();
  return <AdminDashboard stats={stats} />;
}
