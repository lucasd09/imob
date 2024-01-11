import Ownership from "@/components/client-components/properties/ownership";
import PropertiesOverview from "@/components/client-components/properties/properties-overview";
import PropertiesRegister from "@/components/client-components/properties/properties-register";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Properties() {
  return (
    <div className="px-8 py-6">
      <div className="flex justify-between mb-4">
        <Label className="text-3xl font-semibold">Imóveis</Label>
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="flex w-fit">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="ownership">Proprietários</TabsTrigger>
          <TabsTrigger value="register">Cadastro</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <PropertiesOverview />
        </TabsContent>
        <TabsContent value="ownership">
          <Ownership />
        </TabsContent>
        <TabsContent value="register">
          <PropertiesRegister />
        </TabsContent>
      </Tabs>
    </div>
  );
}
