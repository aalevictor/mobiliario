import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { verificarPermissoes } from "@/services/usuarios";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const permissao = await verificarPermissoes(session.user.id, ["ADMIN", "DEV"]);
    const { id } = await context.params;
    const cadastro = await db.cadastro.findUnique({ where: { id: +id } });
    if (!cadastro) return NextResponse.json({ error: "Cadastro não encontrado" }, { status: 404 });
    const donoCadastro = cadastro.usuarioId === session.user.id;
    if (!permissao && !donoCadastro) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const data = await request.json();
    const cadastroAtualizado = await db.cadastro.update({
        where: { id: +id },
        data,
    });
    if (!cadastroAtualizado) return NextResponse.json({ error: "Erro ao atualizar cadastro" }, { status: 500 });
    return NextResponse.json({ message: "Cadastro atualizado com sucesso" }, { status: 200 });
}