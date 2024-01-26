"use client";
import { Input } from "../../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { useUserStore } from "@/stores/user-store";
import { createRenter } from "@/services/axios-requests";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

  const form = useForm<form>({ resolver: zodResolver(schema) });

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
      form.reset();

      return toast("Sucesso", {
        description: "Locatário criado com êxito.",
      });
    }
  }

  return (
    <Form {...form}>
      <form className="max-w-5xl mt-4" onSubmit={form.handleSubmit(handleForm)}>
        <div className="flex flex-wrap">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-fit mr-2">
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
            name="email"
            render={({ field }) => (
              <FormItem className="w-fit mr-2">
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
            name="phone"
            render={({ field }) => (
              <FormItem className="mr-2">
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem className="mr-2">
                <FormLabel>Data de nascimento</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cnpjcpf"
            render={({ field }) => (
              <FormItem className="mr-2">
                <FormLabel>CNPJ/CPF</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ierg"
            render={({ field }) => (
              <FormItem className="mr-2">
                <FormLabel>IE/RG</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pessoa"
            render={({ field }) => (
              <FormItem className="w-fit mr-2">
                <FormLabel>Pessoa</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} className="flex">
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="FISICA" />
                      </FormControl>
                      <FormLabel className="font-normal">Física</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="JURIDICA" />
                      </FormControl>
                      <FormLabel className="font-normal">Jurídica</FormLabel>
                    </FormItem>
                  </RadioGroup>
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
  );
}
