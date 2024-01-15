import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { updateRenter } from "@/services/axios-requests";
import { useUserStore } from "@/stores/user-store";

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

export default function RentersEdit({ renter }: { renter: RenterProps }) {
  const user = useUserStore();
  const { toast } = useToast();

  const form = useForm<form>({
    resolver: zodResolver(schema),
    values: {
      name: renter.name,
      email: renter.email,
      birthdate: format(new Date(renter.birthdate), "yyyy-MM-dd"),
      pessoa: renter.pessoa,
      cnpjcpf: renter.cnpjcpf,
      ierg: renter.ierg,
      phone: renter.phone,
    },
  });

  async function onSubmit(data: form) {
    const updatedRenter: RenterProps = {
      id: renter.id,
      name: data.name,
      email: data.email,
      cnpjcpf: data.cnpjcpf,
      ierg: data.ierg,
      birthdate: data.birthdate,
      pessoa: data.pessoa,
      phone: data.phone,
    };

    if (await updateRenter(updatedRenter, user.id)) {
      return toast({
        title: "Sucesso",
        description: "Locatário alterado com êxito.",
      });
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-8 w-8 p-0">
          <Pencil2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar Locatário</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-wrap space-y-0">
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
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex"
                      >
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
                          <FormLabel className="font-normal">
                            Jurídica
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
