"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../column-header";
import Link from "next/link";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { DataTable } from "../data-table";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user-store";
import { getContracts } from "@/services/axios-requests";
import { format } from "date-fns";

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
  },
  {
    accessorKey: "renter",
    header: "Locatário",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");

      switch (status) {
        case "EDITING":
          return <p>Em edição</p>;
        case "ACTIVE":
          return <p>Ativo</p>;
        case "CLOSED":
          return <p>Fechado</p>;
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
  const [data, setData] = useState<ContractProps[] | undefined>([]);

  useEffect(() => {
    async function fetchContracts() {
      try {
        const contracts = await getContracts(user.id);
        setData(contracts);
      } catch (error) {
        console.error("Erro ao buscar dados de Contratos:", error);
      }
    }
    fetchContracts();
  }, [user.id]);

  return (
    <div>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
