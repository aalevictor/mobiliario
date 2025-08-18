import { auth } from "@/auth";
import { criarAvaliacaoLicitadora } from "@/services/cadastros";
import { verificarPermissoes } from "@/services/usuarios";
import { NextRequest, NextResponse } from "next/server";

export interface IAvaliacaoLicitadora {
    aprovado: boolean;
    parecer: string;
    observacoes?: string;
}

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    if (!await verificarPermissoes(session.user.id, ["ADMIN"]))
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const { id } = await context.params;
    const data: IAvaliacaoLicitadora = await request.json();
    try {
        const avaliacao_licitadora = await criarAvaliacaoLicitadora(+id, session.user.id, data);
        if (!avaliacao_licitadora) return NextResponse.json({ error: "Erro ao criar avaliação licitadora" }, { status: 500 });
        return NextResponse.json({ message: "Avaliação licitadora criada com sucesso" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}