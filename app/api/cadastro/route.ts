/** @format */

// app/api/upload/route.ts
import { criarPreCadastro } from "@/services/cadastros";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const cadastro = await criarPreCadastro(data);
    if (!cadastro) {
      return NextResponse.json(
        { message: "Falha ao salvar registro do cadastro." },
        { status: 500 }
      );
    }
    return NextResponse.json({ cadastro: cadastro }, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error to save pre register:", error);
    return NextResponse.json(
      { message: "Falha ao enviar cadastro", error: error.message },
      { status: 500 }
    );
  }
}
