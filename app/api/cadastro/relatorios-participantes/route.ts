import { auth } from "@/auth";
import { buscarCadastrosExportacao, buscarParticipantesExportacao } from "@/services/cadastros";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const busca = searchParams.get('busca') || '';
  const documentosEnviados = searchParams.get('documentosEnviados') || '';
  const projetosEnviados = searchParams.get('projetosEnviados') || '';
  const tipoInscricao = searchParams.get('tipoInscricao') || '';

  const { verificarPermissoes } = await import('@/services/usuarios');
  const isAdmin = await verificarPermissoes(session.user.id, ["DEV", "ADMIN"]);
  if (!isAdmin) {
    return NextResponse.json({ error: "Sem permissão para exportar cadastros" }, { status: 403 });
  }
  const { headers, rows } = await buscarParticipantesExportacao({ busca, documentosEnviados, projetosEnviados, tipoInscricao });
  
  // Criar workbook e worksheet
  const workbook = XLSX.utils.book_new();
  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Adicionar worksheet ao workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Cadastros');
  
  // Gerar buffer do arquivo XLSX
  const xlsxBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  
  const filename = `teste-cadastros-${new Date().toISOString().split('T')[0]}.xlsx`;
  return new NextResponse(xlsxBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

