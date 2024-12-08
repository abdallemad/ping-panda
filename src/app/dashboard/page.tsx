'use server'
import db from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardPage from "@/components/dashboard/dashboard-page";
import DashboardPageContent from "@/components/dashboard/dashboard-page-content";
async function Dashboard() {
  const auth = await currentUser();
  if (!auth) return redirect("/sing-in");

  const user = await db.user.findUnique({
    where: {
      externalId: auth.id,
    },
  });
  if (!user) return redirect("/sing-in");
  return (
    <DashboardPage cta={<div>hello</div>} title="Dashboard">
      <DashboardPageContent />
    </DashboardPage>
  );
}

export default Dashboard;
