'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { Permissao, Tipo_Usuario, Usuario } from ".prisma/client";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const schemaUsuario = z.object({
    nome: z.string().default(''),
    email: z.email().default(''),
    login: z.string().optional().default(''),
    permissao: z.enum(Permissao),
    tipo: z.enum(Tipo_Usuario).default(Tipo_Usuario.INTERNO)
});

export default function ModalUsuario({ permissao, usuario, children }: { permissao: Permissao, usuario?: Usuario, children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const formUsuario = useForm<z.input<typeof schemaUsuario>>({
        resolver: zodResolver(schemaUsuario),
        defaultValues: {
            nome: usuario?.nome || '',
            email: usuario?.email || '',
            login: usuario?.login || '',
            permissao: usuario?.permissao || undefined,
            tipo: usuario?.tipo || Tipo_Usuario.INTERNO
		},
	});

    // const buscarUsuario = async (login: string) => {
    //     const response = await fetch(`/api/usuario/buscar-novo/${login}`);
    //     const data: { nome: string, email: string, login: string } = await response.json();
    //     return data;
    // }

    const onSubmit = async (data: z.input<typeof schemaUsuario>) => {
        startTransition(async () => {
            if (usuario) {
                const response = await fetch(`/api/usuario/${usuario.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ permissao: data.permissao }),
                });
                if (response.ok) {
                    toast.success('Usuário atualizado com sucesso');
                    setOpen(false);
                } else {
                    toast.error('Erro ao atualizar usuário');
                }
            } else {
                const response = await fetch('/api/usuario', {
                    method: 'POST',
                    body: JSON.stringify(data),
                });
                if (response.ok) {
                    toast.success('Usuário criado com sucesso');
                    setOpen(false);
                } else {
                    toast.error('Erro ao criar usuário');
                }
            }
        });
    }
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children ? children : <Button>Criar usuário</Button>}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{usuario ? usuario.nome : 'Novo usuário'}</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                {usuario ? 'Atualize os dados do usuário' : 'Crie um novo usuário'}
            </DialogDescription>
            <div className="grid gap-1 mt-4">
                <Form {...formUsuario}>
                    <form onSubmit={formUsuario.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={formUsuario.control}
                            name='tipo'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de usuário</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={!!usuario?.id}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione o tipo de usuário" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={Tipo_Usuario.INTERNO}>Interno</SelectItem>
                                                <SelectItem value={Tipo_Usuario.EXTERNO}>Externo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {formUsuario.watch('tipo') === Tipo_Usuario.INTERNO && <FormField
                            control={formUsuario.control}
                            name='login'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Login</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-row">
                                            <Input
                                                placeholder='Digite o login do usuário'
                                                {...field}
                                                disabled={!!usuario?.id}
                                                className={!usuario?.id ? "rounded-r-none" : ""}
                                            />
                                            {!usuario?.id && <Button type='button' className="rounded-l-none">
                                                <Search />
                                            </Button>}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />}
                        <FormField
                            control={formUsuario.control}
                            name='nome'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Digite o nome do usuário'
                                            {...field}
                                            disabled={!!usuario?.id}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={formUsuario.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Digite o email do usuário'
                                            {...field}
                                            disabled={!!usuario?.id}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={formUsuario.control}
                            name='permissao'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Permissão</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione a permissão" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {permissao === "DEV" && <SelectItem value={Permissao.DEV}>Desenvolvedor</SelectItem>}
                                                <SelectItem value={Permissao.ADMIN}>Comissão organizadora</SelectItem>
                                                <SelectItem value={Permissao.JULGADORA}>Comissão julgadora</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
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
