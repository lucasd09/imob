"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../column-header";
import Link from "next/link";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  OpenInNewWindowIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { DataTable } from "../data-table";
import { useUserStore } from "@/stores/user-store";
import { format } from "date-fns";
import { useFetch } from "@/hooks/useSWR";

const columns: ColumnDef<ContractProps>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "property",
    header: "imóvel",
    cell: ({ row }) => {
      const contract: PropertiesProps = row.getValue("property");

      return contract.address + ", " + contract.number;
    },
  },
  {
    accessorKey: "renter",
    header: "Locatário",
    cell: ({ row }) => {
      const renter: RenterProps = row.getValue("renter");

      return renter.name;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");

      switch (status) {
        case "EDITING":
          return (
            <div>
              <p>Em edição</p>
            </div>
          );
        case "ACTIVE":
          return (
            <div className="text-emerald-700 font-medium flex items-center space-x-1">
              <CheckCircledIcon />
              <p>Ativo</p>
            </div>
          );
        case "CLOSED":
          return (
            <div className="text-red-600 font-medium flex items-center space-x-1">
              <CrossCircledIcon />
              <p>Fechado</p>
            </div>
          );
      }
    },
  },
  {
    accessorKey: "startDate",
    header: "Data de Início",
    cell: ({ row }) => {
      const date = format(new Date(row.getValue("startDate")), "dd/MM/yyyy");

      return <p>{date}</p>;
    },
  },
  {
    accessorKey: "endDate",
    header: "Data de Término",
    cell: ({ row }) => {
      const date = format(new Date(row.getValue("endDate")), "dd/MM/yyyy");

      return <p>{date}</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.getValue("id");
      return (
        <Link href={`/contracts/${id}`}>
          <Button variant="outline" className="h-8 w-8 p-0">
            <OpenInNewWindowIcon className="h-4 w-4" />
          </Button>
        </Link>
      );
    },
  },
];

export default function ContractsOverview() {
  const user = useUserStore();
  const { data } = useFetch<ContractProps[]>(`/contracts/${user.id}`);

  return (
    <div>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
