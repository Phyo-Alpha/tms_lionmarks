import { LayoutProps } from "@/client/types/next";
import { redirect } from "next/navigation";
import { getSession } from "../../client/lib/get-session";
export default async function Layout({ children }: LayoutProps) {
  const session = await getSession();
  if (session.data) {
    return redirect("/dashboard");
  }

  return children;
}
