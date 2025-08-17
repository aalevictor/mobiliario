import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
    request: NextRequest, context: { params: Promise<{ id: string, participanteId: string }>}
) {
    try {
        const session = await auth();
        const { id, participanteId } = await context.params;
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }
        const cadastro = await db.cadastro.findFirst({
            where: {
                id: +id,
                usuarioId: session.user.id
            }
        });
        if (!cadastro) return NextResponse.json({ error: "Cadastro não encontrado" }, { status: 404 });
        const participante = await db.participante.findFirst({
            where: {
                id: +participanteId,
                cadastroId: +id
            }
        });
        if (!participante) return NextResponse.json({ error: "Participante não encontrado" }, { status: 404 });
        await db.participante.delete({
            where: {
                id: +participanteId
            }
        });
        return NextResponse.json({ message: "Participante removido com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar participante:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
