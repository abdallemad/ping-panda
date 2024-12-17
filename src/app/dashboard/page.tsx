import db from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardPage from "@/components/dashboard/dashboard-page";
import DashboardPageContent from "@/components/dashboard/dashboard-page-content";
import CreateEventCategoryModal from "@/components/dashboard/create-event-category-modal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
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
    <DashboardPage
      cta={
        <CreateEventCategoryModal>
          <Button className="w-full">
            <PlusIcon className="size-4 mr-2"/>
            Add Category
          </Button>
        </CreateEventCategoryModal>
      }
      title="Dashboard"
    >
      <DashboardPageContent />
    </DashboardPage>
  );
}

export default Dashboard;
