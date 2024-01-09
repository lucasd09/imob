"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUserStore } from "@/stores/user-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createProperty, getZipcode } from "@/services/axios-requests";

const schema = z.object({
  address: z.string().min(5, "Endereço inválido"),
  number: z.coerce.number().gte(1, "Número inválido"),
  complement: z.string(),
  district: z.string(),
  zipcode: z.string().min(8, "CEP inválido"),
  uf: z.string(),
  city: z.string(),
});

type form = z.infer<typeof schema>;

export default function PropertiesRegister() {
  const user = useUserStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<form>({ resolver: zodResolver(schema) });

  async function handleForm(data: form) {
    const property = await createProperty(
      {
        address: data.address,
        number: data.number,
        avaliable: true,
        complement: data.complement,
        district: data.district,
        uf: data.uf,
        zipcode: data.zipcode,
        city: data.city,
      },
      user.id
    );

    if (property) {
      reset();

      return toast({
        title: "Sucesso",
        description: "Imóvel criado com êxito.",
      });
    }
  }
  async function fetchZipcode() {
    const { zipcode } = getValues();
    const res = await getZipcode(zipcode);

    setValue("address", res.logradouro);
    setValue("complement", res.complemento);
    setValue("number", 0);
    setValue("district", res.bairro);
    setValue("city", res.localidade);
    setValue("uf", res.uf);
    return res;
  }

  return (
    <form className="max-w-7xl w-fit mt-4" onSubmit={handleSubmit(handleForm)}>
      <div className="flex mb-6 items-end">
        <div className="mr-4">
          <Label htmlFor="name">CEP</Label>
          <Input id="name" {...register("zipcode")} />
          <p className="text-red-500 text-sm">{errors.zipcode?.message}</p>
        </div>
        <Button type="button" onClick={() => fetchZipcode()}>
          Buscar
        </Button>
      </div>
      <div className="flex flex-wrap">
        <div className="mr-4">
          <Label htmlFor="address">Endereço</Label>
          <Input id="address" {...register("address")} />
          <p className="text-red-500 text-sm">{errors.address?.message}</p>
        </div>
        <div className="mr-4">
          <Label htmlFor="number">Número</Label>
          <Input id="number" className="w-20" {...register("number")} />
          <p className="text-red-500 text-sm">{errors.number?.message}</p>
        </div>
        <div className="mr-4">
          <Label htmlFor="complement">Complemento</Label>
          <Input id="complement" {...register("complement")} />
          <p className="text-red-500 text-sm">{errors.complement?.message}</p>
        </div>
        <div className="mr-4">
          <Label htmlFor="district">Bairro</Label>
          <Input id="district" {...register("district")} readOnly />
          <p className="text-red-500 text-sm">{errors.district?.message}</p>
        </div>
        <div className="mr-4">
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" {...register("city")} readOnly />
          <p className="text-red-500 text-sm">{errors.city?.message}</p>
        </div>
        <div>
          <Label htmlFor="uf">Estado</Label>
          <Input id="uf" {...register("uf")} readOnly />
          <p className="text-red-500 text-sm">{errors.uf?.message}</p>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button>Salvar</Button>
      </div>
    </form>
  );
}
