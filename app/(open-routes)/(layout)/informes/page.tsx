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
      <div className="relative mx-auto">
        <Separator
          orientation="vertical"
          className="bg-muted absolute left-2 top-4"
        />
        {informes.map((entry, index) => (
          <div key={index} className="relative mb-10 pl-8">
            <div className="bg-primary absolute left-0 top-3.5 flex size-4 items-center justify-center rounded-full" />
            <h4 className="rounded-xl py-2 text-xl font-bold tracking-tight">
              {entry.titulo}
            </h4>
            <h5 className="text-md text-muted-foreground top-3 rounded-xl tracking-tight">
              {entry.dataPublicacao.toLocaleDateString('pt-BR')}
            </h5>
            <h5 className="text-md text-muted-foreground top-3 rounded-xl tracking-tight">
              {entry.dataPublicacao.toLocaleTimeString('pt-BR')}
            </h5>
            <Card className="my-5 border-none shadow-none">
              <CardContent>
                <div
                  className="text-foreground"
                  dangerouslySetInnerHTML={{ __html: entry.conteudo }}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                {entry.arquivos.map((arquivo) => (
                  <Button variant="outline" key={arquivo.id}>
                    <Link target="_blank" href={`/api/informes/${entry.id}/arquivos/${arquivo.id}`}>
                      {arquivo.nome}
                    </Link>
                  </Button>
                ))}
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
