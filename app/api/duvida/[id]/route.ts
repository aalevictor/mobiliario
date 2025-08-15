import { auth } from "@/auth";
import { responderDuvida } from "@/services/duvidas";
import { verificarPermissoes } from "@/services/usuarios";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    if (!await verificarPermissoes(session.user.id, ["ADMIN", "DEV"]))
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const { id } = await context.params;
    const { resposta } = await request.json();
    try {
        const duvida = await responderDuvida(id, resposta);
        if (!duvida) return NextResponse.json({ error: "Erro ao atualizar pergunta" }, { status: 500 });
        return NextResponse.json({ message: "Pergunta atualizada com sucesso" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}