"use client"

import { templateDuvidasPadraoEmail, templateDuvidasPadraoPlataforma, templateEncerramentoAcesso, templateFinalizar, templateFinalizarNovo, templateInformacoesAprovados, templateListaFinalInscritos, templateListaInscritos, templatePrazoSuplementar } from "@/app/api/cadastro/_utils/email-templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

interface EnviarFormProps {
    emailsParticipantes: string[];
    emailsDuvidasPortal: string[];
    emailsDuvidasEmail: string[];
    emailsAprovados: string[];
    mailApi: string;
    mailFrom: string;
    mailBcc: string;
}

export default function EnviarForm({ 
    emailsParticipantes, 
    emailsDuvidasPortal, 
    emailsDuvidasEmail,
    emailsAprovados,
    mailApi,
    mailFrom,
    mailBcc,
}: EnviarFormProps) {
    const [modelEmail, setModelEmail] = useState("1");
    const [teste, setTeste] = useState(false);
    const emailsTeste = ["vmabreu@prefeitura.sp.gov.br", "tbabreu@prefeitura.sp.gov.br", "ghfatorelli@spurbanismo.sp.gov.br"];

    const enviarEmail = async () => {
        let resultado = null;
        if (mailFrom === "" || mailBcc === "" || mailApi === "") {
            toast.error("Configuração de email inválida.");
            return;
        }
        switch (modelEmail) {
            case "1":
                resultado = await enviaFinalizar(emailsParticipantes);
                break;
            case "2":
                resultado = await enviaDuvidasPortal(emailsDuvidasPortal);
                break;
            case "3":
                resultado = await enviaDuvidasEmail(emailsDuvidasEmail);
                break;
            case "4":
                resultado = await enviaFinalizarNovo(emailsParticipantes);
                break;
            case "5":
                resultado = await enviaPrazoSuplementar(emailsParticipantes);
                break;
            case "6":
                resultado = await enviaListaInscritos(emailsParticipantes);
                break;
            case "7":
                resultado = await enviaListaFinalInscritos(emailsParticipantes);
                break;
            case "8":
                resultado = await enviaInformacoesAprovados(emailsAprovados);
                break;
            case "9":
                resultado = await enviaEncerramentoAcesso(emailsParticipantes);
                break;
            default:
                break;
        }
        if (resultado && resultado?.ok) toast.success("Email enviado com sucesso.");
        else toast.error("Erro ao enviar emails")
    }

    async function enviaFinalizar(emails: string[]) {
        emails = teste ? emailsTeste : emails;
        emails.push(mailBcc);
        console.log(emails);
        return await fetch('/api/mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: mailFrom,
                to: '',
                bcc: emails,
                subject: 'Concurso do Mobiliário Urbano: Finalize sua inscrição!',
                html: templateFinalizar(),
            }),
        });
    }

    async function enviaFinalizarNovo(emails: string[]) {
        emails = teste ? emailsTeste : emails;
        emails.push(mailBcc);
        console.log(emails);
        return await fetch('/api/mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: mailFrom,
                to: '',
                bcc: emails,
                subject: 'Concurso do Mobiliário Urbano: Finalize sua inscrição!',
                html: templateFinalizarNovo(),
            }),
        });
    }

    async function enviaPrazoSuplementar(emails: string[]) {
        emails = teste ? emailsTeste : emails;
        emails.push(mailBcc);
        console.log(emails);
        return await fetch('/api/mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: mailFrom,
                to: '',
                bcc: emails,
                subject: 'Concurso do Mobiliário Urbano: abertura de período suplementar para submissão de documentos: AMANHÃ (sexta-feira, 26/09/2025) das 8h às 12h',
                html: templatePrazoSuplementar(),
            }),
        });
    }

    async function enviaListaInscritos(emails: string[]) {
        emails = teste ? emailsTeste : emails;
        emails.push(mailBcc);
        console.log(emails);
        return await fetch('/api/mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: mailFrom,
                to: '',
                bcc: emails,
                subject: 'Concurso do Mobiliário Urbano: abertura de período suplementar para submissão de documentos: AMANHÃ (sexta-feira, 26/09/2025) das 8h às 12h',
                html: templateListaInscritos(),
            }),
        });
    }

    async function enviaListaFinalInscritos(emails: string[]) {
        emails = teste ? emailsTeste : emails;
        emails.push(mailBcc);
        console.log(emails);
        return await fetch('/api/mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: mailFrom,
                to: '',
                bcc: emails,
                subject: 'LISTA FINAL de IDs inscritos no Concurso. Item 12.3.1.5 do Edital',
                html: templateListaFinalInscritos(),
            }),
        });
    }

    async function enviaEncerramentoAcesso(emails: string[]) {
        emails = teste ? emailsTeste : emails;
        emails.push(mailBcc);
        console.log(emails);
        return await fetch('/api/mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: mailFrom,
                to: '',
                bcc: emails,
                subject: 'Concurso do Mobiliário Urbano: Informe aos participantes',
                html: templateEncerramentoAcesso(),
            }),
        });
    }

    async function enviaInformacoesAprovados(emails: string[]) {
        console.log(emails);
        emails = teste ? emailsTeste : emails;
        return await fetch('/api/mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: mailFrom,
                to: '',
                bcc: emails,
                subject: 'Atenção participante inscrito! Você está na Fase 1 do Concurso',
                html: templateInformacoesAprovados(),
            }),
        });
    }

    async function enviaDuvidasPortal(emails: string[]) {
        emails = teste ? emailsTeste : emails;
        emails.push(mailBcc);
        console.log(emails);
        return await fetch('/api/mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: mailFrom,
                to: '',
                bcc: emails,
                subject: 'Concurso do Mobiliário Urbano: Pedidos de Esclarecimento',
                html: templateDuvidasPadraoPlataforma(),
            }),
        });
    }

    async function enviaDuvidasEmail(emails: string[]) {
        emails = teste ? emailsTeste : emails;
        emails.push(mailBcc);
        console.log(emails);
        return await fetch('/api/mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: mailFrom,
                to: '',
                bcc: emails,
                subject: 'Concurso do Mobiliário Urbano: Pedidos de Esclarecimento',
                html: templateDuvidasPadraoEmail(),
            }),
        });
    }

    return (
        <div className="relative h-full container mx-auto px-4 py-6 max-w-8xl space-y-2">
            <Card>
                <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Usuários
                </CardTitle>
                <CardDescription>
                    Visualize, edite e gerencie todos os usuários do sistema
                </CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardContent className="flex flex-col justify-between gap-2">
                    <div className="flex flex-col justify-between gap-2">
                        <Label className="text-sm sm:text-base">Emails a enviar</Label>
                        <Select
                            value={modelEmail}
                            onValueChange={(value) => {
                                setModelEmail(value);
                            }}
                        >
                            <SelectTrigger className="w-full !h-10 sm:!h-11">
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Tipo</SelectLabel>
                                    <SelectItem value="1">Finalizar inscrição</SelectItem>
                                    <SelectItem value="4">Finalizar inscrição Novo</SelectItem>
                                    <SelectItem value="5">Prazo Suplementar</SelectItem>
                                    <SelectItem value="6">Lista de Inscritos</SelectItem>
                                    <SelectItem value="7">Lista Final de Inscritos</SelectItem>
                                    <SelectItem value="8">Informações para aprovados</SelectItem>
                                    <SelectItem value="9">Encerramento de acesso</SelectItem>
                                    <SelectItem value="2">Pedido Esclarecimento - Portal</SelectItem>
                                    <SelectItem value="3">Pedido Esclarecimento - Email</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2">
                        <Switch
                            checked={teste}
                            onCheckedChange={(checked) => setTeste(checked)}
                        />
                        <Label className="text-sm sm:text-base">Teste</Label>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button onClick={enviarEmail}>Enviar</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}