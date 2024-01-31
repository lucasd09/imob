"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data-table";
import { useFetch } from "@/hooks/useSWR";
import { useUserStore } from "@/stores/user-store";
import { format } from "date-fns";
import { DataTableColumnHeader } from "../column-header";

const columns: ColumnDef<InstallmentProps>[] = [
  {
    accessorKey: "billingId",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="ID do Lançamento"
        className="w-10"
      />
    ),
  },
  { accessorKey: "number", header: "Parcela" },
  {
    accessorKey: "dueDate",
    header: "Data de vencimento",
    cell: ({ row }) => {
      const date = String(row.getValue("dueDate"));

      const formatted = format(date, "dd/MM/yyyy");

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      switch (row.getValue("type")) {
        case "RENT":
          return <div>Aluguel</div>;
        case "INSURANCE":
          return <div>Seguro</div>;
      }
    },
  },
  {
    accessorKey: "value",
    header: () => <div className="text-right mr-2">Valor</div>,
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("value"));

      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);

      return <div className="text-right mr-2">{formatted}</div>;
    },
  },
];

export default function ContractInstallments({ id }: { id: number }) {
  const user = useUserStore();
  const { data } = useFetch<BillingProps[]>(
    `/billings/installments/${user.id}/${id}`
  );

  const installments: InstallmentProps[] | undefined = data?.flatMap(
    (contract) =>
      contract.installments.map((installment) => ({
        ...installment,
        type: contract.type,
      }))
  );

  return (
    <div>
      <DataTable columns={columns} data={installments || []} />
    </div>
  );
}
