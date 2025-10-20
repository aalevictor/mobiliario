import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { verificarPermissoes } from "@/services/usuarios";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const permissao = verificarPermissoes(session.user.id, ["DEV", "ADMIN"]);
    if (!permissao) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const { id } = await context.params;
    const cadastro = await db.cadastro.findFirst({
        where: { id: parseInt(id) },
    });
    if (!cadastro) return NextResponse.json({ error: "Cadastro não encontrado" }, { status: 404 });
    const liberado = await db.avaliacao_Licitadora.update({
        where: { cadastroId: cadastro.id },
        data: { liberadoAval: true }
    });
    if (!liberado) return NextResponse.json({ error: "Erro ao liberar avaliação" }, { status: 500 });
    return NextResponse.json({ message: "Avaliação liberada com sucesso" }, { status: 200 });
}