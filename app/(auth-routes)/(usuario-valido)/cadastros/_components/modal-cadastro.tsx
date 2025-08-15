'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { ICadastro } from "../page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TipoArquivo } from ".prisma/client";

export default function ModalCadastro({ cadastro, children }: { cadastro: ICadastro, children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    const doc_especifica = cadastro.arquivos?.filter(arquivo => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA);
    const doc_especifica_length = doc_especifica?.length || 0;

    const projetos = cadastro.arquivos?.filter(arquivo => arquivo.tipo === TipoArquivo.PROJETOS);
    const projetos_length = projetos?.length || 0;

    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children ? children : <Button>Avaliar</Button>}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Cadastro {cadastro.id}</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                Dados do cadastro
            </DialogDescription>
            <Accordion type="multiple" className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h1 className="text-lg font-bold">Responsável</h1>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <p>{cadastro.nome}</p>
                                <p>{cadastro.email}</p>
                                <p>{cadastro.telefone}</p>
                                <p>{cadastro.carteira_tipo} - {cadastro.carteira_numero}</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>
                        <h1 className="text-lg font-bold">Empresa</h1>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <p>{cadastro.cnpj}</p>
                                <p>{cadastro.logradouro}{cadastro.numero && `, ${cadastro.numero}`}{cadastro.complemento && ` - ${cadastro.complemento}`}</p>
                                <p>{cadastro.cidade} - {cadastro.uf}</p>
                                <p>{cadastro.cep}</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>
                        <h1 className="text-lg font-bold">Participantes</h1>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                {cadastro.participantes && cadastro.participantes.length > 0 ?cadastro.participantes.map((participante) => (
                                    <div key={participante.id} className="flex flex-col gap-2">
                                        <p>{participante.nome}</p>
                                        <p>{participante.documento}</p>
                                    </div>
                                )) : <p>Nenhum participante cadastrado</p>}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>
                        <h1 className="text-lg font-bold">Documentação</h1>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                {doc_especifica && doc_especifica_length > 0 ? doc_especifica.map((arquivo) => (
                                    <div key={arquivo.id} className="flex flex-col gap-2">
                                        <p>{arquivo.caminho}</p>
                                    </div>
                                )) : <p>Nenhum arquivo encontrado</p>}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger>
                        <h1 className="text-lg font-bold">Projetos</h1>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                {projetos && projetos_length > 0 ? projetos.map((arquivo) => (
                                    <div key={arquivo.id} className="flex flex-col gap-2">
                                        <p>{arquivo.caminho}</p>
                                    </div>
                                )) : <p>Nenhum arquivo encontrado</p>}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </DialogContent>
    </Dialog>;
}
