import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export default function ContractActivation({
  disabled,
  data,
}: {
  disabled: boolean;
  data: ContractDetail | undefined;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild disabled={disabled}>
        <Button variant={"outline"} type="button" disabled={disabled}>
          Ativar contrato
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <h2 className="font-medium text-lg">Ativar Contrato</h2>
          <DialogDescription>
            Revise as informações antes de ativar
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Fechar
            </Button>
          </DialogClose>
          <Button type="submit">Ativar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
