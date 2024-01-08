"use client";
import { getProperties } from "@/services/axios-requests";
import { useUserStore } from "@/stores/user-store";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTable } from "../data-table";

const columns: ColumnDef<PropertiesProps>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "address",
    header: "Endereço",
  },
  {
    accessorKey: "number",
    header: "Número",
  },
  {
    accessorKey: "avaliable",
    header: "Disponível",
  },
];

export default function PropertiesOverview() {
  const user = useUserStore();
  const [data, setData] = useState<PropertiesProps[] | undefined>([]);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const properties = await getProperties(user.id);
        setData(properties);
      } catch (error) {
        console.error("Erro ao buscar dados de Imóveis:", error);
      }
    }
    fetchProperties();
  }, [user.id]);

  return (
    <div>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
