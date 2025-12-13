import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Arquivo, TipoArquivo } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { verificarPermissoes } from "@/services/usuarios";
import { PDFDocument } from "pdf-lib";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const validaPermissao = await verificarPermissoes(session.user.id, ["DEV", "ADMIN"]);

  // Janela específica: 11/12 00:00 até 12/12 23:59:59.999 (ano corrente)
  const anoAtual = new Date().getFullYear();
  const dataAberturaHabilitacao = new Date(`${anoAtual}-12-11 00:00:00`);
  const dataLimiteHabilitacao = new Date(`${anoAtual}-12-13 05:30:00`);
  const dataAtual = new Date();
  const podeEnviarHabilitacao = dataAtual >= dataAberturaHabilitacao && dataAtual <= dataLimiteHabilitacao;

  try {
    const { id } = await context.params;
    const cadastroId = parseInt(id);

    // Verificar se o cadastro pertence ao usuário e se está classificado
    const cadastro = await db.cadastro.findFirst({
      where: {
        id: cadastroId,
        ...(!validaPermissao && { usuarioId: session.user.id }),
      },
      include: {
        avaliacao_licitadora: true,
      },
    });

    if (!cadastro) {
      return NextResponse.json({ error: "Cadastro não encontrado" }, { status: 404 });
    }

    // Somente classificados podem enviar habilitação
    const isClassificado = !!cadastro.avaliacao_licitadora?.classificado;
    if (!isClassificado && !validaPermissao) {
      return NextResponse.json({ error: "Cadastro não classificado para habilitação" }, { status: 403 });
    }

    const formData = await request.formData();
    const tipo = formData.get("tipo") as TipoArquivo;
    const arquivos = formData.getAll("documentos") as File[];

    if (!arquivos || arquivos.length === 0) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Forçar tipo DOC_ESPECIFICA
    if (tipo !== TipoArquivo.DOC_ESPECIFICA) {
      return NextResponse.json({ error: "Tipo de arquivo inválido" }, { status: 400 });
    }

    // Bloquear fora da janela específica (exceto admin/dev)
    if (!podeEnviarHabilitacao && !validaPermissao) {
      return NextResponse.json({ error: "Fora do período de habilitação" }, { status: 400 });
    }

    // Apenas PDFs
    for (const arquivo of arquivos) {
      const isPDF = (arquivo.type && arquivo.type.toLowerCase().includes("pdf")) || arquivo.name.toLowerCase().endsWith(".pdf");
      if (!isPDF) {
        return NextResponse.json({ error: "Apenas arquivos PDF são aceitos" }, { status: 400 });
      }
    }

    // Limite total de 10MB por cadastro para documentos de habilitação (prefixo HABILITACAO-)
    const MAX_SIZE_HABILITACAO = 50 * 1024 * 1024; // 10MB

    const arquivosHabilitacaoExistentes = await db.arquivo.findMany({
      where: {
        cadastroId,
        tipo: TipoArquivo.DOC_ESPECIFICA,
        caminho: { contains: "HABILITACAO-" },
      },
    });

    const tamanhoTotalExistente = arquivosHabilitacaoExistentes.reduce((total: number, arquivo: Partial<Arquivo>) => {
      return total + (arquivo.tamanho || 0);
    }, 0);

    const tamanhoNovosArquivos = arquivos.reduce((total, arquivo) => {
      return total + arquivo.size;
    }, 0);

    if (tamanhoTotalExistente + tamanhoNovosArquivos > MAX_SIZE_HABILITACAO && !validaPermissao) {
      return NextResponse.json(
        { error: `Tamanho total dos documentos de habilitação excede o limite de 10MB` },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), "uploads", "cadastros", id);

    // Criar diretório se não existir
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error("Erro ao criar diretório:", error);
    }

    const arquivosSalvos = [] as Arquivo[];

    for (const arquivo of arquivos) {
      const timestamp = Date.now();
      const sanitizedOriginalName = arquivo.name
        .normalize("NFD")
        .replaceAll(" ", "_")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9._-]/g, "");

      // Prefixo para identificar habilitação
      const filename = `HABILITACAO-${timestamp}-${sanitizedOriginalName}`;
      const filepath = join(uploadDir, filename);
      const relativePath = `uploads/cadastros/${id}/${filename}`;

      // Ler dados
      const bytes = await arquivo.arrayBuffer();
      let buffer = Buffer.from(bytes);

      // Sanitizar PDF
      try {
        const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const newDoc = await PDFDocument.create();
        const pages = await newDoc.copyPages(srcDoc, srcDoc.getPageIndices());
        pages.forEach((p) => newDoc.addPage(p));

        newDoc.setTitle("");
        newDoc.setAuthor("");
        newDoc.setSubject("");
        newDoc.setKeywords([]);
        newDoc.setProducer("");
        newDoc.setCreator("");
        newDoc.setCreationDate(new Date(0));
        newDoc.setModificationDate(new Date());

        const sanitizedBytes = await newDoc.save();
        buffer = Buffer.from(sanitizedBytes);
      } catch (e) {
        console.warn("Falha ao sanitizar PDF, salvando original:", e);
      }

      await writeFile(filepath, buffer);

      const arquivoSalvo = await db.arquivo.create({
        data: {
          caminho: relativePath,
          tipo: TipoArquivo.DOC_ESPECIFICA,
          cadastroId: cadastroId,
          tamanho: buffer.length,
        },
      });

      arquivosSalvos.push(arquivoSalvo);
    }

    return NextResponse.json(
      {
        message: "Documentos de habilitação enviados com sucesso",
        arquivos: arquivosSalvos,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao fazer upload de habilitação:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}