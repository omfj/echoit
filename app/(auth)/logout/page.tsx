import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { LogoutBox } from "./logout-box";

export default async function LoginPage() {
  const session = await getSession();

  if (!session) {
    return redirect("/");
  }

  return <LogoutBox />;
}
