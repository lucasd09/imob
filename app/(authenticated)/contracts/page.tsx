import ContractsOverview from "@/components/client-components/contracts/contracts-overview";
import ContractsRegister from "@/components/client-components/contracts/contracts-register";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Contracts() {
  return (
    <div className="px-8 py-6">
      <div className="flex justify-between mb-4">
        <Label className="text-3xl font-semibold">Contratos</Label>
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="register">Cadastro</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ContractsOverview />
        </TabsContent>
        <TabsContent value="register">
          <ContractsRegister />
        </TabsContent>
      </Tabs>
    </div>
  );
}
