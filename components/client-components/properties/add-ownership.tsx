import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { DialogTitle } from "@radix-ui/react-dialog";
import { PlusIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
      <DialogTrigger>
        <Button type="button">
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Proprietários</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}></form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
