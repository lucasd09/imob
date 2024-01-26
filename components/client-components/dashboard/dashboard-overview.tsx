import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { BackpackIcon } from "@radix-ui/react-icons";

export default function DashboardOverview({ activeContracts }: DashboardProps) {
  return (
    <div className="mt-6">
      <Card>
        <CardContent className="w-80">
          <div className="flex mt-6 justify-between">
            <p className="font-medium">Contratos ativos</p>
            <BackpackIcon className="h-5 w-5" />
          </div>
          <p className="font-semibold text-xl mt-2">{activeContracts}</p>
          <CardDescription>Ativos no momento</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
