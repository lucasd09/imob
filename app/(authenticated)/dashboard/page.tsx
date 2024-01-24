import DashboardOverview from "@/components/client-components/dashboard/dashboard-overview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  return (
    <div className="px-8 py-6">
      <div className="flex justify-between mb-4">
        <Label className="text-3xl font-semibold">Dashboard</Label>
        <div className="flex space-x-2">
          <Input />
          <Button>Exportar</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="w-fit">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <DashboardOverview />
        </TabsContent>
        <TabsContent value="notifications"></TabsContent>
      </Tabs>
    </div>
  );
}
