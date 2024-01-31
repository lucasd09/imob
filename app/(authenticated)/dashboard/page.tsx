"use client";
import DashboardOverview from "@/components/client-components/dashboard/dashboard-overview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetch } from "@/hooks/useSWR";
import { useUserStore } from "@/stores/user-store";

export default function Dashboard() {
  const user = useUserStore();
  const { data } = useFetch<DashboardProps>(`/metrics/contracts/${user.id}`);

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
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <DashboardOverview metrics={data} />
        </TabsContent>
        <TabsContent value="notifications"></TabsContent>
      </Tabs>
    </div>
  );
}
