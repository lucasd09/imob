import Navbar from "@/components/client-components/nav-bar";
import Sidebar from "@/components/server-components/side-bar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }: ChildrenProps) {
  const cookieStore = cookies();
  const token = cookieStore.get("imob-token");

  if (!token) {
    redirect("/login");
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex">
        <Sidebar />
        <div className="w-screen">
          <Navbar />
          {children}
        </div>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
