import { auth } from "@/auth";
import { atualizarAvaliacaoLicitadora } from "@/services/cadastros";
import { verificarPermissoes } from "@/services/usuarios";
import { NextRequest, NextResponse } from "next/server";

export interface IAvaliacaoLicitadora {
    aprovado: boolean;
    parecer: string;
    observacoes?: string;
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ avaliacao_id: string }> }
) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    if (!await verificarPermissoes(session.user.id, ["LICITACAO"]))
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const { avaliacao_id } = await context.params;
    const data: IAvaliacaoLicitadora = await request.json();
    try {
        const avaliacao_licitadora = await atualizarAvaliacaoLicitadora(avaliacao_id, session.user.id, data);
        if (!avaliacao_licitadora) return NextResponse.json({ error: "Erro ao atualizar avaliação licitadora" }, { status: 500 });
        return NextResponse.json({ message: "Avaliação licitadora atualizada com sucesso" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}