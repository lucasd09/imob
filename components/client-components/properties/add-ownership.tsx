import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogTitle } from "@radix-ui/react-dialog";
import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";

const schema = z.object({
  propertyId: z.string(),
  address: z.string(),
  number: z.number(),
});

type form = z.infer<typeof schema>;

export default function AddOwnership() {
  const form = useForm<form>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: form) {}
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Proprietários</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-end flex-wrap">
              <FormField
                control={form.control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem className=" w-fit mr-2">
                    <FormLabel>ID do Imóvel</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button>
                <MagnifyingGlassIcon />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
