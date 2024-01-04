"use client";
import { getRenters } from "@/services/axios-requests";
import { useUserStore } from "@/stores/user-store";
import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

const columns: ColumnDef<RenterProps>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
