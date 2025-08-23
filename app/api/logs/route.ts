import { NextRequest, NextResponse } from "next/server";
import { LogService } from "@/services/logs";
import { auth } from "@/auth";
import { NivelLog } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verificar se o usuário tem permissão DEV
    if (session.user.permissao !== "DEV") {
      return NextResponse.json({ error: "Acesso negado. Apenas usuários DEV podem acessar os logs." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const pagina = parseInt(searchParams.get("pagina") || "1");
    const limite = parseInt(searchParams.get("limite") || "20");
    const acao = searchParams.get("acao") || undefined;
    const entidade = searchParams.get("entidade") || undefined;
    const nivel = searchParams.get("nivel") || undefined;
    const usuarioId = searchParams.get("usuarioId") || undefined;
    const dataInicio = searchParams.get("dataInicio") ? new Date(searchParams.get("dataInicio")!) : undefined;
    const dataFim = searchParams.get("dataFim") ? new Date(searchParams.get("dataFim")!) : undefined;
    const busca = searchParams.get("busca") || undefined;

    console.log({nivel, acao})

    const logs = await LogService.buscarLogs(pagina, limite, {
      acao,
      entidade,
      nivel: nivel as NivelLog | "_all",
      usuarioId,
      dataInicio,
      dataFim,
      busca,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Erro ao buscar logs:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
