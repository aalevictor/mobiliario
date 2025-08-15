import { auth } from "@/auth";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { meuCadastro } from "@/services/cadastros";
import { redirect } from "next/navigation";

export default async function MeuCadastro() {
    const session = await auth();
    if (!session) redirect("/");

    const cadastro = await meuCadastro(session.user.id);
    if (!cadastro) redirect("/");

    return (
        <div className="container mx-auto h-full flex items-center justify-center p-4">
            <div className="max-w-3xl w-full mx-auto p-4 bg-white rounded-lg shadow-md">
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
                    {cadastro.participantes.length > 0 && <AccordionItem value="item-3">
                        <AccordionTrigger>
                            <h1>Participantes</h1>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-lg font-bold">Dados dos Participantes</h2>
                                    {cadastro.participantes.map((participante) => (
                                        <div key={participante.id} className="flex flex-col gap-2">
                                            <p>{participante.nome}</p>
                                            <p>{participante.documento}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>}
                    <AccordionItem value="item-4">
                        <AccordionTrigger>
                            <h1 className="text-lg font-bold">Documentação</h1>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>
                            <h1 className="text-lg font-bold">Projetos</h1>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}