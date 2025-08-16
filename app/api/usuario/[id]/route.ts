import { NextRequest, NextResponse } from "next/server";
import { Usuario } from "@prisma/client";
import { atualizarUsuario, verificarPermissoes } from "@/services/usuarios";
import { auth } from "@/auth";

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    if (!await verificarPermissoes(session.user.id, ["ADMIN", "DEV"]))
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const { id } = await context.params;
    const data: Partial<Usuario> = await request.json();
    try {
        const duvida = await atualizarUsuario(id, data);
        if (!duvida) return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
        return NextResponse.json({ message: "Usuário atualizado com sucesso" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}