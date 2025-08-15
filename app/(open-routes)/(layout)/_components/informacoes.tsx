"use client"

import { Data, Sobre } from "@/components/icones";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";

export default function Informacoes() {
  const [value, setValue] = useState<string | undefined>(undefined)
  return (
    <div className="w-[90%] lg:w-[600px] mx-auto">
        <h2 className=" text-[#3B2D3A] intersect:motion-preset-slide-up motion-delay-150 text-2xl md:text-3xl font-bold text-center mb-8 uppercase">
            Informações do Concurso
        </h2>
        <Accordion
            type="single"
            collapsible
            className="space-y-4"
            value={value}
            onValueChange={setValue}
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
                    >
                        <div className=" flex items-center w-full">
                            <p className="font-semibold text-xl w-full text-start text-[#3B2D3A]">
                            Sobre
                            </p>
                            <Sobre />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 px-9">
                        <p className="text-muted-foreground">
                            A SP Urbanismo, com apoio da Secretaria de Urbanismo e
                            Licenciamento, vai realizar a segunda edição do Concurso
                            Nacional de Elementos de Mobiliário Urbano, iniciativa que
                            incentiva arquitetos e urbanistas a desenvolverem projetos
                            inovadores para os espaços públicos de São Paulo. O edital
                            está em elaboração e a pré-divulgação da iniciativa ocorre
                            durante a Semana de Design promovida pela DW! um dos maiores
                            eventos do setor no mundo.
                        </p>
                        <p className="text-muted-foreground mt-3">
                            O concurso terá como objetivo selecionar propostas de
                            mobiliário urbano – como bancos, totens, floreiras e
                            sanitários – que priorizem a redução do impacto ambiental, a
                            incorporação de novas tecnologias e a melhoria da experiência
                            dos cidadãos no espaço público. Além de valorizar o design e a
                            funcionalidade, a iniciativa reforça o compromisso da
                            Prefeitura com o desenvolvimento urbano sustentável.
                        </p>
                    </AccordionContent>
                </AccordionItem>
            </div>
            <div
                className={`flex flex-col gap-4 p-[3px] ${value === "item-2" ? "bg-[#D0DBBF]" : ""}`}
                style={{
                    clipPath:
                    "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                }}
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
                    >
                        <div className=" flex items-center w-full">
                            <p className="font-semibold text-xl w-full text-start text-[#3B2D3A]">
                                Cronograma
                            </p>
                            <Data />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 px-9">
                        <div className="space-y-3">
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Período:</strong> 15 a 20 de Agosto de 2025
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Horários:</strong>
                            </p>
                            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                                <li>Segunda a Sexta: das 10h às 22h</li>
                                <li>Sábado e Domingo: das 9h às 23h</li>
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </div>
        </Accordion>
    </div>
  );
}