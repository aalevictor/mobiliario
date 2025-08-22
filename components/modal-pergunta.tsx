'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useTransition, useEffect } from "react";
import { Duvida } from "@prisma/client";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schemaResposta = z.object({
	resposta: z.string().min(1, 'Resposta é obrigatória'),
});

const schemaPergunta = z.object({
	pergunta: z.string().min(1, 'Pergunta é obrigatória'),
    nome: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
});

export default function ModalPergunta({ duvida, children }: { duvida?: Duvida, children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    
    const formPergunta = useForm<z.infer<typeof schemaPergunta>>({
        resolver: zodResolver(schemaPergunta),
        defaultValues: {
			pergunta: '',
            nome: '',
            email: '',
		},
	});
    
    const formResposta = useForm<z.infer<typeof schemaResposta>>({
        resolver: zodResolver(schemaResposta),
        defaultValues: {
			resposta: '',
		},
	});
    
    // Atualiza o formResposta quando a duvida mudar
    useEffect(() => {
        if (duvida) {
            formResposta.setValue('resposta', duvida.resposta || '');
        }
    }, [duvida, formResposta]);
    
    const onSubmit = async (data: z.infer<typeof schemaResposta> | z.infer<typeof schemaPergunta>) => {
        startTransition(async () => {
            if (duvida) {
                const response = await fetch(`/api/duvida/${duvida.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(data),
                });
                if (response.ok) {
                    toast.success('Pergunta respondida com sucesso');
                    formResposta.reset();
                    router.refresh();
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
                    formPergunta.reset();
                    router.refresh();
                    setOpen(false);
                } else {
                    toast.error('Erro ao enviar pergunta');
                }
            }
        });
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button variant={duvida && !duvida.resposta ? 'default' : 'outline'}>
                        {duvida ? duvida.resposta ? 'Ver resposta' : 'Responder' : 'Fazer pergunta'}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">
                        {duvida ? 'Responder Pergunta' : 'Nova Pergunta'}
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                        {duvida ? 'Responda a pergunta abaixo' : 'Preencha os dados para enviar sua pergunta'}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="mt-6">
                    {duvida ? (
                        <Form {...formResposta}>
                            <form onSubmit={formResposta.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                                <Card>
                                    <CardHeader className="px-4 sm:px-6 pb-3">
                                        <CardTitle className="text-base sm:text-lg">Dados da Pergunta</CardTitle>
                                        <CardDescription className="text-sm">
                                            Informações da pergunta recebida
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-4 sm:px-6 space-y-4">
                                        <FormItem>
                                            <FormLabel className="text-sm sm:text-base">Pergunta</FormLabel>
                                            <Textarea
                                                rows={6}
                                                disabled={true}
                                                value={duvida?.pergunta || ''}
                                                readOnly
                                                className="min-h-[120px] resize-none"
                                            />
                                        </FormItem>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormItem>
                                                <FormLabel className="text-sm sm:text-base">Nome</FormLabel>
                                                <Input
                                                    disabled={true}
                                                    value={duvida?.nome || ''}
                                                    readOnly
                                                />
                                            </FormItem>
                                            <FormItem>
                                                <FormLabel className="text-sm sm:text-base">Email</FormLabel>
                                                <Input
                                                    disabled={true}
                                                    value={duvida?.email || ''}
                                                    readOnly
                                                />
                                            </FormItem>
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <Card>
                                    <CardHeader className="px-4 sm:px-6 pb-3">
                                        <CardTitle className="text-base sm:text-lg">Resposta</CardTitle>
                                        <CardDescription className="text-sm">
                                            {duvida.resposta ? 'Resposta já enviada' : 'Digite sua resposta'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-4 sm:px-6">
                                        <FormField
                                            control={formResposta.control}
                                            name='resposta'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm sm:text-base">Resposta</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            rows={8}
                                                            placeholder='Digite sua resposta'
                                                            {...field}
                                                            disabled={!!duvida?.resposta}
                                                            className="min-h-[160px] resize-none"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                                
                                {duvida && !duvida.resposta && (
                                    <div className="flex justify-end pt-4">
                                        <Button type='submit' disabled={isPending} className="w-full sm:w-auto">
                                            {isPending ? 'Enviando...' : 'Enviar Resposta'}
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </Form>
                    ) : (
                        <Form {...formPergunta}>
                            <form onSubmit={formPergunta.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                                <Card>
                                    <CardHeader className="px-4 sm:px-6 pb-3">
                                        <CardTitle className="text-base sm:text-lg">Dados Pessoais</CardTitle>
                                        <CardDescription className="text-sm">
                                            Informações para contato
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-4 sm:px-6 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField
                                                control={formPergunta.control}
                                                name='nome'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm sm:text-base">Nome</FormLabel>
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
                                                        <FormLabel className="text-sm sm:text-base">Email</FormLabel>
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
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <Card>
                                    <CardHeader className="px-4 sm:px-6 pb-3">
                                        <CardTitle className="text-base sm:text-lg">Pergunta</CardTitle>
                                        <CardDescription className="text-sm">
                                            Descreva sua dúvida ou pergunta
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-4 sm:px-6">
                                        <FormField
                                            control={formPergunta.control}
                                            name='pergunta'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm sm:text-base">Pergunta</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            rows={8}
                                                            placeholder='Digite sua pergunta'
                                                            {...field}
                                                            className="min-h-[160px] resize-none"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                                
                                <div className="flex justify-end pt-4">
                                    <Button type='submit' disabled={isPending} className="w-full sm:w-auto">
                                        {isPending ? 'Enviando...' : 'Enviar Pergunta'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
