import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { UserSettingsForm } from "./user-settings-form";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return notFound();
  }

  return (
    <main className="p-5 max-w-screen-lg w-full mx-auto">
      <UserSettingsForm user={user} />
    </main>
  );
}
