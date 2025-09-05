import * as React from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { listarInformes } from "@/services/informes";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
          <div key={index} className="relative mb-10 pl-8">
            <h5 className="text-md text-muted-foreground mt-2 mb-4 rounded-xl tracking-tight">
              {entry.dataPublicacao.toLocaleDateString('pt-BR')}, {entry.dataPublicacao.toLocaleTimeString('pt-BR')}
            </h5>
            <div className="bg-primary absolute left-0 top-3.5 flex size-4 items-center justify-center rounded-full" />
            <div
              className="w-full flex p-[3px] bg-[#D0DBBF]"
              style={{
                clipPath:
                "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
              }}
            >
              <div
                  className="flex flex-col w-full bg-white p-8 gap-1"
                  style={{
                    clipPath:
                    "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                  }}
              >
                <h2 className="text-[#3B2D3A] text-2xl lg:text-3xl font-bold">
                  {entry.titulo}
                </h2>
                {entry.subtitulo && <h4 className="text-[#3B2D3A] text-md lg:text-lg text-muted-foreground">{entry.subtitulo}</h4>}
                <div
                  className="text-foreground mt-4"
                  dangerouslySetInnerHTML={{ __html: entry.conteudo }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
