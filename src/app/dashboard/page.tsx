import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !session.user) {
    redirect("/");
  }
  return <DashboardClient name={session.user?.name} id={session.user?.id} />;
}
