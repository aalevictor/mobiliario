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

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // Verificar se o usuário tem permissão de admin ou dev
        const permissao = await verificarPermissoes(session.user.id, ["ADMIN", "DEV"]);
        if (!permissao) {
            return NextResponse.json({ error: "Sem permissão para criar informes" }, { status: 403 });
        }

        const body = await request.json();
        const validatedData = informeSchema.parse(body);

        const dataPublicacao = new Date(validatedData.dataPublicacao);
        
        const informe = await db.informe.create({
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

        return NextResponse.json(informe, { status: 201 });

    } catch (error) {
        console.error('Erro ao criar informe:', error);
        
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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pagina = parseInt(searchParams.get('pagina') || '1');
        const limite = parseInt(searchParams.get('limite') || '10');
        const busca = searchParams.get('busca') || '';

        const skip = (pagina - 1) * limite;

        const where = busca ? {
            OR: [
                { titulo: { contains: busca } },
                { subtitulo: { contains: busca } },
                { conteudo: { contains: busca } },
            ]
        } : {};

        const [informes, total] = await Promise.all([
            db.informe.findMany({
                where,
                include: {
                    links: true,
                    arquivos: true,
                },
                orderBy: { criadoEm: 'desc' },
                skip,
                take: limite,
            }),
            db.informe.count({ where })
        ]);

        return NextResponse.json({
            data: informes,
            pagina,
            limite,
            total,
        });

    } catch (error) {
        console.error('Erro ao buscar informes:', error);
        return NextResponse.json(
            { error: "Erro ao buscar informes" },
            { status: 500 }
        );
    }
}
