import Navbar from "@/components/client-components/nav-bar";
import Sidebar from "@/components/server-components/side-bar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AppLayout({ children }: ChildrenProps) {
  const cookieStore = cookies();
  const token = cookieStore.get("imob-token");

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-screen">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
