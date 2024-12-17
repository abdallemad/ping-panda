import DashboardPage from "@/components/dashboard/dashboard-page";
import db from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import CategoryPageContent from "./category-page-content";

interface Props {
  params: {
    name: string
  };
}
async function Page({ params }: Props) {
  const {name} = await params
  if (!name || typeof name !== "string") return notFound();
  const auth = await currentUser();
  if (!auth) return notFound();
  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  });
  if (!user) return notFound();
  const category = await db.eventCategory.findUnique({
    where: {
      name_userId: {
        name: name,
        userId: user.id,
      },
    },
    include: { _count: { select: { events: true } } },
  });
  if (!category) return notFound();
  const hasEvents = category._count.events > 0;

  return (
    <DashboardPage title={`${category.emoji} ${category.name} Events`}>
      <CategoryPageContent hasEvents={hasEvents} category={category}/>
    </DashboardPage>
  )
}

export default Page;
