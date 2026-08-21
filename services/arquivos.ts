/** @format */

import { TipoArquivo } from "@prisma/client";
import { db } from "@/lib/prisma";
import { verificaLimite, verificaPagina } from "@/lib/utils";
import { NOME_TIPO_ARQUIVO, IArquivoListagem } from "@/lib/tipo-arquivo";

export { NOME_TIPO_ARQUIVO };
export type { IArquivoListagem };

function construirWhereArquivos(tipos?: string, busca?: string) {
  const tiposArray = tipos ? (tipos.split(",").filter(Boolean) as TipoArquivo[]) : [];

  return {
    ...(tiposArray.length > 0 && { tipo: { in: tiposArray } }),
    ...(busca && {
      OR: [
        { caminho: { contains: busca } },
        { cadastro: { nome: { contains: busca } } },
        { cadastro: { email: { contains: busca } } },
        { cadastro: { protocolo: { contains: busca } } },
      ],
    }),
  };
}

async function buscarArquivos(
  pagina: number = 1,
  limite: number = 10,
  tipos?: string,
  busca?: string,
) {
  [pagina, limite] = verificaPagina(pagina, limite);
  const where = construirWhereArquivos(tipos, busca);

  const total = await db.arquivo.count({ where });
  if (total === 0) return { total: 0, pagina: 0, limite: 0, data: [] };
  [pagina, limite] = verificaLimite(pagina, limite, total);

  const arquivos = await db.arquivo.findMany({
    where,
    include: {
      cadastro: {
        select: { id: true, nome: true, email: true, protocolo: true },
      },
    },
    orderBy: { criadoEm: "desc" },
    skip: (pagina - 1) * limite,
    take: limite,
  });

  return {
    total,
    pagina,
    limite,
    data: arquivos as IArquivoListagem[],
  };
}

async function buscarTiposArquivoDisponiveis() {
  const tipos = await db.arquivo.findMany({
    distinct: ["tipo"],
    select: { tipo: true },
    orderBy: { tipo: "asc" },
  });
  return tipos.map((item) => ({
    value: item.tipo,
    label: NOME_TIPO_ARQUIVO[item.tipo] || item.tipo,
  }));
}

async function buscarArquivosParaExportacaoZip(tipos?: string, busca?: string) {
  return db.arquivo.findMany({
    where: construirWhereArquivos(tipos, busca),
    select: {
      caminho: true,
      tipo: true,
      cadastro: { select: { id: true, protocolo: true } },
    },
  });
}

export { buscarArquivos, buscarTiposArquivoDisponiveis, buscarArquivosParaExportacaoZip };
