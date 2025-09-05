import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { buscarDuvidasExportacao } from "@/services/duvidas";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { verificarPermissoes } = await import('@/services/usuarios');
  const isAdmin = await verificarPermissoes(session.user.id, ["DEV", "ADMIN"]);
  if (!isAdmin) {
    return NextResponse.json({ error: "Sem permissão para exportar cadastros" }, { status: 403 });
  }
  const { headers, rows } = await buscarDuvidasExportacao();
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  const filename = `cadastros-${new Date().toISOString().split('T')[0]}.csv`;
  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

