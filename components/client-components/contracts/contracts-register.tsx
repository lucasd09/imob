"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  createContract,
  getProperty,
  getRenter,
} from "@/services/axios-requests";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
      renterId: 0,
      renterName: "",
    },
  });

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
      form.reset();

      return toast("Sucesso", {
        description: "Contrato criado com êxito.",
      });
    } else {
      return toast("Erro", {
        description: "Não foi possível criar o contrato, verifique os campos.",
      });
    }
  }
  async function fetchProperty() {
    const formData = form.getValues();

    if (!!formData.propertyId) {
      const property = await getProperty(user.id, formData.propertyId);

      if (property) {
        form.setValue("address", property?.address || "");
        form.setValue("number", property?.number || 0);
      } else {
        form.setError("propertyId", {
          type: "onBlur",
          message: "Propriedade não encontrada",
        });
      }
    }
  }
  async function fetchRenter() {
    const formData = form.getValues();

    if (!!formData.renterId) {
      const renter = await getRenter(user.id, formData.renterId);

      if (renter) {
        form.setValue("renterName", renter?.name || "");
      } else {
        form.setError("renterId", {
          type: "onBlur",
          message: "Locatário não encontrado",
        });
      }
    }
  }
  return (
    <Form {...form}>
      <form
        className="max-w-7xl w-fit mt-6"
        onSubmit={form.handleSubmit(handleForm)}
      >
        <div className="flex mb-4">
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
                          onBlur={() => fetchProperty()}
                        />
                        <Button type="button" onClick={() => fetchProperty()}>
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
        </div>
        <div className="flex mb-4">
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
                          onBlur={() => fetchRenter()}
                        />
                        <Button type="button" onClick={() => fetchRenter()}>
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
          </div>
        </div>
        <div className="flex mb-4">
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
        </div>
        <div className="flex justify-end mt-6">
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
