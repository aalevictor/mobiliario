"use client"

import { Data, Sobre } from "@/components/icones";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";

export default function Informacoes() {
  const [value, setValue] = useState<string | undefined>(undefined)
  return (
    <section className="w-[90%] lg:w-[600px] mx-auto" id="info" role="region" aria-labelledby="info-heading">
        <h2 id="info-heading" className=" text-[#3B2D3A] intersect:motion-preset-slide-up motion-delay-150 text-2xl md:text-3xl font-bold text-center mb-8 uppercase">
            Informações do Concurso
        </h2>
        <Accordion
            type="single"
            collapsible
            className="space-y-4"
            value={value}
            onValueChange={setValue}
            aria-label="Informações detalhadas do concurso"
        >
            <div
                className={`w-full flex flex-col gap-4 p-[3px] ${value === "item-1" ? "bg-[#D0DBBF]" : ""}`}
                style={{
                    clipPath:
                    "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                }}
            >
                <AccordionItem
                    value="item-1"
                    className={`border rounded-lg intersect:motion-preset-slide-up motion-delay-150 ${value === "item-1" ? "bg-white" : ""}`}
                    style={value === "item-1" ? {
                        clipPath:
                        "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                    } : {}}
                >
                    <AccordionTrigger
                        id="cronograma"
                        className={`py-2 px-4 flex gap-3 items-center ${value === "item-1" ? "bg-transparent" : "bg-[#D0DBBF]"}`}
                        style={{
                            clipPath:
                            "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                        }}
                        aria-expanded={value === "item-1"}
                    >
                        <div className=" flex items-center w-full">
                            <h3 className="font-semibold text-xl w-full text-start text-[#3B2D3A]">
                            Sobre
                            </h3>
                            <Sobre aria-hidden="true" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-9 py-4">
                        <div role="region" aria-labelledby="sobre-content">
                            <p className="text-muted-foreground text-justify">
                                A SP Urbanismo, com apoio da Secretaria Municipal de Urbanismo e Licenciamento SMUL, 
                                anuncia a realização do <strong>CONCURSO NACIONAL DE PROJETOS PARA ELEMENTOS DE MOBILIÁRIO URBANO DA 
                                CIDADE DE SÃO PAULO</strong>, que dará continuidade às ações de qualificação dos espaços públicos da cidade. 
                                A iniciativa surge a partir das diretrizes estabelecidas pelo Grupo de Trabalho Intersecretarial 
                                de Mobiliário e Elementos Urbanos (GT MEU), instituído pela Portaria SGM nº 90/2025, e busca reunir 
                                propostas inovadoras que respondam às demandas contemporâneas da vida urbana.
                            </p>
                            <p className="text-muted-foreground mt-2 text-justify">
                                O concurso está estruturado em três eixos temáticos que orientam o desenvolvimento das propostas:
                            </p>
                            <ol className="text-muted-foreground list-disc pl-5 space-y-1 mt-2 text-justify">
                                <li><strong>Eixo 1 – Diversidade dos territórios e identidade paulistana</strong> busca reconhecer a pluralidade dos 
                                contextos urbanos da cidade e, ao mesmo tempo, revelar um traço unificador que simbolize a identidade 
                                coletiva de São Paulo.</li>
                                <li><strong>Eixo 2 – Inclusão e integração das atividades no espaço público</strong> visa promover 
                                o uso democrático do espaço urbano, oferecendo soluções que acolham diferentes corpos, idades e modos 
                                de vida, incentivando a convivência e a interação nas atividades cotidianas.</li>
                                <li><strong>Eixo 3 – Adaptação 
                                climática e sustentabilidade</strong> incentiva soluções de baixo impacto ambiental que respondam de forma 
                                adaptativa às mudanças do clima, contribuindo para o conforto ambiental urbano e mitigando os efeitos 
                                negativos de eventos extremos.</li>
                            </ol>
                            <p className="text-muted-foreground mt-2 text-justify">
                                As propostas deverão contemplar três grupos de mobiliário urbano, definidos de acordo com sua função 
                                e relação com a infraestrutura urbana:
                            </p>
                            <ol className="text-muted-foreground list-disc pl-5 space-y-1 mt-2 text-justify">
                                <li><strong>Grupo 1 – Utilidade Pública com infraestrutura integrada</strong> inclui elementos 
                                cuja funcionalidade depende de conexão a abastecimento de água, energia e/ou coleta de esgoto, 
                                sendo compostos por: família de Quiosque Multiuso (Quiosque de Médio Porte e Quiosque de Grande Porte), 
                                Sanitário Público, família de Totem Multiuso (Totem Marco Referencial e Totem de Apoio) e Bebedouro.</li>
                                <li><strong>Grupo 2 – Descanso, Convívio, Proteção e Utilidade Pública sem infraestrutura 
                                integrada</strong> reúne o mobiliário tradicional dos espaços públicos, que não depende de redes 
                                infraestruturais, incluindo: família de Bancos (Banco coletivo sem encosto; Banco coletivo com encosto; 
                                Banco coletivo com encosto e apoios de braço laterais), família de Papeleiras (Individual e Dupla), 
                                família de Paraciclos (Unitário e Conjunto), Totem Orientativo, família de Guarda-Corpos (fixo e móvel) 
                                e família de Balizadores (Flexível e Sólido).</li>
                                <li><strong>Grupo 3 – Paisagem, ambientação e adaptação climática</strong> contempla elementos que 
                                contribuem para a melhoria da qualidade ambiental e microclimática dos espaços públicos, sem necessidade 
                                de integração às redes de infraestrutura, incluindo: Floreira, Vaso, Elemento de Sombreamento Verde, 
                                Tutor para plantas e Protetor de Raízes.</li>
                            </ol>
                            <p className="text-muted-foreground mt-2 text-justify">
                                Estruturado em <strong>duas fases</strong>, o concurso prevê na primeira a seleção de três <strong>estudos 
                                preliminares</strong>, que seguirão para a etapa seguinte, dedicada à produção de <strong>protótipos
                                </strong> e ao desenvolvimento dos <strong>projetos em nível básico</strong>. Essa abordagem garante 
                                não apenas qualidade conceitual, mas também a viabilidade técnica para futura implementação pela Prefeitura.
                            </p>
                            <p className="text-muted-foreground mt-2 text-justify">
                                A iniciativa reforça o compromisso municipal com um urbanismo sustentável, inclusivo e inovador, ampliando 
                                o portfólio de mobiliário urbano de São Paulo. Os vencedores receberão premiações no valor de <strong>
                                R$ 240 mil (1º lugar), R$ 160 mil (2º lugar) e R$ 100 mil (3º lugar)</strong>. Além disso, cada uma das 
                                três propostas selecionadas para a segunda fase contará com um adiantamento da premiação no valor de 
                                <strong>R$ 65 mil</strong>.
                            </p>
                            <p className="text-muted-foreground mt-2 text-justify">
                                Poderão participar do concurso profissionais de Arquitetura e Urbanismo ou de Engenharia devidamente 
                                registrados e em situação regular no CAU ou CREA, em âmbito nacional, seja na condição de pessoa física 
                                ou jurídica. As inscrições poderão ser feitas de forma individual ou em equipe, sendo obrigatória a 
                                indicação de um responsável técnico habilitado, que deverá responder formalmente pela proposta. 
                                No caso de equipes, estas poderão reunir diferentes profissionais, desde que respeitadas as regras 
                                de participação definidas no edital. 
                            </p>
                            <p className="text-muted-foreground mt-2 text-justify">
                                Atenção especial deve ser dada aos prazos de inscrição e às etapas previstas no cronograma do edital, 
                                fundamentais para garantir a habilitação e o pleno aproveitamento da oportunidade.
                            </p>
                            <p className="text-muted-foreground mt-2 text-justify">
                                Profissionais de todo o Brasil: tragam sua criatividade para inovar no mobiliário urbano de São Paulo, 
                                com responsabilidade ambiental e compromisso com a inclusão.
                            </p>
                            <p className="text-muted-foreground mt-2 text-justify mb-4">
                                <strong>Confira o Edital e o Termo de Referência e participe!</strong>
                            </p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </div>
            <div
                className={`flex flex-col gap-4 p-[3px] ${value === "item-2" ? "bg-[#D0DBBF]" : ""}`}
                style={{
                    clipPath:
                    "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                }}
                id="docs"
            >
                <AccordionItem
                    value="item-2"
                    className={`border rounded-lg intersect:motion-preset-slide-up motion-delay-150 ${value === "item-2" ? "bg-white" : ""}`}
                    style={value === "item-2" ? {
                        clipPath:
                        "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                    } : {}}
                >
                    <AccordionTrigger
                        className={`py-2 px-4 flex gap-3 items-center ${value === "item-2" ? "bg-transparent" : "bg-[#D0DBBF]"}`}
                        style={{
                            clipPath:
                            "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                        }}
                        aria-expanded={value === "item-2"}
                    >
                        <div className=" flex items-center w-full">
                            <h3 className="font-semibold text-xl w-full text-start text-[#3B2D3A]">
                                Cronograma
                            </h3>
                            <Data aria-hidden="true" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="py-4 px-9">
                        <div role="region" aria-labelledby="cronograma-content">
                            <p className="text-muted-foreground text-justify mt-2 mb-2">
                                <strong>25/08/2025:</strong> Publicação do Edital nº 001/SP-URB/2025. 
                            </p>
                            <p className="text-muted-foreground text-justify mb-2">
                                <strong>25/08/2025 a 14/09/2025:</strong> Prazo para pedidos de esclarecimentos. 
                            </p>
                            <p className="text-muted-foreground text-justify mb-2">
                                <strong>08/09/2025 a 15/09/2025: PERÍODO DE INSCRIÇÕES e submissão da DOCUMENTAÇÃO NECESSÁRIA PARA INSCRIÇÃO</strong>. 
                            </p>
                            <p className="text-muted-foreground text-justify mb-2">
                                <strong>23/09/2025:</strong> 1ª Publicação da lista de IDs deferidos e habilitados para participar no concurso. 
                            </p>
                            <p className="text-muted-foreground text-justify mb-4">
                                <strong>03/10/2025:</strong> Publicação final da lista de IDs deferidos para submissão das Propostas Técnicas em nível de Estudo Preliminar <strong>(FASE 1)</strong>. 
                            </p>
                            <p className="text-muted-foreground text-justify font-semibold mb-2">
                                FASE 1: 
                            </p>
                            <ol className="text-muted-foreground list-disc pl-5 space-y-2 text-justify mb-4">
                                <li className="text-muted-foreground text-justify">
                                    <strong>06/10/2025 a 17/10/2025:</strong> Período de submissão das <strong>PROPOSTAS TÉCNICAS </strong> 
                                    em nível de <strong>ESTUDO PRELIMINAR</strong>. 
                                </li>
                                <li className="text-muted-foreground text-justify">
                                    <strong>26/11/2025 a 27/11/2025:</strong> Reunião presencial da <strong>COMISSÃO JULGADORA</strong>. 
                                </li>
                                <li className="text-muted-foreground text-justify">
                                    <strong>01/12/2025:</strong>  1ª Publicação da lista de pontuação dos IDs. 
                                </li>
                                <li className="text-muted-foreground text-justify">
                                    <strong>10/12/2025:</strong> Publicação final da lista de pontuação dos IDs. 
                                </li>
                                <li className="text-muted-foreground text-justify">
                                    <strong>11/12/2025 a 12/12/2025:</strong> Período de entrega do <strong>TERMO DE COMPROMISSO </strong> 
                                    dos classificados para a <strong>FASE 2</strong> e apresentação dos <strong>DOCUMENTOS DE HABILITAÇÃO </strong> 
                                    para recebimento da antecipação dos valores de premiação. 
                                </li>
                                <li className="text-muted-foreground text-justify">
                                    <strong>19/12/2025:</strong> Publicação dos <strong>RESPONSÁVEIS TÉCNICOS</strong> classificados para a <strong>FASE 2</strong>. 
                                </li>
                            </ol>
                            <p className="text-muted-foreground text-justify font-semibold mb-2">
                                FASE 2: 
                            </p>
                            <ol className="text-muted-foreground list-disc pl-5 space-y-2 text-justify mb-4">
                                <li className="text-muted-foreground text-justify">
                                    <strong>24/02/2026:</strong> Data Limite para finalização dos <strong>PROTÓTIPOS</strong>. 
                                </li>
                                <li className="text-muted-foreground text-justify">
                                    <strong>20/03/2026:</strong> Data Limite para finalização dos <strong>PROJETOS BÁSICOS</strong>. 
                                </li>
                                <li className="text-muted-foreground text-justify">
                                    <strong>22/04/2026 A 23/04/2026:</strong> Encontro presencial da <strong>COMISSÃO JULGADORA</strong>. 
                                </li>
                                <li className="text-muted-foreground text-justify">
                                    <strong>29/04/2026:</strong> 1ª Publicação da lista de habilitados para premiação final. 
                                </li>
                                <li className="text-muted-foreground text-justify">
                                    <strong>12/05/2026 a 15/05/2026:</strong> Período para realização da CERIMÔNIA DE PREMIAÇÃO E ANÚNCIO DOS VENCEDORES <strong>(1º, 2º e 3º lugares)</strong> 
                                </li>
                            </ol>
                            <p className="text-muted-foreground text-justify text-xs mt-2 mb-2">
                                * Prazos observam o horário limite das 23h59 (vinte e três horas e cinquenta e nove minutos), conforme o horário oficial de Brasília/DF. 
                            </p>
                            <p className="text-muted-foreground text-justify text-xs mb-6">
                                ** O participante deverá observar os demais prazos previstos neste Edital, tais como prazos recursais, impugnação, prazos para submissão de documentação ou etapas de ajustes e complementações, quando aplicáveis. 
                            </p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </div>
        </Accordion>
    </section>
  );
}