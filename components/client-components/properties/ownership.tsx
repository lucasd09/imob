"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "../data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../column-header";
import { useState } from "react";
import { getOwnerships } from "@/services/axios-requests";
import { useUserStore } from "@/stores/user-store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  CheckIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";

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
    cell: ({ row }) => {
      const mainOwner = row.getValue("isMainOwner");

      if (mainOwner) {
        return <CheckIcon />;
      } else {
        return <Cross2Icon />;
      }
    },
  },
];

const schema = z.object({
  propertyId: z.coerce.number().gte(1, "Insira um código válido"),
});

type form = z.infer<typeof schema>;

export default function Ownership() {
  const user = useUserStore();
  const [data, setData] = useState<OwnershipProps[] | undefined>([]);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<form>({
    resolver: zodResolver(schema),
  });

  async function fetchOwnerships() {
    const form = getValues();
    const ownerships = await getOwnerships(user.id, form.propertyId);
    return ownerships;
  }

  async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      setData(await fetchOwnerships());
    }
  }

  async function handleForm(data: form) {}
  return (
    <div>
      <form onSubmit={handleSubmit(handleForm)}>
        <div className="my-6">
          <div className="flex items-end">
            <div className="mr-1">
              <Label htmlFor="search">ID do imóvel</Label>
              <Input
                id="search"
                type="search"
                {...register("propertyId")}
                onKeyDown={(event) => handleKeyDown(event)}
              />
            </div>
            <Button
              className="mr-1"
              onClick={async () => {
                setData(await fetchOwnerships());
              }}
            >
              <MagnifyingGlassIcon />
            </Button>
          </div>
          <p className="text-red-500 text-sm">{errors.propertyId?.message}</p>
        </div>
        <div className="flex flex-wrap"></div>
        <DataTable columns={columns} data={data || []} />
      </form>
    </div>
  );
}
