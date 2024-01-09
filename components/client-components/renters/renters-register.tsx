"use client";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { useUserStore } from "@/stores/user-store";
import { createRenter } from "@/services/axios-requests";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";

const schema = z.object({
  name: z.string().min(5, "Insira um nome"),
  email: z.string().email("Email inválido"),
  cnpjcpf: z.string().min(11, "CPF/CNPJ Inválidos"),
  phone: z.string().min(8, "Telefone Inválido"),
  ierg: z.string().min(9, "IE/RG inválidos"),
  pessoa: z.enum(["FISICA", "JURIDICA"], {
    required_error: "Selecione um tipo de pessoa",
  }),
  birthdate: z.string().refine(
    (value) => {
      return !isNaN(Date.parse(value));
    },
    {
      message: "Data de nascimento inválida.",
    }
  ),
});

type form = z.infer<typeof schema>;

export default function RentersRegister() {
  const user = useUserStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<form>({ resolver: zodResolver(schema) });

  async function handleForm(data: form) {
    const renter = await createRenter(
      {
        name: data.name,
        email: data.email,
        birthdate: data.birthdate,
        cnpjcpf: data.cnpjcpf,
        ierg: data.ierg,
        phone: data.phone,
        pessoa: data.pessoa,
      },
      user.id
    );

    if (renter) {
      reset();

      return toast({
        title: "Sucesso",
        description: "Locatário criado com êxito.",
      });
    }
  }

  return (
    <form className="max-w-7xl w-fit mt-4" onSubmit={handleSubmit(handleForm)}>
      <div className="flex flex-wrap">
        <div className="mr-4">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" {...register("name")} />
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        </div>
        <div className="mr-4">
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...register("email")} />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>
        <div className="mr-4">
          <Label htmlFor="birthdate">Data de Nascimento</Label>
          <Input id="birthdate" {...register("birthdate")} type="date" />
          <p className="text-red-500 text-sm">{errors.birthdate?.message}</p>
        </div>
        <div className="mr-4 flex flex-col justify-evenly">
          <Label htmlFor="pessoa">Pessoa</Label>
          <RadioGroup
            defaultValue="FISICA"
            className="flex"
            {...register("pessoa")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="FISICA" id="FISICA" />
              <Label htmlFor="FISICA">Física</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="JURIDICA" id="JURIDICA" />
              <Label htmlFor="JURIDICA">Jurídica</Label>
            </div>
          </RadioGroup>
          <p className="text-red-500 text-sm">{errors.pessoa?.message}</p>
        </div>
        <div className="mr-4">
          <Label htmlFor="cnpjcpf">CNPJ/CPF</Label>
          <Input id="cnpjcpf" {...register("cnpjcpf")} />
          <p className="text-red-500 text-sm">{errors.cnpjcpf?.message}</p>
        </div>
        <div className="mr-4">
          <Label htmlFor="ierg">IE/RG</Label>
          <Input id="ierg" {...register("ierg")} />
          <p className="text-red-500 text-sm">{errors.ierg?.message}</p>
        </div>
        <div className="mr-4">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" {...register("phone")} />
          <p className="text-red-500 text-sm">{errors.phone?.message}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="mt-6">Salvar</Button>
      </div>
    </form>
  );
}
