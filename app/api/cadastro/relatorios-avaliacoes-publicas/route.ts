import { auth } from "@/auth";
import { buscarAvaliacoesPublicasExportacao } from "@/services/cadastros";
import { NextResponse } from "next/server";
import * as XLSX from 'xlsx';

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { verificarPermissoes } = await import('@/services/usuarios');
  const isAdmin = await verificarPermissoes(session.user.id, ["DEV", "ADMIN"]);
  if (!isAdmin) {
    return NextResponse.json({ error: "Sem permissão para exportar avaliações públicas" }, { status: 403 });
  }

  const { headers, rows } = await buscarAvaliacoesPublicasExportacao();

  const workbook = XLSX.utils.book_new();
  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Avaliações Públicas');

  const xlsxBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  const filename = `avaliacoes-publicas-${new Date().toISOString().split('T')[0]}.xlsx`;
  return new NextResponse(xlsxBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
