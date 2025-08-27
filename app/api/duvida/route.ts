import { NextRequest, NextResponse } from "next/server";
import { criarDuvida } from "@/services/duvidas";

export async function POST(request: NextRequest) {
    const { nome, email, pergunta } = await request.json();
    try {
        const dataAberturaDuvidas = new Date('2025-08-25 00:00:00');
        const dataLimiteDuvidas = new Date('2025-09-14 23:59:59.999');
        const dataAtual = new Date();
        if (dataAtual < dataAberturaDuvidas || dataAtual > dataLimiteDuvidas)
            return NextResponse.json({ error: "Não é possível enviar perguntas neste momento." }, { status: 400 });
        const duvida = await criarDuvida({ nome, email, pergunta });
        if (!duvida) return NextResponse.json({ error: "Erro ao criar pergunta" }, { status: 500 });
        return NextResponse.json({ message: "Pergunta criada com sucesso" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}