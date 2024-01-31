import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { updateContract } from "@/services/axios-requests";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";

export default function ContractClosing({
  contractId,
}: {
  contractId: number;
}) {
  const user = useUserStore();

  async function closeContract() {
    try {
      await updateContract(user.id, contractId, { status: "CLOSED" });

      return toast("Sucesso", { description: "Contrato ativado com sucesso" });
    } catch (error) {}
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Encerrar Contrato</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmação</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação irá encerrar o contrato selecionado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={async () => closeContract()}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
