import Link from "next/link";
import {
  DashboardIcon,
  HomeIcon,
  FileTextIcon,
  BackpackIcon,
  ClipboardIcon,
  PersonIcon,
  AvatarIcon,
} from "@radix-ui/react-icons";

export default function Sidebar() {
  return (
    <div className="flex flex-col select-none py-14 items-start w-14 h-screen bg-secondary dark:bg-transparent overflow-clip border transition-width duration-300 hover:w-44">
      <Link href={"/dashboard"} className="flex h-14 items-center ">
        <DashboardIcon className="h-6 w-6 mx-[13px]" />
        <p className="text-sm m-1">Dashboard</p>
      </Link>
      <Link href={"/contracts"} className="flex h-14 items-center ">
        <BackpackIcon className="h-6 w-6 mx-[13px]" />
        <p className="text-sm m-1">Contratos</p>
      </Link>
      <Link href={"/finance"} className="flex h-14 items-center ">
        <FileTextIcon className="h-6 w-6 mx-[13px]" />
        <p className="text-sm m-1">Financeiro</p>
      </Link>
      <Link href={"/properties"} className="flex h-14 items-center ">
        <HomeIcon className="h-6 w-6 mx-[13px]" />
        <p className="text-sm m-1">Imóveis</p>
      </Link>
      <Link href={"/owners"} className="flex h-14 items-center ">
        <AvatarIcon className="h-6 w-6 mx-[13px]" />
        <p className="text-sm m-1">Locadores</p>
      </Link>
      <Link href={"/renters"} className="flex h-14 items-center ">
        <PersonIcon className="h-6 w-6 mx-[13px]" />
        <p className="text-sm m-1">Locatários</p>
      </Link>
      <Link href={"/reports"} className="flex h-14 items-center ">
        <ClipboardIcon className="h-6 w-6 mx-[13px]" />
        <p className="text-sm m-1">Relatórios</p>
      </Link>
    </div>
  );
}
