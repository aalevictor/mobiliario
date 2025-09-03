import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { verificarPermissoes } from "@/services/usuarios";
import { z } from "zod";

const informeSchema = z.object({
    titulo: z.string().min(1, "Título é obrigatório").max(200, "Título deve ter no máximo 200 caracteres"),
    subtitulo: z.string().optional(),
    conteudo: z.string().min(1, "Conteúdo é obrigatório"),
    publicado: z.boolean().default(false),
    dataPublicacao: z.string().datetime("Data de publicação deve ser uma data válida"),
});

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const informe = await db.informe.findUnique({
            where: { id },
            include: {
                links: true,
                arquivos: true,
            }
        });

        if (!informe) {
            return NextResponse.json({ error: "Informe não encontrado" }, { status: 404 });
        }

        return NextResponse.json(informe);

    } catch (error) {
        console.error('Erro ao buscar informe:', error);
        return NextResponse.json(
            { error: "Erro ao buscar informe" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // Verificar se o usuário tem permissão de admin ou dev
        const permissao = await verificarPermissoes(session.user.id, ["ADMIN", "DEV"]);
        if (!permissao) {
            return NextResponse.json({ error: "Sem permissão para editar informes" }, { status: 403 });
        }

        const { id } = await context.params;
        const body = await request.json();
        const validatedData = informeSchema.parse(body);

        // Verificar se o informe existe
        const informeExistente = await db.informe.findUnique({
            where: { id }
        });

        if (!informeExistente) {
            return NextResponse.json({ error: "Informe não encontrado" }, { status: 404 });
        }

        const dataPublicacao = new Date(validatedData.dataPublicacao);

        const informe = await db.informe.update({
            where: { id },
            data: {
                titulo: validatedData.titulo,
                subtitulo: validatedData.subtitulo || null,
                conteudo: validatedData.conteudo,
                publicado: validatedData.publicado,
                dataPublicacao: dataPublicacao,
            },
            include: {
                links: true,
                arquivos: true,
            }
        });

        return NextResponse.json(informe);

    } catch (error) {
        console.error('Erro ao atualizar informe:', error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // Verificar se o usuário tem permissão de admin ou dev
        const permissao = await verificarPermissoes(session.user.id, ["ADMIN", "DEV"]);
        if (!permissao) {
            return NextResponse.json({ error: "Sem permissão para excluir informes" }, { status: 403 });
        }

        const { id } = await context.params;

        // Verificar se o informe existe
        const informeExistente = await db.informe.findUnique({
            where: { id }
        });

        if (!informeExistente) {
            return NextResponse.json({ error: "Informe não encontrado" }, { status: 404 });
        }

        // Excluir o informe (cascata excluirá links e arquivos relacionados)
        await db.informe.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Informe excluído com sucesso" });

    } catch (error) {
        console.error('Erro ao excluir informe:', error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
