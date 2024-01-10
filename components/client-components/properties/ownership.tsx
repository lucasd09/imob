"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "../data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../column-header";
import { useState } from "react";

const columns: ColumnDef<OwnershipProps>[] = [
  {
    accessorKey: "ownerId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID do Proprietário" />
    ),
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "cut",
    header: "Perc(%)",
  },
  {
    accessorKey: "isMainOwner",
    header: "Proprietário principal",
  },
];

async function fetchOwnerships(): Promise<OwnershipProps[]> {
  const ownerships: OwnershipProps[] = [
    { cut: 50, isMainOwner: true, name: "Silvio junior Dalan", ownerId: 1 },
    { cut: 50, isMainOwner: false, name: "dois", ownerId: 2 },
  ];
  return ownerships;
}

export default function Ownership() {
  const [data, setData] = useState<OwnershipProps[] | undefined>([]);
  return (
    <div>
      <div className="flex my-6 items-end">
        <div className="mr-1">
          <Input id="search" type="search" />
        </div>
        <Button
          type="button"
          onClick={async () => {
            setData(await fetchOwnerships());
          }}
        >
          Buscar
        </Button>
      </div>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
