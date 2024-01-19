"use client";
import { useUserStore } from "@/stores/user-store";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data-table";
import { DataTableColumnHeader } from "../column-header";
import {
  CheckIcon,
  Cross2Icon,
  OpenInNewWindowIcon,
} from "@radix-ui/react-icons";
import PropertiesEdit from "./properties-edit";
import { useFetch } from "@/hooks/useSWR";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

      return (
        <div className="space-x-1">
          <PropertiesEdit property={property} />
          <Link href={`/properties/${property.id}`}>
            <Button variant="outline" className="h-8 w-8 p-0">
              <OpenInNewWindowIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export default function PropertiesOverview() {
  const user = useUserStore();
  const { data } = useFetch<PropertiesProps[]>(`/properties/${user.id}`);

  return (
    <div>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
