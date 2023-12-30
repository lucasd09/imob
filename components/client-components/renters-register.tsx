"use client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useUserStore } from "@/stores/user-store";
import { createRenter } from "@/services/axios-requests";
import { useToast } from "@/components/ui/use-toast";

const schema = z.object({
  name: z.string().min(5, "Insira um nome"),
  email: z.string().email("Email inválido"),
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
    useUserStore.persist.rehydrate();

    const renter = await createRenter(
      { name: data.name, email: data.email },
      user.id
    );
    console.log(renter);

    if (renter) {
      reset();

      return toast({
        title: "Sucesso",
        description: "Locatário criado com êxito.",
      });
    }
  }
  return (
    <form className="flex mt-4 space-x-4" onSubmit={handleSubmit(handleForm)}>
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register("name")} />
        <p className="text-red-500 text-sm">{errors.name?.message}</p>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" {...register("email")} />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      </div>
      <Button className="mt-6">Salvar</Button>
    </form>
  );
}
