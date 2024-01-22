"use client";
import { useFetch } from "@/hooks/useSWR";
import { useUserStore } from "@/stores/user-store";
import { DataTable } from "../data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../column-header";
import {
  CheckIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { getOwner } from "@/services/axios-requests";

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
  ownerId: z.coerce.number({ required_error: "Obrigatório" }),
  name: z.string().optional(),
  cut: z.number(),
  isMainOwner: z.boolean(),
});

type form = z.infer<typeof schema>;

export default function PropertiesDetail({
  params,
}: {
  params: { id: number };
}) {
  const user = useUserStore();
  const { data } = useFetch<OwnershipProps[]>(
    `/properties/ownerships/${user.id}/${params.id}`
  );

  const form = useForm<form>({
    resolver: zodResolver(schema),
  });

  const ownership: OwnershipProps[] | undefined = data?.map(
    (item: OwnershipDto) => {
      return {
        ownerId: item.owner?.id,
        name: item.owner?.name,
        cut: item.cut,
        isMainOwner: item.isMainOwner,
      };
    }
  );

  async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      try {
        const owner = await getOwner(user.id, form.getValues("ownerId"));

        if (ownership?.find((owners) => owners.ownerId === owner?.id)) {
          form.setError("ownerId", {
            type: "value",
            message: "Locador já cadastrado",
          });
        } else {
          form.clearErrors("name");
        }
      } catch (error) {}
    }
  }

  async function fetchOwner() {
    try {
      const owner = await getOwner(user.id, form.getValues("ownerId"));

      if (ownership?.find((owners) => owners.ownerId === owner?.id)) {
        form.setError("ownerId", {
          type: "value",
          message: "Locador já cadastrado",
        });
      } else {
        form.clearErrors("name");
      }
    } catch (error) {}
  }

  async function handleForm(data: form) {}

  return (
    <div>
      <Form {...form}>
        <form
          className="max-w-7xl w-fit my-6"
          onSubmit={form.handleSubmit(handleForm)}
        >
          <div className="flex mr-4 items-end">
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem className="w-fit mr-1">
                  <FormLabel>ID do Locador</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Input
                        {...field}
                        onKeyDown={(event) => handleKeyDown(event)}
                      />
                      <Button
                        className="ml-1"
                        type="button"
                        onClick={() => fetchOwner()}
                      >
                        <MagnifyingGlassIcon />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-wrap mt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mr-4">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cut"
              render={({ field }) => (
                <FormItem className=" w-20 mr-4">
                  <FormLabel>Perc(%)</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isMainOwner"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0 pt-6">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Proprietário principal</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      <DataTable columns={columns} data={ownership || []} />
    </div>
  );
}
