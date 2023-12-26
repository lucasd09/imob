import Navbar from "@/components/server-components/nav-bar";
import Sidebar from "@/components/server-components/side-bar";

export default function AppLayout({ children }: ChildrenProps) {
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
