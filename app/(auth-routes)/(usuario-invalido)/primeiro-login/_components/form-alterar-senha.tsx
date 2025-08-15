"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "next-auth";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

const formSchema = z.object({
    senha: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    confirmarSenha: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
});

export default function FormAlterarSenha({ usuario }: { usuario: User }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            senha: "",
            confirmarSenha: "",
        },
    });
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { senha, confirmarSenha } = values;
        const response = await fetch(`/api/usuario/${usuario.id}/alterar-senha`, {
            method: "PATCH",
            body: JSON.stringify({ senha, confirmarSenha }),
        });

        if (response.ok) {
            toast.success("Senha alterada com sucesso");
            await signOut()
        }
    }
    return <div className="flex flex-col gap-4 w-full max-w-md mx-auto bg-white p-4 rounded-md mt-auto">
        <h1 className="text-2xl font-bold">Alterar Senha</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                    control={form.control}
                    name="senha"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Senha" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmarSenha"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirmar Senha</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Confirmar Senha" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting || form.watch("senha") !== form.watch("confirmarSenha")}>
                    {form.formState.isSubmitting ? "Alterando..." : "Alterar Senha"}
                </Button>
            </form>
        </Form>
    </div>;
}