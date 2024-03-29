"use client";
import ContractDetails from "@/components/client-components/contracts/contract-details";
import ContractInstallments from "@/components/client-components/contracts/contract-installments";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function Page({ params }: { params: { id: number } }) {
  return (
    <div className="px-8 py-6">
      <div className="flex justify-between mb-4">
        <Label className="text-3xl font-semibold">Contratos</Label>
        <Link href={"/contracts"}>
          <Button variant={"outline"}>
            <ArrowLeftIcon />
            Voltar
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="installments">Parcelas</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <ContractDetails contractId={params.id} />
        </TabsContent>
        <TabsContent value="installments">
          <ContractInstallments id={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
