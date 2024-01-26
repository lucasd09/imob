"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  createContract,
  getProperty,
  getRenter,
} from "@/services/axios-requests";

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
  renterId: z.coerce.number().gte(1, "Código Inválido"),
  renterName: z.string(),
});

type form = z.infer<typeof schema>;

export default function ContractsRegister() {
  const user = useUserStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<form>({ resolver: zodResolver(schema) });

  async function handleForm(data: form) {
    const contract = await createContract(
      {
        value: data.value,
        status: "EDITING",
        startDate: data.startDate,
        endDate: data.endDate,
        dueDate: data.dueDate,
        renterId: data.renterId,
        propertyId: data.propertyId,
      },
      user.id
    );

    if (contract) {
      reset();

      return toast("Sucesso", {
        description: "Contrato criado com êxito.",
      });
    }
  }
  async function fetchProperty() {
    const form = getValues();

    if (!!form.propertyId) {
      const property = await getProperty(user.id, form.propertyId);

      setValue("address", property?.address || "");
      setValue("number", property?.number || 0);
    }
  }
  async function fetchRenter() {
    const form = getValues();

    if (!!form.renterId) {
      const renter = await getRenter(user.id, form.renterId);

      setValue("renterName", renter?.name || "");
    }
  }
  return (
    <form className="max-w-7xl w-fit mt-6" onSubmit={handleSubmit(handleForm)}>
      <div className="flex mb-4">
        <div>
          <div className="flex mr-4 items-end">
            <div className="mr-1">
              <Label htmlFor="propertyId">ID do Imóvel</Label>
              <Input
                id="propertyId"
                {...register("propertyId")}
                className="w-28"
              />
            </div>
            <Button type="button" onClick={async () => await fetchProperty()}>
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
          <div className="mr-1">
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              {...register("number")}
              className="w-20"
              readOnly
            />
          </div>
        </div>
      </div>
      <div className="flex mb-4">
        <div>
          <div className="flex mr-4 items-end">
            <div className="mr-1">
              <Label htmlFor="renterId">ID do Locatário</Label>
              <Input id="renterId" {...register("renterId")} className="w-28" />
            </div>
            <Button type="button" onClick={async () => await fetchRenter()}>
              <MagnifyingGlassIcon />
            </Button>
          </div>
          <p className="text-red-500 text-sm">{errors.renterId?.message}</p>
        </div>
        <div className="flex">
          <div className="mr-1">
            <Label htmlFor="renterName">Nome</Label>
            <Input
              id="renterName"
              {...register("renterName")}
              readOnly
              className="w-[305px]"
            />
          </div>
        </div>
      </div>
      <div className="flex mb-4">
        <div className="mr-4">
          <Label htmlFor="value">Valor</Label>
          <Input id="value" {...register("value")} className="w-28" />
          <p className="text-red-500 text-sm">{errors.value?.message}</p>
        </div>
        <div className="mr-4">
          <Label htmlFor="startDate">Data de Início</Label>
          <Input id="startDate" {...register("startDate")} type="date" />
          <p className="text-red-500 text-sm">{errors.startDate?.message}</p>
        </div>
        <div className="mr-4">
          <Label htmlFor="endDate">Data de Término</Label>
          <Input id="endDate" {...register("endDate")} type="date" />
          <p className="text-red-500 text-sm">{errors.endDate?.message}</p>
        </div>
        <div>
          <Label htmlFor="dueDate">Início da Cobrança</Label>
          <Input id="dueDate" {...register("dueDate")} type="date" />
          <p className="text-red-500 text-sm">{errors.dueDate?.message}</p>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button
          type="reset"
          variant={"outline"}
          className="mr-4"
          onClick={() => reset()}
        >
          Limpar
        </Button>
        <Button>Salvar</Button>
      </div>
    </form>
  );
}
