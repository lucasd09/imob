"use client";
import { getRenters } from "@/services/axios-requests";
import { useUserStore } from "@/stores/user-store";
import { DataTable } from "../data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTableColumnHeader } from "../column-header";

const columns: ColumnDef<RenterProps>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Telefone",
  },
  {
    accessorKey: "pessoa",
    header: "Pessoa",
    cell: ({ row }) => {
      const pessoa = row.getValue("pessoa");

      if (pessoa === "FISICA") {
        return <div>Física</div>;
      } else {
        return <div>Jurídica</div>;
      }
    },
  },
];

export default function RentersOverview() {
  const user = useUserStore();
  const [data, setData] = useState<RenterProps[] | undefined>([]);

  useEffect(() => {
    async function fetchRenters() {
      try {
        const renters = await getRenters(user.id);
        setData(renters);
      } catch (error) {
        console.error("Erro ao buscar dados de locatários:", error);
      }
    }
    fetchRenters();
  }, [user.id]);

  return (
    <div>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
