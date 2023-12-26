"use client";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(1, { message: "Insira sua senha" }),
});

type formLogin = z.infer<typeof schema>;

export default function FormLogin() {
  const [login, setLogin] = useState<boolean>(true);
  const { signIn, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formLogin>({ resolver: zodResolver(schema) });

  async function handleLogin({ email, password }: formLogin) {
    const token = await signIn({ email, password });

    if (!!token) {
      router.push("/dashboard");
    } else {
      setLogin(false);
    }
  }

  return (
    <form className="flex flex-col w-96" onSubmit={handleSubmit(handleLogin)}>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" {...register("email")} />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      </div>
      <div className="mt-6">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" {...register("password")} type="password" />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>
      </div>
      <Button className="mt-6">Login</Button>
      {!login && (
        <Label className="mt-2 text-sm text-red-500">
          Usuário ou senha incorretos
        </Label>
      )}
    </form>
  );
}
