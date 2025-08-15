'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { Duvida } from ".prisma/client";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const schemaResposta = z.object({
	resposta: z.string().optional().default(''),
});

const schemaPergunta = z.object({
	pergunta: z.string().default(''),
    nome: z.string().default(''),
    email: z.email().default(''),
});

export default function ModalPergunta({ duvida, children }: { duvida?: Duvida, children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const formPergunta = useForm<z.input<typeof schemaPergunta>>({
        resolver: zodResolver(schemaPergunta),
        defaultValues: {
			pergunta: '',
            nome: '',
            email: '',
		},
	});
    const formResposta = useForm<z.input<typeof schemaResposta>>({
        resolver: zodResolver(schemaResposta),
        defaultValues: {
			resposta: duvida?.resposta || '',
		},
	});
    const onSubmit = async (data: z.input<typeof schemaResposta | typeof schemaPergunta>) => {
        startTransition(async () => {
            if (duvida) {
                const response = await fetch(`/api/duvida/${duvida.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(data),
                });
                if (response.ok) {
                    toast.success('Pergunta respondida com sucesso');
                    setOpen(false);
                } else {
                    toast.error('Erro ao responder pergunta');
                }
            } else {
                const response = await fetch('/api/duvida', {
                    method: 'POST',
                    body: JSON.stringify(data),
                });
                if (response.ok) {
                    toast.success('Pergunta enviada com sucesso');
                    setOpen(false);
                } else {
                    toast.error('Erro ao enviar pergunta');
                }
            }
        });
    }
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children ? children : <Button variant={duvida && !duvida.resposta ? 'default' : 'outline'}>
                {duvida ? duvida.resposta ? 'Ver resposta' : 'Responder' : 'Fazer pergunta'}
            </Button>}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Pergunta</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                {duvida ? 'Responda a pergunta' : 'Faça uma pergunta'}
            </DialogDescription>
            <div className="grid gap-1">
                {duvida ? <Form {...formResposta}>
                        <form onSubmit={formResposta.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <FormItem>
                                <FormLabel>Pergunta</FormLabel>
                                <Textarea
                                    rows={10}
                                    disabled={!!duvida?.id}
                                    value={duvida?.pergunta || ''}
                                    readOnly
                                />
                            </FormItem>
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <Input
                                    disabled={!!duvida?.id}
                                    value={duvida?.nome || ''}
                                    readOnly
                                />
                            </FormItem>
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    disabled={!!duvida?.id}
                                    value={duvida?.email || ''}
                                    readOnly
                                />
                            </FormItem>
                            <FormField
                                control={formResposta.control}
                                name='resposta'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Resposta</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={10}
                                                placeholder='Digite sua resposta'
                                                {...field}
                                                disabled={!!duvida?.resposta}
                                            />
                                            </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {duvida && !duvida.resposta && <Button type='submit' disabled={isPending}>
                                {isPending ? 'Enviando...' : 'Enviar'}
                            </Button>}
                        </form>
                    </Form>
                : <Form {...formPergunta}>
                        <form onSubmit={formPergunta.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <FormField
                                control={formPergunta.control}
                                name='nome'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Digite seu nome'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={formPergunta.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Digite seu email'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={formPergunta.control}
                                name='pergunta'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pergunta</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={10}
                                                placeholder='Digite sua pergunta'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' disabled={isPending}>
                                {isPending ? 'Enviando...' : 'Enviar'}
                            </Button>
                        </form>
                    </Form>}    
            </div>
        </DialogContent>
    </Dialog>;
}
