import * as React from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import { listarInformes } from "@/services/informes";
import InformeComponent from "@/components/informe";

export default async function Informes() {
  const informes = [{
    titulo: "<span class='font-bold text-red-500'>Lista de Responsáveis Técnicos classificados e habilitados para a Fase 2</span>",
    subtitulo: "Conforme publicação no Diário Oficial da Cidade de São Paulo em 19/12/2025, nos termos do item 14.4.4 do Edital nº 001/SP-URB/2025",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p>Nos termos do item 14.4.4 do Edital nº 001/SP-URB/2025, a Coordenação do Concurso anuncia a seguir, a lista dos 3 (três) responsáveis técnicos habilitados para a Fase 2:</p>
        <div class="font-bold text-center">
          <p>Andrei Mikhail Zaiatz Crestani. CAU: A67986-0</p>
          <p>Felipe Kaspary. CAU: A133190-6</p>
          <p>Keila Jane Costa. CAU: A23864-3</p>
        </div>
        <p>Observação: <span class="italic">A lista acima está em ordem alfabética e não relaciona os IDs da lista de pontuação publicada no dia 10/12/2025.</span></p>
        <p>A Coordenação do Concurso agradece a participação de todos e parabeniza os classificados e habilitados para a próxima fase, que compreenderá a produção de protótipos, com exposição e experimentação públicas, bem como a elaboração do projeto em nível básico.</p>
        <p>Aos interessados que desejarem acompanhar o andamento do Concurso, sugere-se que se mantenham atentos aos próximos informes oficiais e ao cronograma estabelecido no Edital.</p>
      </div>
    `,
    dataPublicacao: new Date("2025-12-19T11:41:00"),
    publicado: true
  },{
    titulo: "<span class='font-bold text-red-500'>LISTA FINAL DE PONTUAÇÃO DOS IDs - FASE 1 </span>",
    subtitulo: "Publicada no Diário Oficial da Cidade de São Paulo no dia 10/12/2025, nos termos do item 14.3 do Edital nº 001/SP-URB/2025. ",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p>A Coordenação do Concurso, conforme competências atribuídas pelo item 4 do Edital nº 001/SP-URB/2025, publicado em 25 de agosto de 2025, apresenta no link a seguir a Lista Final de Pontuação, nos termos do item 14.3 do Edital nº 001/SP-URB/2025, publicada no <a class="text-primary underline" target="_blank" href="https://diariooficial.prefeitura.sp.gov.br/md_epubli_visualizar.php?xza7srXuRP0a5ntEAxOw29MMhU6y67X18U-mhejgAYsqUUSiWr9DigPs2Kyzlqs09dMhEqMlpzqfB2Q7ACGRQA,,">Diário Oficial da Cidade de São Paulo no dia 10/12/2025: </p>
        <a href="/docs/CMU_ATA_14_LISTA-FINAL-FASE-1.pdf" download class="bg-primary text-white text-center px-4 py-2 rounded-md hover:opacity-70 cursor-pointer">LISTA FINAL DE PONTUAÇÃO DOS IDs - FASE 1</a>
        <p>Nos termos do item 14.4 do Edital, <strong>as 3 (três) propostas melhor classificadas passarão à FASE 2</strong> de desenvolvimento dos protótipos e dos projetos em nível básico, <strong>recebendo a título de antecipação da premiação final, o valor correspondente a R$ 65.000,00</strong> (sessenta e cinco mil reais), tal como indicado no item 19 do Edital.</p>
        <p>A condição para recebimento da antecipação da premiação e do acesso à FASE 2 consiste na apresentação, dentro do prazo estabelecido no Cronograma (até dia 12/12/2025), completa dos Documentos de Habilitação, conforme item 9 do Edital, e do Termo de Compromisso de Execução dos Protótipos e Projetos em Nível Básico, conforme modelo constante do ANEXO VI do Edital.</p>
        <p class="font-bold">Agradecemos a todos os participantes pelo empenho e dedicação nesta fase. Parabenizamos os classificados e informamos, ainda, que já foram definidas pela Comissão Julgadora as propostas que receberão menção honrosa, conforme registrado na Ata de Julgamento da Fase 1, publicada em 01/12/2025. As menções honrosas serão divulgadas na Cerimônia Solene de Premiação, nos termos do item 18.4.1 do Edital. </p>
        <p>Mantenham-se atentos aos informes oficiais e desejamos boa sorte aos classificados na Fase 2!</p>
      </div>
    `,
    dataPublicacao: new Date("2025-12-10T11:30:00"),
    publicado: true
  },{
    titulo: "<span class='font-bold'>Ata de Avaliação e Deliberação dos Recursos - Fase 1 </span>",
    subtitulo: "Análise dos recursos interpostos tempestivamente nos termos do item 14.2.5.1 do Edital e deliberação da Coordenação do Concurso, nos termos do item 14.2.5.2, publicado no Diário Oficial da Cidade de São Paulo no dia 10/12/2025.",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p> Coordenação do Concurso, conforme competências atribuídas pelo item 4 do Edital nº 001/SP-URB/2025, publicado em 25 de agosto de 2025, apresenta no link a seguir o conteúdo da Ata nº 14 da Coordenação do Concurso, a respeito da análise dos recursos interpostos tempestivamente nos termos do item 14.2.5.1 do Edital e deliberação da Coordenação do Concurso, nos termos do item 14.2.5.2, publicado no <a class="text-primary underline" target="_blank" href="https://diariooficial.prefeitura.sp.gov.br/md_epubli_visualizar.php?xza7srXuRP0a5ntEAxOw29MMhU6y67X18U-mhejgAYsqUUSiWr9DigPs2Kyzlqs09dMhEqMlpzqfB2Q7ACGRQA,,">Diário Oficial da Cidade de São Paulo no dia 10/12/2025: </p>
        <a href="/docs/CMU_ATA_14_Analise-RECURSOS-Fase-1_VF.pdf" download class="bg-primary text-white text-center px-4 py-2 rounded-md hover:opacity-70 cursor-pointer">Ata de Avaliação e Deliberação dos Recursos - Fase 1</a>
        <p>Diante do improvimento dos recursos apresentados tempestivamente, a Coordenação determina a publicação da Lista Final de Pontuação, tal como estabelecida na Ata de Julgamento nº 01, publicada no dia 01/12/2025, mantidas as desclassificações, constituindo-a como Lista Final de Pontuação dos IDs, nos termos do item 14.3 do Edital.</p>
      </div>
    `,
    dataPublicacao: new Date("2025-12-10T11:30:00"),
    publicado: true
  },{
    titulo: "<span class='font-bold'>Informe sobre procedimentos de Recurso nos Termos do Item 14.2.5.1</span>",
    subtitulo: "Para observação dos participantes, em função da publicação da a Ata de Julgamento e o Quadro de Pontuação com a Súmula da decisão para cada uma das propostas, realizada no dia 01/12/2025.",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p>Conforme o item 14.2.5.1 do Edital, o prazo para interposição de recursos é de 3 (três) dias úteis após a publicação da Ata de Julgamento. Considerando que a Ata foi publicada em 01/12/2025, os recursos poderão ser enviados até às 23h59 do dia 04/12/2025, nos termos do item 21.1 do Edital.</p>
        <p>A interposição de recursos deverá ser apresentada na forma de carta dirigida à COORDENAÇÃO DO CONCURSO, conforme o modelo constante do ANEXO V e nos termos do item 14.2.5.2. A submissão deve ocorrer pela PLATAFORMA DIGITAL ONLINE DO CONCURSO ou, em caso de indisponibilidade temporária desta, pelo email <a href="mailto:concursomoburb.sp2025@spurbanismo.sp.gov.br" class="text-primary underline">concursomoburb.sp2025@spurbanismo.sp.gov.br</a>.</p>
        <p>A interposição de recursos para a Fase 1 não admite o envio de novas peças gráficas ou de materiais que extrapolem o conteúdo já apresentado. A avaliação dessa etapa foi concluída pela Comissão Julgadora, com ciência e deliberação das notas registradas na Ata nº 01/Comissão Julgadora, publicada em 01/12/2025. Assim, não serão aceitos anexos ou materiais adicionais, exceto aqueles destinados a fundamentar ou questionar pontos já apresentados anteriormente e/ou a demonstrar que os documentos previamente submetidos atendem às exigências editalícias. Alterações do material já apresentado não são permitidas.</p>
      </div>
    `,
    dataPublicacao: new Date("2025-12-03T14:00:00"),
    publicado: true
  },{
    titulo: "<span class='text-red-500 font-bold'>Resultado da FASE-1: Ata de Julgamento e Quadro de Pontuação</span>",
    subtitulo: "Conforme publicação no Diário Oficial da Cidade de São Paulo em 01/12/2025, nos termos do item 14.2.5 do Edital nº 001/SP-URB/2025.",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p>A Coordenação do Concurso, conforme competências atribuídas pelo item 4 do Edital nº 001/SP-URB/2025, publicado em 25 de agosto de 2025, apresenta nos links a seguir a Classificação das propostas técnicas, conforme estabelecido na Ata de Julgamento da Fase 1 e anexo único correspondente ao Quadro de Pontuação com Súmula da Decisão da Comissão Julgadora, em atendimento ao 14.2.5 do Edital. </p><a href="/docs/CMU_CJ_ATA_01_JULGAMENTO_FASE_1.pdf" download class="bg-primary text-white text-center px-4 py-2 rounded-md hover:opacity-70 cursor-pointer">Ata de Julgamento da Fase 1</a>
        <a href="/docs/CMU_QUADRO-PONTUAÇÃO_SUMULA.pdf" download class="bg-primary text-white text-center px-4 py-2 rounded-md hover:opacity-70 cursor-pointer">Quadro de Pontuação com Súmula da Decisão da Comissão Julgadora</a>
        <p>Conforme decisão da Comissão Julgadora, com base no item 4.2.12.1 do Edital, os participantes receberão individualmente as observações registradas na etapa presencial de julgamento para as dez primeiras propostas classificadas. Para as demais, serão disponibilizadas as avaliações registradas na etapa de julgamento individual.</p>
        <p>As propostas desclassificadas estão elencadas na Ata de Julgamento e no Quadro de Pontuação com a Súmula, acompanhada da decisão da Comissão Julgadora.</p>
        <p>O prazo de interposição de recursos é de 3 (três) dias úteis após a publicação da Lista de Classificação, realizada no dia 01/12/2025, nos termos do item 14.2.5 do Edital. Neste Período poderão ser encaminhadas solicitações de recurso na forma de carta direcionada à COORDENAÇÃO DO CONCURSO, conforme modelo estabelecido no ANEXO V do Edital, nos termos do item 14.2.5.2 do Edital. A solicitação deverá ser feita via Plataforma Digital Online ou, caso haja indisponibilidade temporária da plataforma, pelo e-mail <a href='mailto:concursomoburb.sp2025@spurbanismo.sp.gov.br' class='text-primary underline'>concursomoburb.sp2025@spurbanismo.sp.gov.br</a>.</p>
        <p>Após a análise dos recursos será divulgada e a lista final de pontuação dos IDs até o dia <strong>10/12/2025</strong>, nos termos do item 14.3 do Edital.</p>
        <p>Nos termos do item 14.4 do Edital, as 3 (três) propostas melhor classificadas passarão à FASE 2 de desenvolvimento dos protótipos e dos projetos em nível básico, recebendo a título de antecipação da premiação final, o valor correspondente a R$ 65.000,00 (sessenta e cinco mil reais), tal como indicado no item 19 do Edital.</p>
        <p>Fique atento pois, caso sua proposta alcance as melhores pontuações, a condição para recebimento da antecipação da premiação e do acesso à FASE 2 consiste na apresentação, dentro do prazo de estabelecido no Cronograma <strong>(até dia 12/12/2025)</strong>, completa dos documentos de habilitação, conforme item 9 deste Edital, e do TERMO DE COMPROMISSO DE EXECUÇÃO DOS PROTÓTIPOS PROJETOS EM NÍVEL BÁSICO, conforme modelo constante do ANEXO VI do Edital.</p>
      </div>
    `,
    dataPublicacao: new Date("2025-12-01T11:00:00"),
    publicado: true
  },{
    titulo: "Deliberação sobre recurso interposto contra ao indeferimento de habilitação para julgamento da Fase 1, nos termos do item 13.2.",
    subtitulo: "Deliberação sobre pedido único de recurso interposto pelo participante inscrito sob o ID nº MOB-2025-0720257560, referente ao indeferimento de habilitação para julgamento da Fase 1, nos termos do item 13.2, publicada no Diário Oficial da Cidade de São Paulo em 10/11/2025.",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p>Considerando que o Termo de Referência, integrante do Edital nº 001/SP-URB/2025, exige a apresentação integral do conteúdo técnico dentro das pranchas, conforme modelo estabelecido, não havendo previsão para anexos ou páginas complementares, seja em arquivos apartados ou no mesmo arquivo PDF relativo à prancha, a Coordenação do Concurso delibera pela manutenção do indeferimento do ID nº MOB-2025-0720257560, com fundamento nos itens 13.1.4 e 13.1.5 do Edital, conforme lista de propostas deferidas e indeferidas publicada em 03/11/2025.</p>
      </div>
    `,
    dataPublicacao: new Date("2025-11-10T16:00:00"),
    publicado: true
  },{
    titulo: "<span class='text-red-500'>LISTA de IDs deferidos e indeferidos para julgamento das propostas técnicas em estudo preliminar - FASE 1</span>",
    subtitulo: "Publicada no Diário Oficial da Cidade de São Paulo em 03/11/2025, nos termos do item 13.2 do Edital nº 001/SP-URB/2025",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p>A Coordenação do Concurso, nos termos das competências atribuídas pelo item 4 do Edital nº 001/SP-URB/2025 publicado em 25 de agosto de 2025 (Edital: 141066448 e publicação: 141068804), registra a conclusão da análise dos arquivos submetidos, relativos às propostas técnicas em nível de estudo preliminar (Fase 1), para verificação quanto à conformidade às NORMAS DE APRESENTAÇÃO E SUBMISSÃO DAS PROPOSTAS, nos termos dos itens 13.1.7, e consequente habilitação para julgamento pela Comissão Julgadora, nos termos dos itens 13.2 e 13.3 do Edital.</p>
        <p>A Lista de IDs deferidos e indeferidos para o julgamento das propostas da FASE 1 apresenta para cada um dos IDs:</p>
        <ul class="list-disc list-inside">
          <li>(i) Avaliação da Coordenação do Concurso, relacionada na segunda coluna;</li>
          <li>(ii) Habilitação para julgamento na terceira coluna, indicando “SIM” para as propostas deferidas e “NÃO” para as indeferidas;</li>
          <li>(iii) Motivação do indeferimento, para as propostas indeferidas;</li>
        </ul>
        <p class="font-bold">Nos termos do item 13.3 do Edital, os IDs deferidos serão considerados habilitados para o Julgamento das PROPOSTAS TÉCNICAS em nível de ESTUDO PRELIMINAR - FASE -1.</p>
        <p>Conforme consta do Cronograma do Concurso, o julgamento das propostas da FASE 1 será concluído até o dia 27/11/2025, seguido da 1ª publicação da pontuação dos IDs até o dia 01/12/2025, e da lista final até o dia 10/12/2025.</p>
        <a href="/listas/lista-avaliacao.pdf" download class="bg-primary text-white text-center px-4 py-2 rounded-md hover:opacity-70 cursor-pointer">Acesse aqui a Lista</a>
      </div>
    `,
    dataPublicacao: new Date("2025-11-03T11:00:00"),
    publicado: true
  },{
    titulo: "<span>Informe aos participantes</span>",
    subtitulo: "Encerramento do acesso à plataforma para participantes com inscrição indeferida",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p>A Coordenação do Concurso, nos termos das competências atribuídas pelo item 4 do Edital nº 001/SP-URB/2025, publicado em 25 de agosto de 2025, agradece aos interessados em participar do certame que tiveram sua pré-inscrição indeferida pelos motivos constantes da <a href="/listas/lista01.pdf" download class="text-primary underline">1ª Lista</a>, publicada em 30/09/2025, ou da <a href="/listas/lista-recursos.pdf" download class="text-primary underline">Lista de Recursos</a>, publicada em 10/10/2025. Esses interessados terão seu acesso à plataforma encerrado em 3 (três) dias corridos, contados a partir da presente data.</p>
        <p>Aos participantes que tiveram sua inscrição deferida, e que se encontram, portanto, na Fase 1, reiteramos o Informe publicado em 11/10/2025, recomendando atenção ao conteúdo do Edital e do Termo de Referência acerca da apresentação das propostas técnicas, bem como à observância da temática do concurso, das diretrizes técnicas e do cronograma — que estabelece como data limite para submissão dos estudos preliminares o dia 27/10/2025.</p>
      </div>
    `,
    dataPublicacao: new Date("2025-10-17T08:00:00"),
    publicado: true
  },{
    titulo: "<span class='text-red-500' id='projetos'>Fase 1: Atenção participante inscrito!</span>",
    subtitulo: "Fique atento ao cronograma e às normas e orientações para submissão de sua proposta técnica",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p>A submissão das propostas técnicas da Fase 1 deverá ser realizada a partir do dia 13/10/2025 até o dia <span class='text-red-500 font-bold'>27/10/2025</span>, conforme consta do Cronograma (com alteração publicada no dia 15/09/2025).</p>
        <p>Na Plataforma Digital Online, os modelos indicados no Termo de Referência (Anexos de 01 a 08), estão disponíveis para download na aba "Modelos", localizada na área restrita do participante <span class='font-bold'>INSCRITO.</span></p>
        <p>Antes de submeter a proposta técnica, releia atentamente o Edital e o Termo de Referência. Os arquivos devem ser adequadamente apresentados em formato digital, <strong>em PDF</strong>, seguindo as NORMAS DE APRESENTAÇÃO do Termo de Referência (item 6). </p>
        <p><strong>Atenção!</strong> Antes de submeter a proposta, <strong>certifique-se que nas propriedades (e metadados) do arquivo PDF não constem quaisquer informações de autoria ou que permitam identificá-la.</strong> Seu conteúdo também não pode apresentar marcas identificadoras da autoria.</p>
        <p>Continue atento aos informes e boa sorte!</p>
      </div>
    `,
    dataPublicacao: new Date("2025-10-11T08:00:00"),
    publicado: true
  },{
    titulo: "<span class='text-red-500'>LISTA FINAL de IDs deferidos e indeferidos para inscrição </span>",
    subtitulo: "Publicada no Diário Oficial da Cidade de São Paulo em 10/10/2025, nos termos do item 12.3.1.5 do Edital nº 001/SP-URB/2025",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p>A Coordenação do Concurso, nos termos das competências atribuídas pelo item 4 do Edital nº 001/SP-URB/2025 publicado em 25 de agosto de 2025 (Edital: 141066448 e publicação: 141068804), registra, por meio desta, a conclusão da análise da habilitação dos pré-inscritos, nos termos do item 12.3.1.3.</p>
        <p>A <a href="/listas/lista-recursos.pdf" download class="text-primary underline">Lista de Recursos deferidos e indeferidos</a> registra a análise dos recursos apresentados tempestivamente nos termos do item 12.3.1.4.</p>
        <p>A publicação da <span class='text-red-500 font-bold'>LISTA FINAL de IDs</span> deferidos e indeferidos atende ao item 12.3.1.5 sendo realizada também no Diário Oficial da Cidade de São Paulo.</p>
        <p>Nos termos do item 12.3.1.6, <span class='font-bold'>Os IDs deferidos estão inscritos no concurso e habilitados à etapa de submissão das Propostas em Nível de Estudo Preliminar (Fase 1).</span></p>
        <a href="/listas/lista02.pdf" download class="bg-primary text-white text-center px-4 py-2 rounded-md hover:opacity-70 cursor-pointer">Confira aqui a lista</a>
      </div>
    `,
    dataPublicacao: new Date("2025-10-10T08:00:00"),
    publicado: true
  },{
    titulo: "<span class='text-red-500'>1ª lista de IDs deferidos e indeferidos para inscrição no Concurso, nos termos do item 12.3.1.3 do Edital nº 001/SP-URB/2025</span>",
    subtitulo: "Publicada no Diário Oficial da Cidade de São Paulo em 30/09/2025",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p>A Coordenação do Concurso, nos termos das competências atribuídas pelo itens 4 do Edital nº 001/SP-URB/2025 publicado em 25 de agosto de 2025 (Edital: 141066448 e publicação: 141068804), registra, por meio desta, a conclusão da análise da habilitação dos pré-inscritos, nos termos do item 12.3.1.3, segundo o qual “Após a análise da habilitação dos pré-inscritos, será divulgada na PLATAFORMA ONLINE DO CONCURSO na data constante do item 21 deste Edital “Cronograma”, a lista de IDs deferidos e indeferidos, acompanhados das motivações em caso de indeferimento”.</p>
        <p>A publicação da lista de que trata o aludido item também deverá ser realizada no Diário Oficial da Cidade de São Paulo, indicando os despachos de deferimento e indeferimento para cada código identificador (ID), seguido das motivações para os casos de indeferimento. Para a plataforma Digital Online a lista indica, adicionalmente, as seguintes informações:</p>
        <p><strong>1ª coluna:</strong> Número do ID;</p>
        <p><strong>2ª coluna:</strong> Documentos exigidos para inscrição;</p>
        <p><strong>3ª coluna:</strong> “Código da Documentação”, nos termos do anexo IV do Edital;</p>
        <p><strong>4ª coluna:</strong> “Situação do documento apresentado”, compreendendo as seguintes possibilidades:</p>
        <ul class="ml-8 list-disc list-inside">
          <li><strong>Documento Adequado: </strong>quando o documento foi apresentado, conforme exigências constantes do Edital.</li> 
          <li><strong>Documento Inadequado ou Insuficiente: </strong>quando o documento foi apresentado, mas com indicativo de irregularidade ou incompleto (sem assinatura, por exemplo).</li> 
          <li><strong>Documento não Apresentado: </strong>ausência do documento exigido </li>
          <li><strong>Não se aplica: </strong>quando, para a categoria de inscrição pleiteada, a documentação não é exigida.</li> 
        </ul>
        <p><strong>5ª coluna:</strong> “Parecer da documentação”, compreendendo as seguintes possibilidades:</p>
        <ul class="ml-8 list-disc list-inside">
          <li><strong>Documentação Aprovada: </strong>quando a documentação foi considerada suficiente para inscrição, nos termos do edital;</li> 
          <li><strong>Documentação Reprovada: </strong>quando a documentação foi considerada insuficiente para inscrição, se aplicando para os casos de documentos inadequados ou insuficientes ou documentos não apresentados;</li> 
          <li><strong>Não se aplica: </strong>quando, para a categoria de inscrição pleiteada, a documentação não é exigida.</li> 
        </ul>
        <p><strong>6ª coluna:</strong> “Considerações da análise”, contendo eventuais considerações da Coordenação do Concurso acerca da documentação apresentada;</p>
        <p><strong>7ª coluna:</strong> “Despacho”, compreendendo o DEFERIMENTO ou INDEFERIMENTO da inscrição;</p> 
        <p><strong>8ª coluna:</strong> “Motivo do despacho”, compreendendo somente os casos de indeferimento, indicando os termos do Edital que motivam a decisão. Exemplos: “Ausência total da documentação exigida”, quando nenhum dos documentos foram apresentados, ou ”apresentação insuficiente” quando algum dos documentos tem sido apresentado, sem assinatura, ou com indicação de impedimento para participação no concurso”.</p>
        <p>Nos termos do item 12.3.1.4 do Edital, para os IDs que receberam INDEFERIMENTO, será permitida a apresentação de recurso em até 3 dias úteis da data de publicação desta lista, via Plataforma Digital Online, devendo-se apresentar as alegações e documentos que solucionem os apontamentos da motivação do indeferimento. Será obrigatória a apresentação da CARTA DE INTERPOSIÇÃO DE RECURSO, conforme modelo constante do ANEXO V do Edital. Caso o interessado enfrente dificuldades de acesso à Plataforma Digital Online, será permitido o envio da documentação de recurso para o e-mail do concurso (<a class="text-blue-500 underline" href="mailto:concursomoburb.sp2025@spurbanismo.sp.gov.br">concursomoburb.sp2025@spurbanismo.sp.gov.br</a>).</p>
        <p>Pra os casos indeferidos nos termos dos itens 8.3.4.4 e 8.3.4.4.1, quando o participante ou integrante da equipe constou cadastrado em mais de uma inscrição, ou seja, seu nome, CPF ou CNPJ constou em mais de um ID (código identificador da inscrição), será necessária apresentar o recurso somente para a inscrição na qual o participante estiver corretamente cadastrado. Este recurso não dispensa a apresentação da CARTA DE INTERPOSIÇÃO DE RECURSO, conforme modelo constante do ANEXO V do Edital, atendidas as demais disposições do item 12.3.1.4 do Edital.</p>
        <p>Nos termos dos itens 12.3.1.5 e 12.3.1.6, a publicação final da lista de <strong>IDs deferidos</strong> se dará após a análise dos eventuais recursos, conforme o cronograma do Edital (com alterações publicadas em 15/09/2025).</p>
        <p><strong>Os IDs deferidos</strong> serão considerados <strong>inscritos no CONCURSO</strong> e ficarão automaticamente habilitados à Etapa 2 de submissão das <strong>Propostas em Nível de Estudo Preliminar</strong>.</p>
        <a href="/listas/lista01.pdf" download class="bg-primary text-white text-center px-4 py-2 rounded-md hover:opacity-70 cursor-pointer">Confira aqui a lista</a>
      </div>
    `,
    dataPublicacao: new Date("2025-09-30T08:00:00"),
    publicado: true
  },{
    titulo: "PRAZO SUPLEMENTAR PARA SUBMISSÃO DE DOCUMENTOS: <span class='text-red-500'>de 8h às 12h do dia 26/09/2025 (sexta-feira no período da manhã)</span>",
    subtitulo: "Deliberação da Coordenação do Concurso Público Nacional de Projetos para Elementos de Mobiliário Urbano da Cidade de São Paulo – Edital nº 001/SP-URB/2025), publicado no Diário oficial da Cidade de São Paulo em 25/09/2025",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p>CONSIDERANDO as 3 (três) notificações recebidas por e-mail a respeito de possíveis falhas do sistema da Plataforma Digital Online;</p>
        <p>CONSIDERANDO a manifestação técnica de SMUL/ATIC, segundo a qual pôde-se inferir que não houve prejuízo no registro de novas inscrições, conforme se constata por meio de logs e e-mails enviados aos pré-inscritos, com registros realizados bem próximos ao horário de encerramento. E que, ainda conforme a aludida manifestação, embora tenham sido processados com sucesso diversos envios de documentos, é plausível que um ou outro não tenha alcançado êxito, em razão do elevado número de solicitações processadas próximo ao horário limite, somada a possibilidade de eventuais problemas de comunicação ocasionados por quedas de rede elétrica e de internet, em consequência das chuvas e rajadas de vento ocorridas em 22/09/2025 em diversas localidades, inclusive nesta Capital.</p>
        <p>A Coordenação do Concurso, nos termos das atribuições definidas no Edital nº 001/SP-URB/2025, DELIBERA:</p>
        <p>1. Pela abertura de prazo suplementar exclusivamente para submissão de documentação necessária dos pré-inscritos, tendo em vista que algumas submissões podem ter sido prejudicadas em razão do elevado número de solicitações processadas próximo ao horário limite, somada a possibilidade de eventuais problemas de comunicação ocasionados por quedas de rede elétrica e de internet, em consequência das chuvas e rajadas de vento ocorridas em 22/09/2025, conforme indicação da Manifestação Técnica de SMUL/ATIC.</p>
        <p class="font-bold">2. Por aceitar somente a submissão de documentos novos no sistema, com datas de processamento e assinatura até 22/09/2025 às 23h59, não sendo autorizada a substituição ou supressão de quaisquer documentos já submetidos na plataforma.</p>
        <p>3. Que, por equivalência ao tempo inferido da indisponibilidade temporária da Plataforma Digital Online nos termos dos itens 11.7 e 11.7.1, <span class="font-bold">o prazo suplementar se dará somente pelo período entre as <span class="text-red-500">8h e 12h do dia 26/09/2025</span>, cabendo aos pré-inscritos submeter a documentação preferencialmente via Plataforma Digital Online ou pelo e-mail <a href="mailto:concursomoburb.sp2025@spurbanismo.sp.gov.br" class="text-blue-500 underline">concursomoburb.sp2025@spurbanismo.sp.gov.br</a></p>
        <p>A documentação submetida pode ser conferida na área restrita do participante, que pode ser acessada com seu login e senha. Caso tenha conseguido realizar a submissão de sua documentação no prazo estabelecido, não é necessário reenviá-la.</p>
      </div>
    `,
    dataPublicacao: new Date("2025-09-25T11:00:00"),
    publicado: true
  },{
    titulo: "4º Bloco de Respostas aos Pedidos de Esclarecimento ",
    subtitulo: "Publicado no Diário Oficial da Cidade de São Paulo em 18/09/2025, nos termos do Item 4 do Edital nº 001/SP-URB/2025: ",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p>A Ata nº 01 de Respostas aos pedidos de Esclarecimento da Coordenação do Concurso tratou de pedidos processados desde a abertura e publicação do Edital (25/08/2025) até o dia 05/09/2025 às 12h, que resultou na publicação do 1º Bloco de Respostas aos Pedidos de Esclarecimento no dia 08/09/2025, tanto no Diário Oficial da Cidade de São Paulo, quanto na Plataforma Digital Online do Concurso. </p>
        <p>A Ata nº 02 considerou os pedidos de esclarecimento processados entre o dia 05/09/2025 às 12h01 até a 10/09/2025 às 12h, que resultou na publicação do 2º Bloco de Respostas aos Pedidos de Esclarecimento no dia 11/09/2025, tanto no Diário Oficial da Cidade de São Paulo, quanto na Plataforma Digital Online do Concurso. </p>
        <p>A Ata nº 03 considerou os pedidos de esclarecimento processados entre o dia 10/09/2025 às 12h01 até 12/09/2025 às 12h. que resultaram na publicação do 3º Bloco de Respostas aos Pedidos de Esclarecimento no dia 15/09/2025, tanto no Diário Oficial da Cidade de São Paulo, quanto na Plataforma Digital Online do Concurso.</p>
        <p>A Ata nº 04 tratou especificamente da prorrogação dos prazos de inscrições e submissão das propostas técnicas em nível de estudo preliminar. O novo cronograma foi publicado tanto no Diário Oficial da Cidade de São Paulo quanto na Plataforma Digital Online.</p>
        <p>A presente ata considerou os pedidos de esclarecimento processados entre o dia 12/09/2025 às 12h01 até o dia 14/09/2025 às 23h59, data e horário limite para submissão dos pedidos de esclarecimento nos termos do item 7.1 e 21 do Edital. Assim, o presente bloco de resposta aos pedidos de esclarecimento, constitui o último a ser publicado, em cumprimento às disposições do Edital. No período foram processados 05 (cinco) pedidos via Plataforma Digital e 02 (dois) via e-mail.</p>
        <p class="italic">Observação: Tal como feito nos Blocos 1, 2 e 3 de Respostas aos Pedidos de Esclarecimento, para fins de publicação, as indicações de nomes, assinaturas e autoria dos pedidos (via e-mail ou via Plataforma Digital) foram suprimidos, para preservar o sigilo dos potenciais participantes.</p>
        <p>Relacionamos a seguir os pedidos de esclarecimento, cada qual seguido de resposta redigida por esta Coordenação: </p>
        <div class="space-y-2 mt-4">
          <p class="font-bold">1. Pedido de Esclarecimento feito via PLATAFORMA DIGITAL processado em 12/09/2025:</p>
          <p>Não tenho a carteira do Cau sempre comprovo com termo de quitação e e Certidão de Registro aqui na minha cidade demora um pouco para fazer sera que existe uma razoabilidade quanto a isso?</p>
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p>A Certidão de Registro e Quitação emitida pelo Conselho de Arquitetura e Urbanismo (CAU) é suficiente para a comprovação do devido registro na instituição. Tanto essa comprovação perante o CAU quanto documento equivalente emitido pelo CREA deverão, obrigatoriamente, estar vinculados ao responsável técnico pelo projeto no momento da inscrição. Não será exigida a apresentação desses documentos pelos demais membros da equipe, exceto nos casos em que houver corresponsabilidade técnica pelo projeto, devendo neste caso, cada responsável técnico apresentar a comprovação de registro e regularidade junto ao CAU ou ao CREA.</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">2.	Pedido de Esclarecimento feito via PLATAFORMA DIGITAL processado em 12/09/2025:</p>
          <p>É uma possível uma instituição educacional ser o CNPJ inscrito e ter como responsável de projeto um arquiteto regular no CAU? Para que os alunos e a instituição possam participar</p>
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p>Conforme item 8.2 do edital, poderão se inscrever no concurso pessoas física ou jurídica, de nacionalidade brasileira, admitindo-se brasileiros natos ou naturalizados, legalmente formado e em pleno gozo de seus direitos profissionais. A participação poderá ser por equipe, sendo que neste caso, esta poderá ser composta por pessoas físicas e/ou jurídicas, que deverão declarar sua participação por meio da Declaração de Participação na Equipe, vide item 8.3.4, sendo obrigatória a apresentação de um arquiteto e urbanista registrado no Conselho de Arquitetura e Urbanismo – CAU ou um engenheiro registrado no CREA, em pleno gozo de seus direitos profissionais, para ser o RESPONSÁVEL TÉCNICO pelo projeto correspondente à PROPOSTA TÉCNICA (item 8.3.1).</p>
          <p>Nos termos do item 8.3.2 do edital, no caso de inscrição como Pessoa Jurídica, o RESPONSÁVEL TÉCNICO pelo projeto deverá estar vinculado à Pessoa Jurídica como integrante do quadro social, como empregado ou como contratado, o que deverá ser comprovado através de documentos vigentes na data da inscrição, através da assinatura da Declaração de Vínculo à Pessoa Jurídica.</p>
          <p>A equipe será representada por um único profissional, definido no ato da inscrição, que responderá por todas as ações necessárias no processo do Concurso, providenciando e assinando a documentação exigida, conforme item 8.3.4.1. Nos termos do item 8.3.4.2, não há exigência quanto à formação acadêmica em relação aos demais membros, mantendo-se a exigência para o RESPONSÁVEL TÉCNICO, enquanto representante legal conforme é explicitado no item 8.2.</p>
          <p>Por fim, ressalta-se que, de acordo com o item 8.3.4.3 do edital, todos os vínculos e relações criadas no trabalho em equipe são de responsabilidade total e integral do profissional representante, cabendo a este todas as incidências legais, as responsabilidades sobre o trabalho e as relações trabalhistas ou pertinentes à participação no Concurso, não gerando qualquer relação legal com a entidade promotora e organizadora.</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">3.	Pedido de Esclarecimento feito via PLATAFORMA DIGITAL processado em 12/09/2025:</p>
          <p>Olá, gostaria de saber se as assinaturas podem ser feitas pelo sistema gov de assinatura digital.</p>
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p>Sim, as assinaturas poderão ser realizadas por meio do sistema de assinatura eletrônica Gov.br.</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">4.	Pedido de Esclarecimento feito via PLATAFORMA DIGITAL processado em 12/09/2025:</p>
          <p>O banco Neon SA é uma insituição permitida neste edital? Utilizei para a PNAB 2024, é uma conta que eu gostaria de usar em mais um edital.</p>
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p>O edital não apresenta restrições quanto a instituição bancária a ser utilizada.</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">5.	Pedido de Esclarecimento feito via PLATAFORMA DIGITAL processado em 12/09/2025:</p>
          <p>O concurso é Pessoa Jurídica ou Pessoa Física? Como faz inscrição se na mesmo exige documentos de Pessoa Jurídica?</p>
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p>Conforme item 8.2 do edital, poderão se inscrever no concurso pessoas física ou jurídica, de nacionalidade brasileira, admitindo-se brasileiros natos ou naturalizados, legalmente formado e em pleno gozo de seus direitos profissionais. A participação poderá ser individual ou por equipe, sendo, no caso individual, esta sendo representada por uma única pessoa física ou por pessoa jurídica enquadrada como empresa individual, vide item 8.3.3 do edital, e, no caso de participação por equipe, poderá ser composta por pessoas físicas e/ou jurídicas, que deverão declarar sua participação por meio da Declaração de Participação na Equipe, conforme modelo constante no ANEXO III do Edital, vide item 8.3.4.</p>
          <p>O Concurso estabelece a documentação aplicável tanto para pessoas físicas quanto para pessoas jurídicas e, quando necessário, especifica os documentos que devem ser apresentados em cada caso. A relação da documentação exigida encontra-se no item 9 do edital. Nos termos do item 9.1, a documentação de habilitação deverá ser apresentada em nome da PESSOA FÍSICA ou PESSOA JURÍDICA correspondente ao RESPONSÁVEL TÉCNICO pelos projetos apresentados, com o mesmo número do CPF ou CNPJ e endereço. O item 9.2 apresenta os documentos necessários para a inscrição, abrangendo tanto pessoas físicas quanto jurídicas, enquanto o item 9.3.1 dispõe sobre a documentação exigida especificamente de pessoas físicas para a fase 2 do concurso.</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">6.	Pedido de Esclarecimento (via e-mail) sobre funcionalidade da plataforma processado em 12/09/2025:</p>
          <p>estamos há três dias tentando realizar a inscrição no concurso em diferentes computadores e navegadores de internet e sempre chegamos nessa mensagem de erro.</p>
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p>Você já está na lista de pré-inscritos do concurso, registrado neste mesmo e-mail pelo qual você nos contatou. Você deve ter recebido algum email de comunicação confirmando sua pré-inscrição, no dia em que ela foi efetuada (03/09/2025).
          Pra acessar a área do pré-inscrito, você precisará utilizar o email cadastrado com a senha de primeiro acesso que foi enviada junto a confirmação, no link abaixo:
          https://concursomoburb.prefeitura.sp.gov.br/auth/login
          Caso você não encontre a senha inicial, você também pode fazer a recuperação da sua senha no link abaixo:
          https://concursomoburb.prefeitura.sp.gov.br/auth/reset
          </p>
          <p><strong>Resposta do Interessado (12/09/2025):</strong> conseguimos, desculpe o incomodo</p>
          <p><strong>Observação da Coordenação:</strong> a questão foi solucionada</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">7.	Pedido de Esclarecimento (via e-mail) sobre funcionalidade da plataforma processado em 14/09/2025:</p>
          <p>Sou XXXXXXXXX, responsável pela equipe XXXXXXXXXX. Ao subir os documentos no site da forma indicada no edital, em cada arquivo enviado foi automaticamente adicionado um número antes do ID da equipe (exemplo: 123456789-MOB-2025...). Gostaria de chegar se esse é um procedimento padrão do site ou se houve algum bug. Gostaria de ter certeza que a inscrição da minha equipe não foi prejudicada.</p>
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p>O procedimento descrito é padrão do sistema. Os números que aparecem antes do ID do participante (individual ou equipe) são gerados automaticamente pela plataforma e não prejudicam a inscrição.</p>
        </div>
      </div>
    `,
    dataPublicacao: new Date("2025-09-18T12:30:00"),
    publicado: true
  },{
    titulo: "INSCRIÇÕES PRORROGADAS!",
    subtitulo: "Conforme publicação no Diário Oficial da Cidade de São Paulo (15/09/2025) foram prorrogadas as datas de inscrição e a data limite de submissão das propostas técnicas em nível Estudo Preliminar da Fase 1! Confira as novas datas: ",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <div class="flex flex-col text-justify">
          <p class="font-bold">De 08/09/2025 a <span class="text-red-500">22/09/2025 (nova data)</span>: </p>
          <p>Período de inscrições e submissão da documentação necessária para inscrição na plataforma digital online do concurso. </p>
          <p class="italic">Item de referência no Edital: 12.1</p>
        </div>
        <div class="flex flex-col text-justify">
          <p class="font-bold">30/09/2025 (nova data): </p>
          <p>1ª Publicação da lista de IDs deferidos e habilitados para participar no concurso. </p>
          <p class="italic">Item de referência no Edital: 12.3.1.3 </p>
        </div>
        <div class="flex flex-col text-justify">
          <p class="font-bold">10/10/2025 (nova data): </p>
          <p>Publicação final da lista de IDs deferidos para submissão das Propostas Técnicas em nível de Estudo Preliminar (FASE 1). </p>
          <p class="italic">Item de referência no Edital: 12.3.1.5 </p>
        </div>
        <div class="flex flex-col text-justify">
          <p class="font-bold text-red-500">De 13/10/2025 a 27/10/2025 (nova data): </p>
          <p class="font-bold">Período de submissão das Propostas Técnicas em nível de Estudo Preliminar (FASE 1). </p>
          <p class="italic">Item de referência no Edital: 13.1 </p>
        </div>
        <div class="flex flex-col text-justify">
          <p class="font-bold">03/11/2025 (nova data): </p>
          <p>Publicação da lista de IDs deferidos para julgamento das Propostas Técnicas em nível de Estudo Preliminar (FASE 1). </p>
          <p class="italic">Item de referência no Edital: 13.2 </p>
        </div>
        <div class="flex flex-col text-justify">
          <p class="font-bold">De 10/11/2025 (nova data) a 23/11/2025: </p>
          <p>Período de análise individual das Propostas Técnicas em nível de Estudo Preliminar pelos membros da Comissão Julgadora (FASE 1). </p>
          <p class="italic">Item de referência no Edital: 14.1 </p>
        </div>
      </div>
    `,
    dataPublicacao: new Date("2025-09-15T08:00:00"),
    publicado: true
  },{
    titulo: "3º Bloco de Respostas aos Pedidos de Esclarecimento ",
    subtitulo: "Publicado no Diário Oficial da Cidade de São Paulo em 15/09/2025, nos termos do Item 4 do Edital nº 001/SP-URB/2025: ",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p>A Ata nº 01 de Respostas aos pedidos de Esclarecimento da Coordenação do Concurso tratou de pedidos processados desde a abertura e publicação do Edital (25/08/2025) até o dia 05/09/2025 às 12h, que resultou na publicação do 1º Bloco de Respostas aos Pedidos de Esclarecimento no dia 08/09/2025, tanto no Diário Oficial da Cidade de São Paulo, quanto na Plataforma Digital Online do Concurso. </p>
        <p>A Ata nº 02 considerou os pedidos de esclarecimento processados entre o dia 05/09/2025 às 12h01 até a 10/09/2025 às 12h, que resultou na publicação do 2º Bloco de Respostas aos Pedidos de Esclarecimento no dia 11/09/2025, tanto no Diário Oficial da Cidade de São Paulo, quanto na Plataforma Digital Online do Concurso. </p>
        <p>A presente ata considera, portanto, os pedidos de esclarecimento processados entre o dia 10/09/2025 às 12h01 até 12/09/2025 às 12h. Neste período foram processados 4 (quatro) Pedidos de Esclarecimento recebidos diretamente via e-mail e 1 (um) pedido recebido via Plataforma Digital Online. </p>
        <p class="italic">Observação: Tal como feito nos Blocos 1 e 2 de Respostas aos Pedidos de Esclarecimento, para fins de publicação, as indicações de nomes, assinaturas e autoria dos pedidos (via e-mail ou via Plataforma Digital) foram suprimidos, para preservar o sigilo dos potenciais participantes.  </p>
        <p>Relacionamos a seguir os pedidos de esclarecimento, cada qual seguido de resposta redigida por esta Coordenação: </p>
        <div class="space-y-2 mt-4">
          <p class="font-bold">1. Pedido de Esclarecimento feito via E-MAIL processado em 10/09/2025:</p>
          <p>No Anexo VI - TERMO DE COMPROMISSO DE EXECUÇÃO DE PROTÓTIPOS E PROJETOS EM NÍVEL BÁSICO, deve ser inserido agora, ou somente após a classificação para FASE 2? O modelo é para ser preenchido apenas com os dados do responsável pela equipe ou deve possuir os dados de todos os participantes?</p>
          <p>No Anexo VIII -  TERMO DE CESSÃO DE DIREITOS AUTORAIS, deverá ser preenchido sem assinatura mesmo? Deve possuir todos os presentes da equipe ? Inserir agora ou na próxima fase que esse documento deverá ser apresentado?</p>
          <p class="font-bold">Resposta da Coordenação do Concurso: </p>
          <p>O Termo de Compromisso de Execução de Protótipos (Modelo - Anexo VI) é exigido somente para os classificados para a Fase 2 do Concurso e deve ser apresentado, nos termos de item 14.4.2.2 do Edital, com a totalidade dos documentos de habilitação em até 2 (dois) dias úteis após a publicação final da lista de pontuação da Fase 1 (item 14.3). O modelo deve ser preenchido apenas com os dados do responsável pelo projeto e representante legal da equipe. </p>
          <p>Nos termos do item 22.4 do Edital, o Termo de Cessão de Direitos Autorais (Modelo - Anexo VIII) deve ser apresentado pelos participantes vencedores, conhecidos quando da publicação da classificação final, nos termos do item 18.4. Conforme item 22.4.1.1 do Edital, em caso de participação em equipe, a critério dos participantes, poderá ser feito um único Termo com a qualificação e assinatura de todos os Autores e ou um Termo para cada um dos Autores com suas respetivas qualificações e assinaturas. Portanto a apresentação deste documento não deve ser feita no período de inscrições. </p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">2. Pedido de Esclarecimento feito via E-MAIL processado em 10/09/2025 (questão encaminhada em complemento ao questionamento processado e respondido no Bloco 2, item 5). </p>
          <p>Uma observação, estou me inscrevendo como pessoa Fisica, e esse documento que pelo que eu entendi é de pessoa juridica, mas no edital não está no mesmo local de pessoa juridica, então eu precisaria dele mesmo?</p>
          <p class="font-bold">Resposta da Coordenação do Concurso: </p>
          <p>A documentação de regularidade fiscal exigida nos termos do item 9.2 cabe também à Pessoa Física.  </p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">3. Pedido de Esclarecimento feito via E-MAIL processado em 11/09/2025. </p>
          <p>Referente ao item 8.7 do Edital, atualmente sou residente bolsista do PROGRAMA DE QUALIFICAÇÃO EM POLÍTICAS PÚBLICAS PARA ARQUITETOS E URBANISTAS da parceria entre CAU/SP e Prefeitura de São Paulo, meu contrato é diretamente com o CAU/SP e atuo na equipe de PLANURB da Secretaria Municipal de Urbanismo e Licenciamento (SMUL) como bolsista, nosso contrato terminará por volta do dia 06/10/2025, eu gostaria de saber se posso participar desse concurso? </p>
          <p class="font-bold">Resposta da Coordenação do Concurso: </p>
          <p>O caso relatado incide nas hipóteses previstas no item 8.7 do Edital (reproduzido nos modelos de Declarações Obrigatórias – Anexo I e II), estando o interessado impedido de participar do concurso. </p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">4. Pedido de Esclarecimento feito via Plataforma Digital processado em 11/09/2025: </p>
          <p>O item 1.5 do edital descreve três linhas temáticas para elaboração das propostas. Devemos atender a todas elas ou escolher entre elas? </p>
          <p class="font-bold">Resposta da Coordenação do Concurso: </p>
          <p>Nos termos do item 1.3 do Edital nº 001/SP-URB/2025, as propostas deverão contemplar as 3 (três) linhas temáticas. O grau de aderência das propostas à temática será avaliado pela Comissão Julgadora, conforme item 7 do Termo de Referência.  </p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">5. Pedido de Esclarecimento feito via e-mail processado em 12/09/2025: </p>
          <p>Li os esclarecimentos anteriores sobre esse tópico, mas, ainda assim, não compreendi totalmente. Gostaria de tirar uma dúvida sobre os grupos de mobiliário que deverão ser abrangidos. A pergunta seria: Todos os elementos e famílias dos 3 grupos deverão ser abrangidos, ou se tratam de sugestões? Isso é, cada grupo ou pessoa participante deverá produzir soluções que contemplem todas as seguintes capacidades: quiosque multiuso, sanitário público, totem multiuso, bebedouro, bancos, papeleiras, paraciclos, totem orientativo, guarda-copos, balizadores, floreira, vaso, elemento de sombreamento verde, tutor para plantas e protetor de raízes? Ou os grupos poderão escolher 1 elemento de cada um dos grupos para ser abrangido dentro do projeto? </p>
          <p class="font-bold">Resposta da Coordenação do Concurso: </p>
          <p>Tanto participantes inscritos individualmente quanto em equipe devem apresentar a totalidade dos elementos exigidos, contemplando integralmente os três grupos. Assim, reiteramos a resposta já apresentada na questão 4 do 1º Bloco (08/09/2025) e na questão 9 do 2º Bloco (11/09/2025) de respostas aos Pedidos de Esclarecimento: </p>
          <p>Conforme o item 1.3 do Edital nº 001/SP-URB/2025, é obrigatória a apresentação de propostas técnicas em ambas as fases do concurso para os elementos e famílias de elementos dos 3 (três grupos), conforme o item 1.3 do Edital nº 001/SP-URB/2025. </p>
          <p>Nos termos do item 7 do Termo de Referência e item 6.3 do Edital, é condição de desclassificação das propostas técnicas pela Comissão Julgadora a não apresentação da totalidade dos elementos exigidos, conforme item 1 do Edital (Do Objeto) e observado o contido no item 1.4, segundo o qual, as propostas poderão apresentar soluções integradas que agrupem, em um único elemento ou sistema, as funções atribuídas a dois ou mais elementos do mobiliário, desde que garantidas as funções de cada elemento obrigatório, conforme disposições do Termo de Referência. </p>
          <p>Portanto, a não apresentação de propostas técnicas dos elementos ou família de elementos relativos a um ou mais grupos, resultará em desclassificação. </p>
        </div>
      </div>
    `,
    dataPublicacao: new Date("2025-09-15T08:00:00"),
    publicado: true
  },{
    titulo: "ATENÇÃO PRÉ-INSCRITO!",
    subtitulo: "15/09/2025 é a data limite para finalizar sua inscrição, enviando a documentação necessária.",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p class="font-bold">Reforçamos que para o prosseguimento de sua inscrição, é necessário submeter via Plataforma Online <a class="bg-amber-100 p-1 rounded-md hover:opacity-70" href="https://concursomoburb.prefeitura.sp.gov.br/" target="_blank">https://concursomoburb.prefeitura.sp.gov.br/</a> os documentos necessários para inscrição até o dia <span class="text-red-500">15/09/2025</span>, conforme consta do Cronograma (item 21 do Edital).</p>
        <p>Caso não apresente os documentos, sua inscrição será indeferida. Caso já tenha apresentado, é possível ainda fazer uma conferência, complementando-os se necessário, até a data informada.</p>
        <p>Aqui nos <a class="bg-amber-100 p-1 rounded-md hover:opacity-70 font-bold" href="/informes" target="_blank">INFORMES</a>, você encontra informações importantes sobre o concurso e pode acessar os blocos de resposta aos pedidos de esclarecimento, nos termos do item 7.2 do Edital nº 001/SP-URB/2025. Já foram publicados 2 blocos de respostas aos pedidos de esclarecimento, observe abaixo.</p>
        <p>Fique atento e não perca essa chance de contribuir com novos projetos de Mobiliário Urbano para a Cidade de São Paulo!</p>
      </div>
    `,
    dataPublicacao: new Date("2025-09-11T13:00:00"),
    publicado: true
  },{
    titulo: "2º Bloco de Respostas aos Pedidos de Esclarecimento",
    subtitulo: "Publicado no Diário Oficial da Cidade de São Paulo em 11/09/2025, nos termos do Item 4 do Edital nº 001/SP-URB/2025:",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p>A Ata nº 01 de Respostas aos pedidos de Esclarecimento da Coordenação do Concurso tratou de pedidos processados desde a abertura e publicação do Edital (25/08/2025) até o dia 05/09/2025 às 12h, que resultou na publicação do 1º Bloco de Respostas aos Pedidos de Esclarecimento no dia 08/09/2025, tanto no Diário Oficial da Cidade de São Paulo, quanto na Plataforma Digital Online do Concurso.</p>
        <p>Assim, a presente ata considera os pedidos de esclarecimento processados entre o dia 05/09/2025 às 12h01 até a presente data (10/09/2025) às 12h. Neste período foram processados 10 (dez) Pedidos de Esclarecimento, sendo 5 (cinco) via Plataforma Digital Online do Concurso e 5 (cinco) recebidos diretamente via e-mail. Do total, 5 (cinco) dos pedidos foram agrupados no Tema “Documentos Necessários para Inscrição”; e 2 (dois) dos pedidos foram agrupados no Tema “Questões Operacionais da Plataforma” pois diziam respeito a questões sobre a utilização da plataforma digital pelos interessados, que foram respondidas diretamente por e-mail por esta Coordenação, respostas estas aqui transcritas.</p>
        <p class="italic">Observação: Tal como feito no Bloco 1 de Respostas aos Pedidos de Esclarecimento, para fins de publicação, as indicações de nomes, assinaturas e autoria dos pedidos (via e-mail ou via Plataforma Digital) foram suprimidos, para preservar o sigilo dos potenciais participantes.</p>
        <p>Relacionamos a seguir os pedidos de esclarecimento, cada qual seguido de resposta redigida por esta Coordenação:</p>
        <p class="font-bold mt-4">TEMA: DOCUMENTOS NECESSÁRIOS PARA INSCRIÇÃO (5 Pedidos de Esclarecimento)</p>
        <div class="space-y-2 mt-4">
          <p class="font-bold">1. Pedido de Esclarecimento feito via Plataforma Digital processado em 09/09/2025:</p>
          <p><strong>Texto: </strong> Em relação aos documentos, todos precisam estar em situação regular? Estou com problemas no CADIN municipal e não conseguiria resovler até o dia 15/09.</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">2.	Pedido de Esclarecimento feito via E-MAIL processado em 10/09/2025:</p>
          <p><strong>Texto: </strong>1. Irei me inscrever com mais uma pessoa (equipe) e como pessoas físicas, nesse caso é necessário que ambas as pessoas mandem todos os documentos necessários, ou apenas o responsável técnico, enquanto ela enviará apenas a declaração de participação em equipe?</p>
          <p>2. O CAU/CREA é necessário apenas para o responsável técnico, certo?</p>
          <p>3. Há alguma taxa de inscrição para o concurso? Procurei no edital e não achei nada sobre gratuidade ou taxas.</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">3.	Pedido de Esclarecimento feito via Plataforma Digital processado em 10/09/2025:</p>
          <p><strong>Texto: </strong> Os documentos para inscrição do item 9.2, incluindo a Carta de Declarações Obrigatórias, devem ser apresentados por todos os membros da equipe, ou somente pelo responsável pela inscrição?</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">4.	Pedido de Esclarecimento feito via E-MAIL processado em 10/09/2025:</p>
          <p><strong>Texto: </strong> Gostaria de esclarecer algumas dúvidas em relação à documentação de inscrição. Sobre a prova de regularidade fiscal do meu município, esse documento pode levar até 10 dias úteis para ser emitido. Caso não seja disponibilizado a tempo, o requerimento funcionaria temporariamente até a emissão?</p>
          <p>Quanto à documentação do CAU, apenas a Certidão de Registro é suficiente ou também é necessária a carteira do Conselho? No meu caso, não tenho a carteira, mas possuo o registro ativo.</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">5.	Pedido de Esclarecimento feito via E-MAIL processado em 10/09/2025:</p>
          <p><strong>Texto: </strong> [...] estou passando por um problema com um dos documentos solicitados para a inscrição: "Prova de regularidade fiscal para com a Fazenda Municipal do domicílio ou sede da interessada expedida pelo órgão competente;". Não entendi muito bem o que seria isso, mas ao ligar para a prefeitura, foi me dito que só existe a certidão negativa de débitos de IPTU, e a certidão negativa mobiliária (Cadastro CCM). Esse primeiro é necessário ter imóvel na cidade e eu não possuo, e o segundo o prazo para solicitação é de 8 dias úteis (o que ira ultrapassar a data de inscrição).</p>
          <p>Eu gostaria de confirmar se é algum desses documentos mesmo, e caso seja, há algo que eu posso fazer em relação a esse documento que o prazo é de 8 dias, como entregar depois ou algo assim?</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p>Em que pese a exigência de demonstração de regularidade perante o CADIN Municipal a Comissão esclarece que tal providência tem por objetivo a verificação da regularidade fiscal dos participantes em momento antecedente à realização do Concurso, sendo necessária a apresentação do documento com ou sem indicação de pendência fiscal (negativado ou positivado). No entanto, eventual situação de irregularidade não terá o condão de impedir a inscrição de qualquer candidato, ficando mantida tal exigência quando do pagamento dos prêmios. Isso se estende a todos os documentos de regularidade fiscal exigidos (itens 9.2.3, 9.2.4 e 9.2.5).</p>
          <p>Para o caso dos interessados (pessoa física residente ou pessoa jurídica sediada) no município de São Paulo, a prova de regularidade fiscal para com a Fazenda Municipal (item 9.2.4) corresponde ao Cadastro Informativo Municipal de São Paulo CADIN (item 9.2.5). Para municípios que eventualmente não possuam um cadastro único de informações fiscais, poderão ser apresentadas o documento ou conjunto de documentos equivalentes que atestem a situação fiscal, como certidões expedidas pelo órgão municipal competente.</p>
          <p>Caso não haja tempo hábil para emissão dos documentos de regularidade fiscal até a data limite das inscrições, serão admitidas provas que atestem a solicitação do documento perante o ente público competente (requerimento ou protocolo), mantida a exigência de apresentação final do documento que demonstre a regularidade quando do pagamento dos prêmios.</p>
          <p>Quanto à comprovação de registro no CAU, é suficiente a Certidão de Registro e Quitação emitida pelo Conselho. Tanto tal comprovação perante o CAU quanto documento equivalente perante o CREA deverá ser obrigatoriamente vinculado ao responsável técnico pelo projeto no momento da inscrição, não sendo exigidos para os demais membros da equipe, exceto em caso de corresponsabilidade técnica pelo projeto, devendo, neste caso, aos responsáveis técnicos apresentar a comprovação de registro e regularidade no CAU ou CREA.</p>
          <p>Para fins de inscrição, nos termos do 12.3 do Edital, o responsável técnico ou um dos responsáveis técnicos (em caso de responsabilidade compartilhada) deverá efetuar o cadastro, e encaminhar a documentação necessária, incluindo as Declarações Obrigatórias (Modelos: Anexo I – pessoa física ou Anexo II – pessoa jurídica) – de apresentação exclusiva do responsável técnico. Em caso de equipe apenas o Responsável Técnico (ou um dos responsáveis técnicos) será considerado o representante legal, sendo este responsável pelas ações da equipe. Aos demais membros da equipe, é exigido somente a apresentação da Declaração de participação na Equipe (Modelo: Anexo III).</p>
          <p>Nos termos do item 12.1 do Edital, a inscrição no Concurso é gratuita.</p>
        </div>
        <p class="font-bold mt-4">TEMA: QUESTÕES OPERACIONAIS DA PLATAFORMA (2 Pedidos de Esclarecimento)</p>
        <div class="space-y-2 mt-4">
          <p class="font-bold">6.	Pedido de Esclarecimento feito via E-MAIL processado em 09/09/2025:</p>
          <p><strong>Texto: </strong> Estou tentando realizar minha inscrição no formulário disponível no site da Prefeitura de São Paulo, porém não estou conseguindo concluir o preenchimento, pois o campo referente ao logradouro não fica habilitado.</p>
          <p>Ao inserir o meu CEP, correspondente ao município de xxxxxx, o sistema reconhece corretamente a cidade e a UF, mas não disponibiliza a opção de digitar o logradouro. Ressalto que em xxxxxxxxx há apenas um CEP geral, válido para todo o município, o que pode estar causando essa dificuldade.</p> 
          <p>Peço, por gentileza, orientação sobre como proceder para concluir minha inscrição corretamente.</p>
          <p class="font-bold">Resposta da Coordenação do Concurso enviada por e-mail ao interessado:</p>
          <p>Prezado interessado.</p>
          <p>Obrigado por nos alertar sobre esse problema que você encontrou.</p>
          <p>Já acionamos a equipe de desenvolvimento que prontamente o resolveu.</p>
          <p>Solicitamos que tente novamente efetuar a inscrição.</p>
          <p>Caso tenha algum outro problema, não deixe de nos contatar novamente.</p>
          <p>Atenciosamente,</p>    
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">7.	Pedido de Esclarecimento feito via Plataforma Digital processado em 09/09/2025:</p>
          <p><strong>Texto: </strong> Boa tarde, meu ID está aparecendo como inválido .. nao consigo entrar na área de participação.</p>
          <p class="font-bold">Resposta da Coordenação do Concurso enviada por e-mail ao interessado:</p>
          <p>Prezado Interessado,</p>
          <p>Registramos sua indicação de eventual problema de funcionalidade da plataforma e encaminhamos à equipe de desenvolvimento que procedeu com a seguinte orientação:</p>
          <p>O acesso à área restrita é feito preenchendo em "login" o e-mail cadastrado e em "senha", a senha cadastrada. Durante o cadastro inicial, um e-mail é enviado para o e-mail cadastrado com a senha de acesso inicial. Após o primeiro login, você deverá alterar a sua senha por uma senha da sua escolha.</p>
          <p>Pedimos que verifique se dessa forma consegue acessar a área restrita.</p>
        </div>
        <p class="font-bold mt-4">DEMAIS PEDIDOS DE ESCLARECIMENTO NÃO AGRUPADOS POR TEMA:</p>
        <div class="space-y-2 mt-4">
          <p class="font-bold">8.	Pedido de Esclarecimento feito via Plataforma Digital processado em 09/09/2025:</p>
          <p><strong>Texto: </strong>Como seria a entrega da proposta técnica e estudo preliminar, seria já o projeto? É um prazo bem apertado, gostaria de saber o nível de detalhe a ser entregue.</p>
          <p>Estou tentando realizar minha inscrição no formulário disponível no site da Prefeitura de São Paulo, porém não estou conseguindo concluir o preenchimento, pois o campo referente ao logradouro não fica habilitado.</p>
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p>As propostas técnicas deverão ser desenvolvidas conforme prazos e determinações constantes do Edital nº 001/SP-URB/2025 e Termo de Referência. O item 6 "Normas de Apresentação das Propostas" do Termo de Referência orienta o participante quanto ao conteúdo técnico a ser apresentado em cada uma das fases do concurso, sendo tratadas no item 6.1 "Fase 1: Estudo Preliminar", as orientações específicas para a apresentação da proposta técnica em nível de Estudo Preliminar.</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">9.	Pedido de Esclarecimento feito via E-MAIL processado em 09/09/2025:</p>
          <p><strong>Texto: </strong> Não ficou claro para mim quanto a quantidade de elementos que devem ser apresentados.</p>
          <p>Seria alguma dessas opções:</p>
          <ol class="list-decimal list-inside space-y-2">
            <li>Todos os grupos (todos os elementos)</li>
            <li>Escolher um grupo e apresentar todos os elementos dentro dele</li>
            <li>Escolher um grupo e apresentar apenas uma família ou elemento dentro dele</li>
          </ol> 
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p>Conforme o item 1.3 do Edital nº 001/SP-URB/2025, é obrigatória a apresentação de propostas técnicas em ambas as fases do concurso para os elementos e famílias de elementos dos 3 (três grupos).</p>
          <p>Nos termos do item 7 do Termo de Referência e item 6.3 do Edital, é condição de desclassificação das propostas técnicas pela Comissão Julgadora a não apresentação da totalidade dos elementos exigidos, conforme item 1 do Edital (Do Objeto) e observado o contido no item 1.4, segundo o qual, as propostas poderão apresentar soluções integradas que agrupem, em um único elemento ou sistema, as funções atribuídas a dois ou mais elementos do mobiliário, desde que garantidas as funções de cada elemento obrigatório, conforme disposições do Termo de Referência.</p>
          <p>Portanto, a não apresentação de propostas técnicas dos elementos ou família de elementos relativos a um ou mais grupos, resultará em desclassificação.</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">10. Pedido de Esclarecimento feito via Plataforma Digital processado em 09/09/2025:</p>
          <p><strong>Texto: </strong>Qual a finalidade e onde podemos utilizar esse certificado?</p>
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p>A finalidade é atestar a participação ou premiação no Concurso, nos termos do item 4.2.9 do Edital. Fica a critério do participante a utilização do certificado para fins variados, atendida a legislação aplicável.</p>
        </div>
      </div>
    `,
    dataPublicacao: new Date("2025-09-11T12:00:00"),
    publicado: true
  },
  {
    titulo: "Comissão Julgadora ",
    subtitulo: "Resumo Curricular dos Membros",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <div class="space-y-2 mt-4">
          <p class="font-bold">Titulares:</p>
          <ol class="list-decimal list-inside space-y-2">
            <li><strong>Luiza Vidotto Bernardo:</strong> Arquiteta e Urbanista pela USP e especialista em Gestão de Projetos pela PUC, atua nas interseções entre design e espaço, com experiência em design de ambientes, arquiteturas efêmeras e design gráfico. Fez intercâmbio acadêmico na UNAM, Cidade do México. Pesquisa aspectos sensíveis da experiência urbana latino-americana, narrativas visuais e cartografias poéticas. Integrou a equipe do pavilhão da FA-UNAM no Festival Mextrópoli (2019). Participou de projetos colaborativos de arquitetura pneumática, junto ao Coletivo Inflou (2018, 2019, 2022 e 2023). Desenvolveu trabalhos que receberam o iF Design Award (2023 e 2024), o LAD Awards (2024) e o Design for a Better World (2024), além de terem sido selecionados na 9° Bienal Iberoamericana de Diseño e na 14º Bienal Brasileira de Design.</li>
            <li><strong>Andrea Perez de Souza Moraes:</strong> Arquiteta e Urbanista formada pela FAUUSP e Especialista em Arquitetura da Paisagem pelo Senac. Trabalha na Prefeitura de São Paulo desde 2002. Atualmente é Assessora Técnica na Assessoria Técnica de Obras e Serviços da Secretaria Municipal das Subprefeituras. Participou da criação e implantação dos Plays Lúdicos em praças do município voltados para crianças da primeira Infância. Tem participado, desde 2019 até hoje da adaptação dos passeios públicos para a acessibilidade e desenho universal, inseridos na PEC- Plano Emergencial de Calçadas. Sua experiência inclui a criação e manutenção de inúmeras praças e implantação de alguns parques lineares, entre 2005 e 2012.</li>
            <li><strong>Silvana Serafino Cambiaghi:</strong> Arquiteta, Mestre em Desenho Universal pela FAU/USP; uma das fundadoras da Comissão Permanente de Acessibilidade de São Paulo (CPA), atual presidente da Comissão representando o Conselho de Arquitetura e Urbanismo de São Paulo – CAUSP que é Conselheira Estadual. Coordenadora da Pós Arquitetura Humanizada, Acessibilidade e ambientes Sustentáveis da USCS, e dos cursos de Acessibilidade da Associação Brasileira de Normas Técnicas - ABNT Foi Comentarista da Rádio Eldorado sobre Desenho Universal. Ministra palestras no Brasil e no exterior, ganhando em 2000, o prêmio internacional “Horizontes que convergem” conferido pela Universidad de Guanajuato (México). Ganhou o 22º Prêmio Design do Museu da Casa Brasileira em 2008 com a autoria do livro, “Desenho Universal: Métodos e Técnicas para arquitetos e Urbanistas” - editora Senac. Socia Diretora da “Design Universal Consultoria”.</li>
            <li><strong>Lucas Lavecchia de Gouvêa:</strong> Formado em arquitetura e urbanismo e pós-graduado em sociedade, cultura e educação pela escola de sociologia política. Atua na Secretaria do Verde e do Meio Ambiente (SVMA), onde desenvolve projetos de destaque voltados à sustentabilidade, requalificação e implantação de parques, com visão social voltada à inclusão e ao acesso democrático ao espaço público.</li>
            <li><strong>Aparecida Regina Lopes Monteiro:</strong> Arquiteta Urbanista, pela FAU de Braz Cubas, Gerente de Cidades pela FAAP – Faculdades Armando Álvares Penteado, especialista em Direito Urbanístico pela Faculdade de Direito São Francisco da Universidade de São Paulo. Trabalha na Prefeitura do Município de São Paulo desde 1976 onde coordenou trabalhos como a elaboração de Código de Obras e Polos Geradores de Tráfego e Plano Diretor da Cidade entre outros de interesse público. Atuou na Câmara Municipal como Assessora Tecnica Legislativa de 1993 a 2000 e na Assembleia Legislativa de 2001 a 2002. Foi Diretora de Meio Ambiente e Paisagem Urbana da então EMURB – Empresa Municipal de Urbanização de 2005 até 2012. Em fevereiro de 2010 foi nomeada Presidente da CPPU - Comissão de Proteção à Paisagem Urbana de São Paulo e permaneceu até dezembro de 2012. Como atividade pessoal e de cidadania atuou no Movimento de Defesa de São Paulo e foi presidente por (5) cinco anos. Atualmente é Superintendente de Paisagem Urbana da São Paulo Urbanismo - SPUrbanismo e novamente foi nomeada presidente da CPPU - Comissão de Proteção à Paisagem Urbana de São Paulo onde permanece até hoje e cujas atividades consistem em desenvolver políticas públicas para garantir a qualidade de vida dos cidadãos através de projetos urbanos inclusivos e democráticos expressando a beleza e harmonia que promovem a estética da cidade.</li>
            <li><strong>Beatriz Messeder Sanches Jalbut:</strong> Arquiteta com bacharelado em Arquitetura e Urbanismo pela FAAP. Especialização em restauro, intervenção e conservação de bens patrimoniais pela Unicamp. Durante a fase acadêmica, realizou estudo sobre patrimônio e design na Florence University of Arts na Itália e curso presencial sobre a história da arquitetura e o desenvolvimento urbano de Boston em Harvard. Aprimorou os conhecimentos na área de planejamento urbano e regulação de cidades pelo Insper. Interessada especialmente na área de urbanismo, patrimônio histórico, legislação, obras, consultorias e projetos, trabalhou como arquiteta residente e gestora de contratos na Concrejato Obras Especiais. Foi sócia do escritório de projetos Studio ArquitetUras, e atualmente a frente da coordenação técnica do Conselho de Política Urbana da Associação Comercial de São Paulo que atua na área de consultoria em legislação urbana, planejamento e urbanismo, além de ser professora convidada no curso de Especialização em Legalização de Imóveis e Aprovação de Projetos da UNINOVE.</li>
            <li><strong>Marcelo Consiglio Barbosa:</strong> Formou-se pela FAU/Mackenzie em 1984 e é mestre em Projeto de Edificações pela FAU/USP (2001) e doutor pela FAU/Mackenzie (2012) com a tese “Adolf Franz Heep – Um Arquiteto Moderno”. Lecionou na Universidade Presbiteriana Mackenzie de 2005 à 2023 na cadeira de projetos. Autor do livro Adolf Franz Heep – Um Arquiteto Moderno, Editora Monolito (2017). Ex Vice-presidente e atual Conselheiro da AsBEA/São Paulo (2012/atual) Criador do Podcast Betoneira junto com André Scarpa desde 2021 a atual. Desde 1992 tem o escritório de arquitetura e design Bacco Arquitetos Associados junto com Jupira Corbucci.</li>
          </ol>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">Suplentes:</p>
          <ol class="list-decimal list-inside space-y-2">
            <li><strong>André de Paula Andreis:</strong> Arquiteto e urbanista formado pela UNESP (2014) e mestre em Gestão e Políticas Públicas pela FGV/EAESP (2021). Atualmente é assessor técnico e chefe do Núcleo de Desenho Urbano da SPUrbanismo, onde coordena equipe e desenvolve projetos estratégicos de requalificação urbana. Sua experiência inclui a concepção e execução de projetos para espaços públicos e mobiliário urbano, elaboração de planos de intervenção voltados à mobilidade ativa, sustentabilidade e ao uso democrático da cidade. Participou de iniciativas como o Programa Vila Reencontro, Territórios Educadores, Centro Aberto, Urbanismo Tático no Minhocão, Requalificação dos Calçadões do Centro Histórico, Programa de Parklets Municipais. Atuou ainda pelo Fundo Social de São Paulo do Governo do Estado de São Paulo, contribuindo para a concepção, projeto e execução de unidades do Programa Praças da Cidadania, voltado à integração social e oferta de serviços públicos em áreas vulneráveis.</li>
            <li><strong>Renato Salgado:</strong> Arquiteto (formado pela FAUUSP - Faculdade de Arquitetura e Urbanismo da Universidade de São Paulo, em 1987). Em 2013, obteve mestrado com pesquisa em projetos de sinalização em parques urbanos, no departamento de Design e Arquitetura da mesma FAUUSP. Trabalha com design há mais de 35 anos. À frente da Zol Design, empresa fundada em 1997 e dirigida por ele desde então, desenvolve, com uma equipe multidisciplinar, amplos projetos de comunicação visual em sinalização, design ambiental, digital e gráfico, atendendo demandas de diversos segmentos: governamentais, corporativo, cultural e educacional. Representante titular do IAB-SP (Instituto de Arquitetos do Brasil, filial de São Paulo) na CPPU (Comissão de Proteção da Paisagem Urbana) da Secretaria de Desenvolvimento Urbano Municipal da cidade de São Paulo, de julho de 2013 a março de 2017. Consultor em design e identidade cultural em projetos transdisciplinares, também atua como professor de design ambiental, notadamente de sinalização e projeto de exposições em graduação e pós-graduação em várias universidades brasileiras.</li>
          </ol>
        </div>
      </div>
    `,
    dataPublicacao: new Date("2025-09-08T11:00:00"),
    publicado: true
  },
  {
    titulo: "1º Bloco de Respostas aos Pedidos de Esclarecimento",
    subtitulo: "Publicado no Diário Oficial da Cidade de São Paulo em 08/09/2025, nos termos do Item 4 do Edital nº 001/SP-URB/2025:",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <p>Desde a publicação do Edital até a presente data (05/09/2025 às 12h), foram processados 6 Pedidos de Esclarecimento, sendo 4 via Plataforma Digital Online do Concurso e 2 recebidos diretamente via e-mail. Relacionamos a seguir os pedidos de esclarecimento, cada qual seguido de resposta redigida por esta Coordenação:</p>
        <div class="space-y-2 mt-4">
          <p class="font-bold">1. Pedido de Esclarecimento feito via Plataforma Digital processado em 27/08/2025:</p>
          <p><strong>Texto: </strong> Sou tecnóloga em construção de edifícios pela Fatec ,com CREA ativo ,posso participar? Faço engenha civil ,porém só concluo em 2026</p>
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p>Nos termos do item 8.3.4.2 do Edital nº 001/SP-URB/2025, não há a exigência quanto à formação acadêmica em relação aos demais membros da equipe, mantendo-se a exigência para o responsável técnico, enquanto representante legal pelo projeto correspondente à proposta técnica, sendo obrigatoriamente um(a) arquiteto(a) e urbanista regularmente registrado(a) no Conselho de Arquitetura e Urbanismo – CAU ou um(a) engenheiro(a) regularmente registrado(a) no Conselho Regional de Engenharia e Agronomia - CREA nos termos do item 8.3.1, no momento da inscrição.</p>
          <p>Portanto, tecnólogos(as) em construção de edifícios e profissionais de outras disciplinas, tanto como pessoa física quanto jurídica, podem participar como membros da equipe, devendo, para tanto, declarar sua participação por meio de Declaração de Participação na Equipe, conforme modelo constante do ANEXO III do Edital, nos termos do item 8.3.4, sem prejuízo da apresentação dos demais documentos necessários.</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">2. Pedido de Esclarecimento feito via Plataforma Digital processado em 29/08/2025:</p>
          <p><strong>Texto: </strong> Sou designer de produto. posso participar do concurso? se sim, quais documentos eu preciso apresentar?</p>
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p>Nos termos do item 8.3.4.2 do Edital nº 001/SP-URB/2025, não há a exigência quanto à formação acadêmica em relação aos demais membros de uma equipe, desde que se mantenha a exigência para o responsável técnico, enquanto representante legal pelo projeto correspondente à proposta técnica, sendo este obrigatoriamente um(a) arquiteto(a) e urbanista registrado(a) no Conselho de Arquitetura e Urbanismo – CAU ou um(a) engenheiro(a) registrado(a) no Conselho Regional de Engenharia e Agronomia - CREA nos termos do item 8.3.1. Portanto, designers de produtos e profissionais de outras disciplinas, tanto como pessoa física quanto jurídica, podem participar como membros da equipe, devendo, para tanto, declarar sua participação por meio de Declaração de Participação na Equipe, conforme modelo constante do ANEXO III do Edital, nos termos do item 8.3.4, sem prejuízo da apresentação dos demais documentos necessários.</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">3. Pedido de Esclarecimento feito via Plataforma Digital processado em 02/09/2025:</p>
          <p><strong>Texto: </strong> Podem formar parte da equipe pessoas não brasileiras?</p>
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p>Os profissionais que se enquadram no item 8.3.4.2 do Edital nº 001/SP-URB/2025, enquanto representante legal pelo projeto correspondente à proposta técnica, sendo este obrigatoriamente um(a) arquiteto(a) e urbanista regularmente registrado(a) no Conselho de Arquitetura e Urbanismo – CAU ou um(a) engenheiro(a) regularmente registrado(a) no Conselho Regional de Engenharia e Agronomia - CREA nos termos do item 8.3.1, podem participar como membros da equipe, devendo, para tanto, declarar sua participação por meio de Declaração de Participação na Equipe, conforme modelo constante do ANEXO III do Edital, nos termos do item 8.3.4, sem prejuízo da apresentação dos demais documentos necessários.</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">4. Pedido de Esclarecimento feito via e-mail processado em 02/09/2025:</p>
          <p><strong>Texto: </strong> Gostaria de solicitar um esclarecimento a respeito do edital, especificamente quanto à divisão em três grupos. Não ficou claro se as propostas devem obrigatoriamente contemplar os três grupos ou se é possível escolher apenas um deles para o desenvolvimento da proposta.</p>
          <p>Por exemplo, tenho interesse no Grupo 3 – Paisagem, ambientação e adaptação climática. Nesse caso, a minha proposta pode se restringir exclusivamente a este grupo?</p>
          <p>Agradeço desde já pela atenção e aguardo o vosso retorno.</p>
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p>Conforme o item 1.3 do Edital nº 001/SP-URB/2025, é obrigatória a apresentação de propostas técnicas em ambas as fases do concurso para os elementos e famílias de elementos dos 3 (três grupos).</p>
          <p>Nos termos do item 7 do Termo de Referência e item 6.3 do Edital, é condição de desclassificação das propostas técnicas pela Comissão Julgadora a não apresentação da totalidade dos elementos exigidos, conforme item 1 do Edital (Do Objeto) e observado o contido no item 1.4, segundo o qual, as propostas poderão apresentar soluções integradas que agrupem, em um único elemento ou sistema, as funções atribuídas a dois ou mais elementos do mobiliário, desde que garantidas as funções de cada elemento obrigatório, conforme disposições do Termo de Referência.</p>
          <p>Portanto, a não apresentação de propostas técnicas dos elementos ou família de elementos relativos a um ou mais grupos, resultará em desclassificação.</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">5. Pedido de Esclarecimento feito via e-mail processado em 02/09/2025:</p>
          <p><strong>Texto: </strong> Boa tarde! Venho por meio deste solicitar os esclarecimentos abaixo, visto não ter obtido sucesso através do site:</p>
          <p>1) Sobre o Anexo VII, do TERMO DE CESSÃO DE DIREITOS AUTORAIS, itens 4, 5 e 6, respectivamente:</p>
          <p>"nas hipóteses de adaptações e adequações dos PROJETOS"</p>
          <p>"podendo qualquer um deles reutilizar os planos ou projetos originais para outras áreas ou localidades além daquela para a qual foram originalmente feitos, com as adaptações técnicas que considerar necessárias, independentemente de qualquer autorização ou remuneração do CEDENTE pela subcessão ou reutilização."</p>
          <p>"O CEDENTE se compromete a não fazer o aproveitamento substancial dos PROJETOS em outros projetos que venha a elaborar, de modo a preservar a originalidade dos serviços, salvo com autorização do CESSIONÁRIO"</p>
          <p>Nos trechos acima destacados o autor do projeto é cedente dos direitos autorais do projeto ao cessionário, podendo este livremente modificá-lo ou autorizar terceiros a fazê-lo. Considerando que a autoria é indissociável de seu autor, ainda que tenha seus direitos patrimoniais cedidos, gostaria de entender como a organização do concurso vê a questão das alterações a revelia frente ao Código de Ética ao qual respondem os Arquitetos e Urbanistas em seu item: "3.2.9. O arquiteto e urbanista deve declarar-se impedido de assumir a autoria de trabalho que não tenha realizado, bem como de representar ou ser representado por outrem de modo falso ou enganoso."</p>
          <p>2) Sobre a preservação da originalidade do projeto, não pude compreender como ela estaria preservada pelo cessionário (além do cedente) se estará sujeita a adaptações e reutilizações à revelia do autor. Poderiam explicar melhor este ponto?</p>
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p class="font-bold">Resposta à Questão 1:</p>
          <p>Em análise ao pedido de esclarecimento, à luz do conteúdo do Anexo VIII do Edital e da legislação que o ampara – notadamente a da Lei Federal 13.303/2016 e as normativas do Regulamento de Licitações e Contratos da SP URBANISMO (NP 58.04) – entendemos que, embora seja obrigatória a cessão dos direitos patrimoniais e autorais (artigo 80 da Lei 13.303/2016 e item 4.5.4 da NP 58.04), em caso de alteração dos projetos vencedores por parte do Cessionário, deve-se assegurar as condições de consentimento pelo autor original acerca da alteração projetual precedida do registro de Responsabilidade Técnica relativa à alteração, resultando-se em obra de autoria e responsabilidade da Cessionária ou de coautoria e corresponsabilidade entre autor original e cessionária, nos termos da Resolução nº 67 do CAU/BR, referenciada no item 22.4 do Edital nº 001/SP-URB/2025.</p>
          <p>Na medida em que o Edital relaciona a Resolução nº 67 do CAU/BR às disposições de cessão de direitos, carregando assim os procedimentos aplicáveis na aludida Resolução, entendemos assistir razão ao questionamento a respeito das alterações projetuais pelo Cessionário, tal como indicado no item 5 do Anexo VIII do Edital, evidenciando a ocorrência de erro material na exigência, motivo pelo qual é de rigor a supressão do trecho “autorização ou”, sendo considerada para os devidos fins a seguinte redação, sem a republicação do edital e devolução dos prazos, posto que não se vislumbra qualquer violação à lei e aos princípios que regem o concurso:</p>
          <p>5. O CESSIONÁRIO poderá subceder livremente a PROPOSTA/PROJETOS a terceiros, em particular à Prefeitura do Município de São Paulo, no todo ou em parte, podendo qualquer um deles reutilizar os planos ou projetos originais para outras áreas ou localidades além daquela para a qual foram originalmente feitos, com as adaptações técnicas que considerar necessárias, independentemente de qualquer remuneração do CEDENTE pela subcessão ou reutilização.</p>
          <p class="font-bold">Resposta à Questão 2:</p>
          <p>Diante da resposta direcionada à questão anterior, as alterações ou adaptações deverão observar os procedimentos previstos na Resolução nº 67 do CAU/BR, tal como indicado no item 22.4.</p>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">6. Pedido de Esclarecimento feito via Plataforma Digital processado em 04/09/2025:</p>
          <p>Desde a publicação do Edital até a presente data (05/09/2025 às 12h), foram processados 6 Pedidos de Esclarecimento, sendo 4 via Plataforma Digital Online do Concurso e 2 recebidos diretamente via e-mail. Relacionamos a seguir os pedidos de esclarecimento, cada qual seguido de resposta redigida por esta Coordenação:</p></p>
          <p><strong>Texto: </strong> Olá! É permitido utilizar elementos já existentes da cidade, como por exemplo o grafismo das calçada?</p>
          <p class="font-bold">Resposta da Coordenação do Concurso:</p>
          <p>O objeto do concurso é definido no item 1 do Edital nº 001/SP-URB/2025. A elaboração das propostas técnicas para os elementos exigidos no item 1 deve seguir as devidas disposições legais e normativas pertinentes e o contido no Termo de Referência, especialmente quanto ao item 8 (Diretrizes Específicas para as Propostas Técnicas). A definição conceitual, o partido adotado, a materialidade, bem como demais soluções apresentadas nas propostas são de responsabilidade do proponente, sendo avaliadas pela comissão julgadora segundo os critérios definidos no item 6 do Edital e 7 do Termo de Referência.</p>
        </div>
      </div>
    `,
    dataPublicacao: new Date("2025-09-08T11:00:00"),
    publicado: true
  },
  {
    titulo: "Comissão Julgadora",
    subtitulo: "Composição de membros titulares e suplentes, nos termos do Item 5 do Edital nº 001/SP-URB/2025. Publicada no Diário Oficial da Cidade de São Paulo em 08/09/2025",
    conteudo: `
      <div class="flex flex-col gap-4 text-justify">
        <div class="space-y-2 mt-4">
          <p class="font-bold">Titulares:</p>
          <ol class="list-decimal list-inside space-y-2">
            <li><strong>Luiza Vidotto Bernardo</strong> (indicada da São Paulo Urbanismo, RF 0060771);</li>
            <li><strong>Andrea Perez de Souza Moraes</strong> (indicada da Secretaria Municipal das Subprefeituras - SMUSUB, RF 7273193);</li>
            <li><strong>Silvana Serafino Cambiaghi</strong> (indicada da Comissão Permanente de Acessibilidade - CPA, CAU A9030-1);</li>
            <li><strong>Lucas Lavecchia de Gouvêa</strong> (indicado da Secretaria Municipal do verde e Meio Ambiente - SVMA, RF 8254125);</li>
            <li><strong>Aparecida Regina Lopes Monteiro</strong> (indicada da Comissão de Proteção da Paisagem Urbana - CPPU, RF 0059471);</li>
            <li><strong>Beatriz Messeder Sanches Jalbut</strong> (indicada da Associação Comercial de São Paulo - ACSP, CAU-SP A83664-8);</li>
            <li><strong>Marcelo Consiglio Barbosa</strong> (indicado da Associação Brasileira dos Escritórios de Arquitetura de São Paulo - AsBEA-SP, CAU-SP A11372-7);</li>
          </ol>
        </div>
        <div class="space-y-2 mt-4">
          <p class="font-bold">Suplentes:</p>
          <ol class="list-decimal list-inside space-y-2">
            <li><strong>André de Paula Andreis</strong> (indicado da São Paulo Urbanismo, RF 0060453);</li>
            <li><strong>Renato Salgado</strong> (indicado da Secretaria Municipal de Urbanismo e Licenciamento - SMUL, CAU A85963-0);</li>
          </ol>
        </div>
      </div>
    `,
    dataPublicacao: new Date("2025-09-08T11:00:00"),
    publicado: true
  }];
  const agora = new Date();
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
      <div className="relative w-[90%] lg:w-[800px] mx-auto gap-12 flex flex-col my-4">
        <Separator
          orientation="vertical"
          className="bg-muted absolute left-2 top-4"
        />
        {informes.map((entry, index) => (
          entry.publicado && agora >= entry.dataPublicacao && <InformeComponent key={index} informe={entry} />
        ))}
      </div>
    </div>
  );
};
