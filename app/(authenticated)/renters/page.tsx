import RentersOverview from "@/components/client-components/renters/renters-overview";
import RentersRegister from "@/components/client-components/renters/renters-register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Renters() {
  return (
    <div className="px-8 py-6">
      <div className="flex justify-between mb-4">
        <Label className="text-3xl font-semibold">Locatários</Label>
        <div className="flex space-x-2">
          <Input />
          <Button>Exportar</Button>
        </div>
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="register">Cadastro</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <RentersOverview />
        </TabsContent>
        <TabsContent value="register">
          <RentersRegister />
        </TabsContent>
      </Tabs>
    </div>
  );
}
