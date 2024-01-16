"use client";
import { useUserStore } from "@/stores/user-store";
import { DataTable } from "../data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../column-header";
import RentersEdit from "./renters-edit";
import { useFetch } from "@/hooks/useSWR";

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
  {
    id: "actions",
    cell: ({ row }) => {
      const renter = row.original;

      return <RentersEdit renter={renter} />;
    },
  },
];

export default function RentersOverview() {
  const user = useUserStore();
  const { data } = useFetch<RenterProps[]>(`/renters/${user.id}`);

  return (
    <div>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
