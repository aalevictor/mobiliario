import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }>}) {
    const dataAberturaDocumento = new Date("2025-09-08 00:00:00")
    const dataLimiteDocumento = new Date("2025-09-22 23:59:59.999")
    const dataAtual = new Date()
    const podeEnviarDocumento = dataAtual >= dataAberturaDocumento && dataAtual <= dataLimiteDocumento
    if (!podeEnviarDocumento) return NextResponse.json({ error: "Não é possível adicionar participantes fora do período de inscrição." }, { status: 400 });
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        const { id } = await context.params;
        const cadastro = await db.cadastro.findFirst({
            where: {
                id: parseInt(id),
                usuarioId: session.user.id
            }
        });
        if (!cadastro) return NextResponse.json({ error: "Cadastro não encontrado" }, { status: 404 });
        const cadastroId = cadastro.id;
        const { nome, documento } = await request.json();
        if (!nome || !documento) return NextResponse.json({ error: "Nome e documento são obrigatórios" }, { status: 400 });
        const participanteExistente = await db.participante.findFirst({
            where: {
                documento,
                cadastroId
            }
        });
        if (participanteExistente) return NextResponse.json({ error: "CPF já cadastrado neste projeto" }, { status: 400 });
        const novoParticipante = await db.participante.create({
            data: {
                nome,
                documento,
                cadastroId
            }
        });
        return NextResponse.json(novoParticipante, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar participante:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
