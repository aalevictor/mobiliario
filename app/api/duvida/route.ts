import { NextRequest, NextResponse } from "next/server";
import { criarDuvida } from "@/services/duvidas";

export async function POST(request: NextRequest) {
    const { nome, email, pergunta } = await request.json();
    try {
        const duvida = await criarDuvida({ nome, email, pergunta });
        if (!duvida) return NextResponse.json({ error: "Erro ao criar pergunta" }, { status: 500 });
        return NextResponse.json({ message: "Pergunta criada com sucesso" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}