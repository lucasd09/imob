import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTable } from "../data-table";
import {
  createBilling,
  generateInstallments,
  updateContract,
} from "@/services/axios-requests";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user-store";

const columns: ColumnDef<InstallmentProps>[] = [
  {
    accessorKey: "number",
    header: "Parcela",
  },
  {
    accessorKey: "value",
    header: "Valor",
    cell: ({ row }) => {
      const value = row.getValue<number>("value");
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  {
    accessorKey: "dueDate",
    header: "Data de vencimento",
    cell: ({ row }) => {
      const date = format(new Date(row.getValue("dueDate")), "dd/MM/yyyy");

      return <p>{date}</p>;
    },
  },
];

export default function ContractActivation({
  disabled,
  data,
  contractId,
}: {
  disabled: boolean;
  data: ContractDetail | undefined;
  contractId: number;
}) {
  const user = useUserStore();
  const installments: InstallmentProps[] = generateInstallments(data && data);

  async function handleActivate() {
    if (
      await createBilling(installments, user.id, String(contractId), "RENT")
    ) {
      await updateContract(user.id, contractId, { status: "ACTIVE" });

      return toast("Sucesso", { description: "Contrato ativado com sucesso" });
    } else {
      return toast("Erro", {
        description: "Algo deu errado com a ativação do contrato",
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild disabled={disabled}>
        <Button variant={"outline"} type="button" disabled={disabled}>
          Ativar contrato
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col max-w-3xl">
        <DialogHeader>
          <DialogTitle>Ativar contrato</DialogTitle>
          <DialogDescription>
            Revise as informações antes de ativar, abaixo estão as parcelas que
            serão geradas com a ativação do contrato.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap space-x-4 mt-4">
          <div>
            <p className="font-medium">Valor:</p>
            <p className="text-sm">
              {data?.value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
          <div>
            <p className="font-medium">Data de ínicio:</p>
            <p className="text-sm">
              {data && format(data?.startDate, "dd/MM/yyyy")}
            </p>
          </div>
          <div>
            <p className="font-medium">Data de término:</p>
            <p className="text-sm">
              {data && format(data?.endDate, "dd/MM/yyyy")}
            </p>
          </div>
          <div>
            <p className="font-medium">Dia de cobrança:</p>
            <p className="text-sm">
              {data && format(data?.dueDate, "dd/MM/yyyy")}
            </p>
          </div>
        </div>
        <DataTable columns={columns} data={installments || []} />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Fechar
            </Button>
          </DialogClose>
          <Button type="submit" onClick={async () => await handleActivate()}>
            Ativar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
