import db from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardPage from "@/components/dashboard/dashboard-page";
import DashboardPageContent from "@/components/dashboard/dashboard-page-content";
import CreateEventCategoryModal from "@/components/dashboard/create-event-category-modal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { createCheckoutSession } from "@/lib/stripe";
import PaymentSuccessModal from "@/components/payment-success-modal";
interface DashboardProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}
async function Dashboard({ searchParams }: DashboardProps) {
  const auth = await currentUser();
  if (!auth) return redirect("/sing-in");

  const user = await db.user.findUnique({
    where: {
      externalId: auth.id,
    },
  });
  if (!user) return redirect("/sing-in");
  const intent = searchParams?.intent || "";
  if (intent === "upgrade") {
    const session = await createCheckoutSession({
      userEmail: user.email,
      userId: user.id,
    });
    return redirect(session.url!);
  }
  const success = searchParams?.success || false;
  return (
    <>
    {
      success && (
        <PaymentSuccessModal />
      )
    }
      <DashboardPage
        cta={
          <CreateEventCategoryModal>
            <Button className="w-full">
              <PlusIcon className="size-4 mr-2" />
              Add Category
            </Button>
          </CreateEventCategoryModal>
        }
        title="Dashboard"
      >
        <DashboardPageContent />
      </DashboardPage>
    </>
  );
}

export default Dashboard;
