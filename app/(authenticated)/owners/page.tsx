import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Owners() {
  return (
    <div className="px-8 py-6">
      <div className="flex justify-between mb-4">
        <Label className="text-3xl font-semibold">Locadores</Label>
        <div className="flex space-x-2">
          <Input />
          <Button>Exportar</Button>
        </div>
      </div>
      <Tabs defaultValue="account" className="w-fit">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">tab 1</TabsTrigger>
          <TabsTrigger value="password">tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="account"></TabsContent>
        <TabsContent value="password"></TabsContent>
      </Tabs>
    </div>
  );
}
