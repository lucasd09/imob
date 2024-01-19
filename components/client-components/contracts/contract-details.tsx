"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/stores/user-store";
import {
  CheckIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { DataTable } from "../data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../column-header";
import { useToast } from "@/components/ui/use-toast";
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
import { useFetch } from "@/hooks/useSWR";
import { format } from "date-fns";

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
  value: z.coerce.number().gte(1, "Valor Inválido"),
  startDate: z.string().refine(
    (value) => {
      return !isNaN(Date.parse(value));
    },
    {
      message: "Data de Início inválida.",
    }
  ),
  endDate: z.string().refine(
    (value) => {
      return !isNaN(Date.parse(value));
    },
    {
      message: "Data de Término inválida.",
    }
  ),
  dueDate: z.string().refine(
    (value) => {
      return !isNaN(Date.parse(value));
    },
    {
      message: "Data de Cobrança inválida.",
    }
  ),
  propertyId: z.coerce.number().gte(1, "Código Inválido"),
  address: z.string(),
  number: z.coerce.number(),
  complement: z.string(),
  district: z.string(),
  city: z.string(),
  uf: z.string(),
  renterId: z.coerce.number().gte(1, "Código Inválido"),
  renterName: z.string(),
  renterEmail: z.string(),
  renterPhone: z.string(),
});

type form = z.infer<typeof schema>;

export default function ContractDetails({
  params,
}: {
  params: { id: number };
}) {
  const user = useUserStore();
  const { toast } = useToast();
  const { data } = useFetch<ContractDetail>(
    `/contracts/${user.id}/${params.id}`
  );
  const form = useForm<form>({
    resolver: zodResolver(schema),
    defaultValues: {
      value: data?.value,
    },
  });

  const ownership: OwnershipProps[] | undefined = data?.property.ownership?.map(
    (item: OwnershipDto) => {
      return {
        ownerId: item.owner?.id,
        name: item.owner?.name,
        cut: item.cut,
        isMainOwner: item.isMainOwner,
      };
    }
  );

  async function handleForm(formData: form) {
    return toast({
      title: "Sucesso",
      description: "Contrato atualizado com êxito.",
    });
  }

  return (
    <Form {...form}>
      <form
        className="max-w-7xl w-fit mt-6"
        onSubmit={form.handleSubmit(handleForm)}
      >
        <Label className="text-lg">Dados básicos</Label>
        <div className="flex my-4">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="w-fit mr-4">
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input {...field} className="text-right" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="w-fit mr-4">
                <FormLabel>Data de início</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="w-fit mr-4">
                <FormLabel>Data de Término</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="w-fit mr-4">
                <FormLabel>Início da Cobrança</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" onClick={() => console.log(data)}>
            Salvar
          </Button>
        </div>
        <Label className="text-lg">Dados do Imóvel</Label>
        <div className="flex my-4">
          <div>
            <div className="flex mr-4 items-end">
              <FormField
                control={form.control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem className="w-fit mr-1">
                    <FormLabel>ID do Imóvel</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button">
                <MagnifyingGlassIcon />
              </Button>
            </div>
          </div>
          <div className="flex">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="w-fit mr-1">
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem className="w-20 mr-4">
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="complement"
            render={({ field }) => (
              <FormItem className="w-fit mr-4">
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem className="w-fit mr-4">
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="w-fit mr-4">
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="uf"
            render={({ field }) => (
              <FormItem className="w-fit mr-4">
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Label className="text-lg">Dados do Locatário</Label>
        <div className="flex my-4">
          <div>
            <div className="flex mr-4 items-end">
              <FormField
                control={form.control}
                name="renterId"
                render={({ field }) => (
                  <FormItem className="w-fit mr-1">
                    <FormLabel>ID do Locatário</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button">
                <MagnifyingGlassIcon />
              </Button>
            </div>
          </div>
          <div className="flex">
            <FormField
              control={form.control}
              name="renterName"
              render={({ field }) => (
                <FormItem className="w-fit mr-4">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="renterEmail"
              render={({ field }) => (
                <FormItem className="w-fit mr-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="renterPhone"
              render={({ field }) => (
                <FormItem className="w-fit mr-4">
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Label className="text-lg">Dados dos Locadores</Label>
        <DataTable columns={columns} data={ownership || []} />
      </form>
    </Form>
  );
}
