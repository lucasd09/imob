import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data-table";
import { useFetch } from "@/hooks/useSWR";

const columns: ColumnDef<InstallmentProps>[] = [
  { accessorKey: "id", header: "Lançamento" },
  { accessorKey: "number", header: "Parcela" },
  { accessorKey: "dueDate", header: "Data de vencimento" },
  {
    accessorKey: "value",
    header: () => <div className="text-right">Valor</div>,
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("value"));

      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];

export default function ContractInstallments() {
  return <div>asd</div>;
}
