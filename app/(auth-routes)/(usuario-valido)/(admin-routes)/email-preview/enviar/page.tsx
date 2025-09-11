"use client"

import { templateDuvidasPadraoEmail, templateDuvidasPadraoPlataforma, templateFinalizar } from "@/app/api/cadastro/_utils/email-templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

export default function EnviarEmail() {
    const [modelEmail, setModelEmail] = useState("1");
    const [teste, setTeste] = useState(false);
    const emailsTeste = ["vmabreu@prefeitura.sp.gov.br", "tbabreu@prefeitura.sp.gov.br", "ghfatorelli@spurbanismo.sp.gov.br"];
    const emailsDuvidasEmail = [
        "isa@panapana.arq.br",
        "nicollepazmaia@gmail.com",
        "gianine.laiza@novidario.com.br",
        "srmarceloj@gmail.com",
        "marcela.rzd@gmail.com"
    ];

    const enviarEmail = async () => {
        let resultado = null;
        switch (modelEmail) {
            case "1":
                const emailsParticipantesResponse = await fetch("/api/cadastro/emails");
                if (!emailsParticipantesResponse.ok) toast.error("Erro ao buscar emails.");
                const emailsParticipantesJson = await emailsParticipantesResponse.json();
                if (!emailsParticipantesJson && !emailsParticipantesJson.emails) return
                const emailsParticipantes = emailsParticipantesJson.emails;
                resultado = await enviaFinalizar(emailsParticipantes);
                break;
            case "2":
                const emailsDuvidasResponse = await fetch("/api/duvida/emails");
                if (!emailsDuvidasResponse.ok) toast.error("Erro ao buscar emails.");
                const emailsDuvidasJson = await emailsDuvidasResponse.json();
                if (!emailsDuvidasJson && !emailsDuvidasJson.emails) return
                const emailsDuvidas = emailsDuvidasJson.emails;
                resultado = await enviaDuvidasPortal(emailsDuvidas);
                break;
            case "3":
                resultado = await enviaDuvidasEmail(emailsDuvidasEmail);
                break;
            default:
                break;
        }
        if (resultado && resultado?.ok) toast.success("Email enviado com sucesso.");
        else toast.error("Erro ao enviar emails")
    }

    async function enviaFinalizar(emails: string[]) {
        emails = teste ? emailsTeste : emails;
        emails.push(process.env.MAIL_BCC || '');
        return await fetch(`${process.env.MAIL_API}/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: process.env.MAIL_FROM || '',
                to: '',
                bcc: emails,
                subject: 'Concurso do Mobiliário Urbano: Finalize sua inscrição!',
                html: templateFinalizar(),
            }),
        });
    }

    async function enviaDuvidasPortal(emails: string[]) {
        emails = teste ? emailsTeste : emails;
        emails.push(process.env.MAIL_BCC || '');
        return await fetch(`${process.env.MAIL_API}/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: process.env.MAIL_FROM || '',
                to: '',
                bcc: emails,
                subject: 'Concurso do Mobiliário Urbano: Pedidos de Esclarecimento',
                html: templateDuvidasPadraoPlataforma(),
            }),
        });
    }

    async function enviaDuvidasEmail(emails: string[]) {
        emails = teste ? emailsTeste : emails;
        emails.push(process.env.MAIL_BCC || '');
        return await fetch(`${process.env.MAIL_API}/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: process.env.MAIL_FROM || '',
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