"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data-table";
import { useUserStore } from "@/stores/user-store";
import { DataTableColumnHeader } from "../column-header";
import OwnersEdit from "./owners-edit";
import { useFetch } from "@/hooks/useSWR";

const columns: ColumnDef<OwnerProps>[] = [
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
  {
    id: "actions",
    cell: ({ row }) => {
      const owner = row.original;

      return <OwnersEdit owner={owner} />;
    },
  },
];

export default function OwnersOverview() {
  const user = useUserStore();
  const { data } = useFetch<OwnerProps[]>(`/owners/${user.id}`);

  return (
    <div>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
