import * as React from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { listarInformes } from "@/services/informes";
import InformeComponent from "@/components/informe";

export default async function Informes() {
  const informes = await listarInformes() || [];
  return (
    <div className="relative h-full container mx-auto px-4 py-6 max-w-8xl space-y-6">
      <Card>
        <CardHeader>
        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Informações do Concurso
        </CardTitle>
        <CardDescription>
          Aqui você acompanha os informes do concurso, como blocos de respostas aos pedidos de esclarecimento, lista de IDs deferidos e indeferidos na etapa de inscrição, lista de classificação dos IDs na primeira fase, lista final dos IDs vencedores, entre outras informações importantes. Fique atento!
        </CardDescription>
        </CardHeader>
      </Card>
      <div className="relative mx-auto w-[90%] lg:w-[800px] mx-auto gap-12 flex flex-col my-4">
        <Separator
          orientation="vertical"
          className="bg-muted absolute left-2 top-4"
        />
        {informes.map((entry, index) => (
          <InformeComponent key={index} informe={entry} />
        ))}
      </div>
    </div>
  );
};
