/** @format */

// app/api/upload/route.ts
import { criarPreCadastro } from "@/services/cadastros";
import { NextRequest, NextResponse } from "next/server";
import { withErrorLogging } from "@/lib/error-handler-enhanced";

async function handlePOST(req: NextRequest) {
  const data = await req.json();
  const cadastro = await criarPreCadastro(data);
  
  if (!cadastro) {
    return NextResponse.json(
      { message: "Falha ao salvar registro do cadastro." },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ cadastro: cadastro }, { status: 201 });
}

export const POST = withErrorLogging(handlePOST, {
  endpoint: '/api/cadastro',
  metodo: 'POST'
});
