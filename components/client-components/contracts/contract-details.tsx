"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getContract } from "@/services/axios-requests";
import { useUserStore } from "@/stores/user-store";
import {
  CheckIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { DataTable } from "../data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../column-header";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
  const [data, setData] = useState<ContractDetail | undefined>();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<form>({ resolver: zodResolver(schema) });

  useEffect(() => {
    async function fetchContract() {
      try {
        const contract = await getContract(user.id, params.id);
        setData(contract);
      } catch (error) {}
    }
    fetchContract();
  }, [params.id, user.id]);

  function setProperty() {
    setValue("address", data?.property.address || "");
    setValue("number", data?.property.number || 0);
    setValue("complement", data?.property.complement || "");
    setValue("district", data?.property.district || "");
    setValue("city", data?.property.city || "");
    setValue("uf", data?.property.uf || "");
  }
  function setRenter() {
    setValue("renterName", data?.renter.name || "");
  }

  async function handleForm(data: form) {
    return toast({
      title: "Sucesso",
      description: "Contrato atualizado com êxito.",
    });
  }

  return (
    <form className="max-w-7xl w-fit mt-6" onSubmit={handleSubmit(handleForm)}>
      <Label className="text-lg">Dados básicos</Label>
      <div className="flex my-4">
        <div className="mr-4">
          <Label htmlFor="value">Valor</Label>
          <Input id="value" className="text-right" {...register("value")} />
          <p className="text-red-500 text-sm">{errors.value?.message}</p>
        </div>
        <div className="mr-4">
          <Label htmlFor="startDate">Data de início</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
          <p className="text-red-500 text-sm">{errors.startDate?.message}</p>
        </div>
        <div className="mr-4">
          <Label htmlFor="endDate">Data de término</Label>
          <Input id="endDate" type="date" {...register("endDate")} />
          <p className="text-red-500 text-sm">{errors.endDate?.message}</p>
        </div>
        <div className="mr-4">
          <Label htmlFor="dueDate">Data de cobrança</Label>
          <Input id="dueDate" type="date" {...register("dueDate")} />
          <p className="text-red-500 text-sm">{errors.dueDate?.message}</p>
        </div>
        {/* <Button>Salvar</Button> */}
      </div>
      <Label className="text-lg">Dados do Imóvel</Label>
      <div className="flex my-4">
        <div>
          <div className="flex mr-4 items-end">
            <div className="mr-1">
              <Label htmlFor="propertyId">ID do Imóvel</Label>
              <Input
                id="propertyId"
                className="w-28"
                {...register("propertyId")}
              />
            </div>
            <Button type="button">
              <MagnifyingGlassIcon />
            </Button>
          </div>
          <p className="text-red-500 text-sm">{errors.propertyId?.message}</p>
        </div>

        <div className="flex">
          <div className="mr-1">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" {...register("address")} readOnly />
          </div>
          <div className="mr-4">
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              className="w-20"
              {...register("number")}
              readOnly
            />
          </div>
          <div className="mr-4">
            <Label htmlFor="complement">Complemento</Label>
            <Input id="complement" {...register("complement")} readOnly />
          </div>
          <div className="mr-4">
            <Label htmlFor="district">Bairro</Label>
            <Input id="district" {...register("district")} readOnly />
          </div>
          <div className="mr-4">
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" {...register("city")} readOnly />
          </div>
          <div className="mr-4">
            <Label htmlFor="uf">UF</Label>
            <Input id="uf" {...register("uf")} readOnly />
          </div>
        </div>
      </div>
      <Label className="text-lg">Dados do Locatário</Label>
      <div className="flex my-4">
        <div>
          <div className="flex mr-4 items-end">
            <div className="mr-1">
              <Label htmlFor="propertyId">ID do Locatário</Label>
              <Input
                id="propertyId"
                className="w-28"
                {...register("renterId")}
              />
            </div>
            <Button type="button">
              <MagnifyingGlassIcon />
            </Button>
          </div>
          <p className="text-red-500 text-sm">{errors.renterId?.message}</p>
        </div>
        <div className="flex">
          <div className="mr-4">
            <Label htmlFor="renterName">Nome</Label>
            <Input id="renterName" {...register("renterName")} readOnly />
          </div>
          <div className="mr-4">
            <Label htmlFor="renterEmail">Email</Label>
            <Input id="renterEmail" {...register("renterEmail")} readOnly />
          </div>
          <div className="mr-4">
            <Label htmlFor="renterPhone">Telefone</Label>
            <Input id="renterPhone" {...register("renterPhone")} readOnly />
          </div>
        </div>
      </div>
      <Label className="text-lg">Dados dos Locadores</Label>
      <DataTable columns={columns} data={data?.property.Ownership || []} />
    </form>
  );
}
