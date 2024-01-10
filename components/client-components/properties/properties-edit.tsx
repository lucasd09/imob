import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { useUserStore } from "@/stores/user-store";
import { useToast } from "@/components/ui/use-toast";
import { updateProperty } from "@/services/axios-requests";

const schema = z.object({
  address: z.string().min(5, "Endereço inválido"),
  number: z.coerce.number().gte(1, "Número inválido"),
  complement: z.string(),
  district: z.string(),
  zipcode: z.string().min(8, "CEP inválido"),
  uf: z.string(),
  city: z.string(),
  avaliable: z.boolean(),
});

type form = z.infer<typeof schema>;

export default function PropertiesEdit({
  property,
}: {
  property: PropertiesProps;
}) {
  const user = useUserStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<form>({
    resolver: zodResolver(schema),
    defaultValues: {
      avaliable: property.avaliable,
    },
  });

  async function handleForm(data: form) {
    const updatedProperty: PropertiesProps = {
      id: property.id,
      address: data.address,
      number: data.number,
      avaliable: data.avaliable,
      complement: data.complement,
      district: data.district,
      uf: data.uf,
      zipcode: data.zipcode,
      city: data.city,
    };
    console.log(updatedProperty);

    await updateProperty(updatedProperty, user.id);

    if (updatedProperty) {
      reset();

      return toast({
        title: "Sucesso",
        description: "Imóvel alterado com êxito.",
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
      <DialogContent className="max-w-3xl">
        <form onSubmit={handleSubmit(handleForm)}>
          <DialogHeader>
            <DialogTitle>Editar imóvel</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap space-y-2">
            <div className="mr-4">
              <Label htmlFor="name">CEP</Label>
              <Input
                id="name"
                {...register("zipcode")}
                defaultValue={property.zipcode}
              />
              <p className="text-red-500 text-sm">{errors.zipcode?.message}</p>
            </div>
            <div className="mr-4">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                {...register("address")}
                defaultValue={property.address}
              />
              <p className="text-red-500 text-sm">{errors.address?.message}</p>
            </div>
            <div className="mr-4">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                className="w-20"
                {...register("number")}
                defaultValue={property.number}
              />
              <p className="text-red-500 text-sm">{errors.number?.message}</p>
            </div>
            <div className="mr-4">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                {...register("complement")}
                defaultValue={property.complement}
              />
              <p className="text-red-500 text-sm">
                {errors.complement?.message}
              </p>
            </div>
            <div className="mr-4">
              <Label htmlFor="district">Bairro</Label>
              <Input
                id="district"
                {...register("district")}
                defaultValue={property.district}
              />
              <p className="text-red-500 text-sm">{errors.district?.message}</p>
            </div>
            <div className="mr-4">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                {...register("city")}
                defaultValue={property.city}
              />
              <p className="text-red-500 text-sm">{errors.city?.message}</p>
            </div>
            <div>
              <Label htmlFor="uf">Estado</Label>
              <Input id="uf" {...register("uf")} defaultValue={property.uf} />
              <p className="text-red-500 text-sm">{errors.uf?.message}</p>
            </div>
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
      </DialogContent>
    </Dialog>
  );
}
