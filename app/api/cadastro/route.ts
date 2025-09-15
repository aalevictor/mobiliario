/** @format */

// app/api/upload/route.ts
import { criarPreCadastro } from "@/services/cadastros";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest) {
  const data = await req.json();
  const cadastro = await criarPreCadastro(data);
  const dataAberturaCadastro = new Date('2025-08-25 00:00:00');
  const dataLimiteCadastro = new Date('2025-09-22 23:59:59.999');
  const dataAtual = new Date();
  if (dataAtual < dataAberturaCadastro || dataAtual > dataLimiteCadastro) {
    return NextResponse.json({ error: "Não é possível realizar o cadastro neste momento. O período de cadastro está encerrado." }, { status: 400 });
  }
  if (!cadastro) {
    return NextResponse.json(
      { message: "Falha ao salvar registro do cadastro." },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ cadastro: cadastro }, { status: 201 });
}
