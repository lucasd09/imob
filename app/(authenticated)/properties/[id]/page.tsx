import PropertiesDetail from "@/components/client-components/properties/properties-detail";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function Page({ params }: { params: { id: number } }) {
  return (
    <div className="px-8 py-6">
      <div className="flex justify-between mb-4">
        <Label className="text-3xl font-semibold">Imóveis</Label>
        <Link href={"/properties"}>
          <Button variant={"outline"}>
            <ArrowLeftIcon />
            Voltar
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="ownership">
        <TabsList className="grid w-fit">
          <TabsTrigger value="ownership">Proprietários</TabsTrigger>
        </TabsList>
        <TabsContent value="ownership">
          <PropertiesDetail params={params} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
