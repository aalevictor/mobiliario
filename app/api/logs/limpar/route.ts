import { NextRequest, NextResponse } from "next/server";
import { LogService } from "@/services/logs";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verificar se o usuário tem permissão DEV
    if (user.permissao !== "DEV") {
      return NextResponse.json({ error: "Acesso negado. Apenas usuários DEV podem limpar logs." }, { status: 403 });
    }

    const { dias = 90 } = await request.json();
    
    const logsRemovidos = await LogService.limparLogsAntigos(dias);

    // Log da ação de limpeza
    await LogService.criarLog({
      acao: "CLEANUP",
      entidade: "LOGS",
      mensagem: `Limpeza automática de logs antigos (mais de ${dias} dias). ${logsRemovidos} logs removidos.`,
      nivel: "INFO",
      usuarioId: session.user.id,
    });

    return NextResponse.json({ 
      mensagem: `${logsRemovidos} logs antigos foram removidos com sucesso.`,
      logsRemovidos 
    });
  } catch (error) {
    console.error("Erro ao limpar logs:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
