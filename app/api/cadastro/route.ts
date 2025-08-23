/** @format */

// app/api/upload/route.ts
import { criarPreCadastro } from "@/services/cadastros";
import { NextRequest, NextResponse } from "next/server";
import { capturarInfoRequisicao } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const { ip, userAgent } = capturarInfoRequisicao(req);
  
  try {
    const data = await req.json();
    
    // Chamar o serviço com contexto para logs
    const cadastro = await criarPreCadastro(data, { ip, userAgent });
    
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
