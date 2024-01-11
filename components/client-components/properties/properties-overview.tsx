"use client";
import { getProperties } from "@/services/axios-requests";
import { useUserStore } from "@/stores/user-store";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTable } from "../data-table";
import { DataTableColumnHeader } from "../column-header";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import PropertiesEdit from "./properties-edit";

const columns: ColumnDef<PropertiesProps>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
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
    accessorKey: "complement",
    header: "Complemento",
  },
  {
    accessorKey: "city",
    header: "Cidade",
  },
  {
    accessorKey: "uf",
    header: "Estado",
  },
  {
    accessorKey: "avaliable",
    header: "Disponível",
    cell: ({ row }) => {
      const avaliable = row.getValue("avaliable");

      if (avaliable) {
        return <CheckIcon />;
      } else {
        return <Cross2Icon />;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const property = row.original;

      return <PropertiesEdit property={property} />;
    },
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
