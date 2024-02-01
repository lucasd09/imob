"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/stores/user-store";
import {
  CheckIcon,
  Cross2Icon,
  CrossCircledIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { DataTable } from "../data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../column-header";
import { toast } from "sonner";
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
import {
  getProperty,
  getRenter,
  updateContract,
} from "@/services/axios-requests";
import ContractActivation from "./contract-activation";
import ContractClosing from "./contract-close";
import { useMemo } from "react";

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
  value: z.coerce.number(),
  startDate: z
    .string()
    .refine(
      (value) => {
        return !isNaN(Date.parse(value));
      },
      {
        message: "Data de Início inválida.",
      }
    )
    .optional(),
  endDate: z
    .string()
    .refine(
      (value) => {
        return !isNaN(Date.parse(value));
      },
      {
        message: "Data de Término inválida.",
      }
    )
    .optional(),
  dueDate: z
    .string()
    .refine(
      (value) => {
        return !isNaN(Date.parse(value));
      },
      {
        message: "Data de Cobrança inválida.",
      }
    )
    .optional(),
  propertyId: z.coerce.number().gte(1, "Código Inválido"),
  address: z.string().optional(),
  number: z.coerce.number().optional(),
  complement: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  uf: z.string().optional(),
  renterId: z.coerce.number().gte(1, "Código Inválido"),
  renterName: z.string().optional(),
  renterEmail: z.string().optional(),
  renterPhone: z.string().optional(),
});

type form = z.infer<typeof schema>;

export default function ContractDetails({
  contractId,
}: {
  contractId: number;
}) {
  const user = useUserStore();
  const { data, mutate } = useFetch<ContractDetail>(
    `/contracts/${user.id}/${contractId}`
  );

  const form = useForm<form>({
    resolver: zodResolver(schema),
    defaultValues: {
      value: 0,
      startDate: "",
      endDate: "",
      dueDate: "",
      propertyId: 0,
      address: "",
      number: 0,
      complement: "",
      district: "",
      city: "",
      uf: "",
      renterId: 0,
      renterName: "",
      renterEmail: "",
      renterPhone: "",
    },
    values: {
      value: data?.value || 0,
      startDate: data?.startDate
        ? format(new Date(data.startDate), "yyyy-MM-dd")
        : "",
      endDate: data?.endDate
        ? format(new Date(data.endDate), "yyyy-MM-dd")
        : "",
      dueDate: data?.dueDate
        ? format(new Date(data.dueDate), "yyyy-MM-dd")
        : "",
      propertyId: data?.property.id || 0,
      address: data?.property.address,
      number: data?.property.number,
      complement: data?.property.complement,
      district: data?.property.district,
      city: data?.property.city,
      uf: data?.property.uf,
      renterId: data?.renter.id || 0,
      renterName: data?.renter.name,
      renterEmail: data?.renter.email,
      renterPhone: data?.renter.phone,
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
    const dirtyFields = form.formState.dirtyFields;
    const updatedValues: ContractUpdateDto = {};

    if (dirtyFields.propertyId) {
      updatedValues.propertyId = formData.propertyId;
    }
    if (dirtyFields.renterId) {
      updatedValues.renterId = formData.renterId;
    }
    if (dirtyFields.value) {
      updatedValues.value = formData.value;
    }

    try {
      await updateContract(user.id, contractId, updatedValues);

      mutate();

      return toast("Sucesso", {
        description: "Contrato atualizado com êxito.",
      });
    } catch (error) {
      return toast("Erro", {
        description:
          "ID do Imóvel ou do locatário não foi encontrado, verifique.",
      });
    }
  }

  async function fetchProperty() {
    const { propertyId } = form.getValues();

    const property = await getProperty(user.id, propertyId);

    form.setValue("address", property?.address);
    form.setValue("number", property?.number);
    form.setValue("complement", property?.complement);
    form.setValue("district", property?.district);
    form.setValue("city", property?.city);
    form.setValue("uf", property?.uf);
  }
  async function fetchRenter() {
    const { renterId } = form.getValues();

    const renter = await getRenter(user.id, renterId);

    form.setValue("renterName", renter?.name);
    form.setValue("renterEmail", renter?.email);
    form.setValue("renterPhone", renter?.phone);
  }

  type status = "EDITING" | "ACTIVE" | "CLOSED";

  const statusRender = useMemo<{ [key in status]: JSX.Element }>(
    () => ({
      EDITING: (
        <ContractActivation
          disabled={form.formState.isDirty}
          data={data}
          contractId={contractId}
        />
      ),
      ACTIVE: <ContractClosing contractId={contractId} />,
      CLOSED: (
        <div className="text-red-600 font-medium flex items-center space-x-1 bg-red-100 rounded w-fit px-2">
          <CrossCircledIcon />
          <p>Contrato encerrado</p>
        </div>
      ),
    }),
    [contractId, data, form.formState.isDirty]
  );

  return (
    <Form {...form}>
      <form
        className="max-w-screen-2xl w-fit mt-6"
        onSubmit={form.handleSubmit(handleForm)}
      >
        <div className="flex mb-4 space-x-4">
          <Button disabled={!form.formState.isDirty}>Salvar</Button>
          {data && statusRender[data.status]}
        </div>
        <h2 className="text-lg font-medium">Dados básicos</h2>
        <div className="flex my-4">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="w-fit mr-4">
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="text-right"
                    readOnly={data?.status == "CLOSED"}
                  />
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
                  <Input
                    {...field}
                    type="date"
                    readOnly={data?.status == "CLOSED"}
                  />
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
                  <Input
                    {...field}
                    type="date"
                    readOnly={data?.status == "CLOSED"}
                  />
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
                  <Input
                    {...field}
                    type="date"
                    readOnly={data?.status == "CLOSED"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <h2 className="text-lg font-medium">Dados do Imóvel</h2>
        <div className="flex my-4">
          <div>
            <div className="flex mr-4 items-end">
              <FormField
                control={form.control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem className="w-fit">
                    <FormLabel>ID do Imóvel</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input
                          {...field}
                          className="w-28 mr-1"
                          readOnly={data?.status == "CLOSED"}
                        />
                        <Button
                          type="button"
                          onClick={() => fetchProperty()}
                          disabled={data?.status == "CLOSED"}
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
                    <Input {...field} readOnly />
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
                  <Input {...field} readOnly />
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
                  <Input {...field} readOnly />
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
                  <Input {...field} readOnly />
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
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <h2 className="text-lg font-medium">Dados do Locatário</h2>
        <div className="flex my-4">
          <div>
            <div className="flex mr-4 items-end">
              <FormField
                control={form.control}
                name="renterId"
                render={({ field }) => (
                  <FormItem className="w-fit">
                    <FormLabel>ID do Locatário</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input
                          {...field}
                          className="w-28 mr-1"
                          readOnly={data?.status == "CLOSED"}
                        />
                        <Button
                          type="button"
                          onClick={() => fetchRenter()}
                          disabled={data?.status == "CLOSED"}
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
          </div>
          <div className="flex">
            <FormField
              control={form.control}
              name="renterName"
              render={({ field }) => (
                <FormItem className="w-fit mr-4">
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
              name="renterEmail"
              render={({ field }) => (
                <FormItem className="w-fit mr-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
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
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <h2 className="text-lg font-medium">Dados dos Locadores</h2>
        <DataTable columns={columns} data={ownership || []} />
      </form>
    </Form>
  );
}
