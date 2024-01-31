import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { BackpackIcon } from "@radix-ui/react-icons";

export default function DashboardOverview({
  metrics,
}: {
  metrics: DashboardProps | undefined;
}) {
  return (
    <div className="mt-6">
      <div className="flex space-x-4">
        <Card>
          <CardContent className="w-80">
            <div className="flex mt-6 justify-between">
              <p className="font-medium">Contratos em edição</p>
              <BackpackIcon className="h-5 w-5" />
            </div>
            <p className="font-semibold text-xl mt-2">{metrics?.editing}</p>
            <CardDescription>Em edição no momento</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="w-80">
            <div className="flex mt-6 justify-between">
              <p className="font-medium">Contratos ativos</p>
              <BackpackIcon className="h-5 w-5" />
            </div>
            <p className="font-semibold text-xl mt-2">{metrics?.active}</p>
            <CardDescription>Ativos no momento</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="w-80">
            <div className="flex mt-6 justify-between">
              <p className="font-medium">Contratos encerrados</p>
              <BackpackIcon className="h-5 w-5" />
            </div>
            <p className="font-semibold text-xl mt-2">{metrics?.closed}</p>
            <CardDescription>Encerrados</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
