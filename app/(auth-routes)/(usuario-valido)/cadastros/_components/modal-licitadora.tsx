'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { toast } from "sonner";
import { ICadastro } from "../page";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const schemaUsuario = z.object({
    aprovado: z.boolean(),
    parecer: z.string(),
    observacoes: z.string().optional(),
});

export default function ModalLicitadora({ cadastro, children }: { cadastro: ICadastro, children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const formUsuario = useForm<z.input<typeof schemaUsuario>>({
        resolver: zodResolver(schemaUsuario),
        defaultValues: {
            aprovado: cadastro.avaliacao_licitadora?.aprovado || false,
            parecer: cadastro.avaliacao_licitadora?.parecer || '',
            observacoes: cadastro.avaliacao_licitadora?.observacoes || '',
		},
	});

    const onSubmit = async (data: z.input<typeof schemaUsuario>) => {
        startTransition(async () => {
            if (cadastro.avaliacao_licitadora?.id) {
                const response = await fetch(`/api/cadastro/${cadastro.id}/avaliacao-licitadora/${cadastro.avaliacao_licitadora.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(data),
                });
                if (response.ok) {
                    toast.success('Avaliação licitadora atualizada com sucesso');
                    formUsuario.reset();
                    setOpen(false);
                } else {
                    toast.error('Erro ao atualizar avaliação licitadora');
                }
            } else {
                const response = await fetch(`/api/cadastro/${cadastro.id}/avaliacao-licitadora`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                });
                if (response.ok) {
                    toast.success('Avaliação licitadora criada com sucesso');
                    formUsuario.reset();
                    setOpen(false);
                } else {
                    toast.error('Erro ao criar avaliação licitadora');
                }
            }
        });
    }
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children ? children : <Button>Avaliar</Button>}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Avaliação documental</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                {cadastro.avaliacao_licitadora?.id ? 'Atualize os dados da avaliação' : 'Crie uma nova avaliação'}
            </DialogDescription>
            <div className="grid gap-1 mt-1">
                <Form {...formUsuario}>
                    <form onSubmit={formUsuario.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={formUsuario.control}
                            name="aprovado"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Aprovado</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={formUsuario.control}
                            name="parecer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parecer</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Parecer"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={formUsuario.control}
                            name="observacoes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Observações</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Observações"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type='submit' disabled={isPending}>
                            {isPending ? 'Enviando...' : 'Enviar'}
                        </Button>
                    </form>
                </Form>
            </div>
        </DialogContent>
    </Dialog>;
}
