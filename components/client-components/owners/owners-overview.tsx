"use client";
import { getOwners } from "@/services/axios-requests";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data-table";
import { useUserStore } from "@/stores/user-store";
import { useEffect, useState } from "react";

const columns: ColumnDef<OwnerProps>[] = [
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

export default function OwnersOverview() {
  const user = useUserStore();
  const [data, setData] = useState<OwnerProps[] | undefined>([]);

  useEffect(() => {
    async function fetchOwners() {
      try {
        const owners = await getOwners(user.id);
        setData(owners);
      } catch (error) {
        console.error("Erro ao buscar dados de Locadores:", error);
      }
    }
    fetchOwners();
  }, [user.id]);
  return (
    <div>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
