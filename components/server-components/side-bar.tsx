import Link from "next/link";
import { Button } from "../ui/button";

export default function Sidebar() {
  return (
    <div className="flex flex-col py-14 items-start w-14 h-screen bg-secondary border transition-width duration-300 hover:w-44 overflow-hidden">
      <Link href={"/dashboard"}>
        <Button variant={"link"}>
          <p>Dashboard</p>
        </Button>
      </Link>
      <Link href={"/owners"}>owners</Link>
    </div>
  );
}
