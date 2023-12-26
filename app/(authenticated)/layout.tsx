import Sidebar from "@/components/server-components/side-bar";

export default function AppLayout({ children }: ChildrenProps) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-screen">
        <div className="flex px-14 h-14 items-center justify-end bg-secondary border">
          topbar
        </div>
        {children}
      </div>
    </div>
  );
}
