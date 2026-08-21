/** @format */

import { db } from "@/lib/prisma";
import { verificaLimite, verificaPagina } from "@/lib/utils";
import { NOME_TIPO_ARQUIVO, IArquivoListagem, extrairExtensaoArquivo } from "@/lib/tipo-arquivo";

export { NOME_TIPO_ARQUIVO };
export type { IArquivoListagem };

function construirWhereArquivos(extensoes?: string, busca?: string) {
  const extensoesArray = extensoes ? extensoes.split(",").filter(Boolean) : [];
  const AND: object[] = [];

  if (extensoesArray.length > 0) {
    AND.push({
      OR: extensoesArray.map((extensao) => ({ caminho: { endsWith: `.${extensao.toLowerCase()}` } })),
    });
  }

  if (busca) {
    AND.push({
      OR: [
        { caminho: { contains: busca } },
        { cadastro: { nome: { contains: busca } } },
        { cadastro: { email: { contains: busca } } },
        { cadastro: { protocolo: { contains: busca } } },
      ],
    });
  }

  return AND.length > 0 ? { AND } : {};
}

async function buscarArquivos(
  pagina: number = 1,
  limite: number = 10,
  extensoes?: string,
  busca?: string,
) {
  [pagina, limite] = verificaPagina(pagina, limite);
  const where = construirWhereArquivos(extensoes, busca);

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

async function buscarExtensoesArquivoDisponiveis() {
  const arquivos = await db.arquivo.findMany({ select: { caminho: true } });
  const extensoes = new Set<string>();
  for (const arquivo of arquivos) {
    const extensao = extrairExtensaoArquivo(arquivo.caminho);
    if (extensao) extensoes.add(extensao);
  }
  return Array.from(extensoes)
    .sort()
    .map((extensao) => ({ value: extensao, label: extensao }));
}

async function buscarArquivosParaExportacaoZip(extensoes?: string, busca?: string) {
  return db.arquivo.findMany({
    where: construirWhereArquivos(extensoes, busca),
    select: {
      caminho: true,
      tipo: true,
      cadastro: { select: { id: true, protocolo: true } },
    },
  });
}

export { buscarArquivos, buscarExtensoesArquivoDisponiveis, buscarArquivosParaExportacaoZip };
