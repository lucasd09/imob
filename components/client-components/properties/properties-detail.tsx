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
  TrashIcon,
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
import {
  addOwnership,
  deleteOwnership,
  getOwner,
} from "@/services/axios-requests";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0">
              <TrashIcon className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmação</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação irá apagar o proprietário da lista de proprietários
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (await deleteOwnership(id!)) {
                    return toast("Sucesso", {
                      description: "Proprietário removido com êxito.",
                    });
                  }
                }}
              >
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];

const schema = z.object({
  ownerId: z.coerce
    .number({ required_error: "Obrigatório" })
    .gt(0, "Insira um ID válido"),
  name: z.string().optional(),
  cut: z.coerce
    .number({ required_error: "Obrigatório" })
    .gt(0, "Insira um percentual válido"),
  isMainOwner: z.boolean().optional(),
});

type form = z.infer<typeof schema>;

export default function PropertiesDetail({
  params,
}: {
  params: { id: string };
}) {
  const user = useUserStore();
  const { data, mutate } = useFetch<OwnershipProps[]>(
    `/properties/ownerships/${user.id}/${params.id}`
  );

  const form = useForm<form>({
    resolver: zodResolver(schema),
    defaultValues: { isMainOwner: false },
  });

  const ownership: OwnershipProps[] | undefined = data?.map(
    (item: OwnershipDto) => {
      return {
        id: item.id,
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
          form.setValue("name", "");
        } else {
          form.clearErrors("ownerId");
          form.setValue("name", owner?.name);
        }
      } catch (error) {}
    }
  }

  async function fetchOwner() {
    const { ownerId } = form.getValues();
    try {
      const owner = await getOwner(user.id, ownerId);

      if (ownership?.find((owners) => owners.ownerId === owner?.id)) {
        form.setError("ownerId", {
          type: "value",
          message: "Locador já inserido",
        });
        form.setValue("name", "");
      } else {
        form.clearErrors("ownerId");
        form.setValue("name", owner?.name);
      }
    } catch (error) {}
  }

  async function handleForm(formData: form) {
    const owner = await addOwnership([
      {
        cut: formData.cut,
        isMainOwner: formData.isMainOwner,
        userId: user.id,
        propertyId: parseInt(params.id),
        ownerId: formData.ownerId,
      },
    ]);

    if (owner) {
      mutate();
      form.reset();
      return toast("Sucesso", {
        description: "Proprietário adicionado com êxito.",
      });
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          className="max-w-7xl min-w-[530px] w-fit my-6"
          onSubmit={form.handleSubmit(handleForm)}
        >
          <div className="flex items-end flex-wrap">
            <FormField
              control={form.control}
              name="ownerId"
              defaultValue={0}
              render={({ field }) => (
                <FormItem className=" w-fit mr-2">
                  <FormLabel>ID do Locador</FormLabel>
                  <FormControl>
                    <div className="flex space-x-1">
                      <Input
                        {...field}
                        type="search"
                        onKeyDown={(event) => handleKeyDown(event)}
                      />
                      <Button
                        onClick={async () => await fetchOwner()}
                        type="button"
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
              defaultValue=""
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
              defaultValue={0}
              render={({ field }) => (
                <FormItem className=" w-20 mr-4">
                  <FormLabel>Perc(%)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isMainOwner"
              render={({ field }) => (
                <FormItem className="space-x-2 space-y-0 pt-2">
                  <FormControl>
                    <div className="flex items-center space-x-2 space-y-0 pt-6">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FormLabel>Proprietário principal</FormLabel>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex mt-4 justify-end">
            <Button
              type="reset"
              variant={"outline"}
              className="mr-4"
              onClick={() => form.reset()}
            >
              Limpar
            </Button>
            <Button>Salvar</Button>
          </div>
        </form>
      </Form>
      <div className="max-w-7xl">
        <DataTable columns={columns} data={ownership || []} />
      </div>
    </div>
  );
}
