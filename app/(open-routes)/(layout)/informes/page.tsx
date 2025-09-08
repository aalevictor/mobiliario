import * as React from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { listarInformes } from "@/services/informes";
import InformeComponent from "@/components/informe";

export default async function Informes() {
  const informes = [{
    titulo: "1º Bloco de Respostas aos Pedidos de Esclarecimento",
    subtitulo: "Publicado no Diário Oficial da Cidade de São Paulo em 08/09/2025, nos termos do Item 4 do Edital nº 001/SP-URB/2025:",
  },
  {
    titulo: "Comissão Julgadora",
    subtitulo: "Composição de membros titulares e suplentes, nos termos do Item 5 do Edital nº 001/SP-URB/2025. Publicada no Diário Oficial da Cidade de São Paulo em 08/09/2025",
    conteudo: `
      <div class="space-y-2">
        <p class="font-bold">Titulares:</p>
        <ol class="list-decimal list-inside">
          <li><strong>Luiza Vidotto Bernardo</strong> (indicada da São Paulo Urbanismo, RF 0060771);</li>
          <li><strong>Andrea Perez de Souza Moraes</strong> (indicada da Secretaria Municipal das Subprefeituras - SMUSUB, RF 7273193);</li>
          <li><strong>Silvana Serafino Cambiaghi</strong> (indicada da Comissão Permanente de Acessibilidade – CPA, CAU A9030-1);</li>
          <li><strong>Lucas Lavecchia de Gouvêa</strong> (indicado da Secretaria Municipal do verde e Meio Ambiente - SVMA, RF 8254125);</li>
          <li><strong>Aparecida Regina Lopes Monteiro</strong> (indicada da Comissão de Proteção da Paisagem Urbana - CPPU, RF 0059471);</li>
          <li><strong>Beatriz Messeder Sanches Jalbut</strong> (indicada da Associação Comercial de São Paulo - ACSP, CAU-SP A83664-8);</li>
          <li><strong>Marcelo Consiglio Barbosa</strong> (indicado da Associação Brasileira dos Escritórios de Arquitetura de São Paulo – AsBEA-SP, CAU-SP A11372-7);</li>
        </ol>
        <p class="font-bold">Suplentes:</p>
        <ol class="list-decimal list-inside">
          <li><strong>André de Paula Andreis</strong> (indicado da São Paulo Urbanismo, RF 0060453);</li>
          <li><strong>Renato Salgado</strong> (indicado da Secretaria Municipal de Urbanismo e Licenciamento – SMUL, CAU A85963-0);</li>
        </ol>
      </div>
    `,
    dataPublicacao: new Date("2025-09-08T11:00:00"),
    publicado: true
  }];
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
