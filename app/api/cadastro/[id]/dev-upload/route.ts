import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { TipoArquivo } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { verificarPermissoes } from "@/services/usuarios";
import { PDFDocument } from "pdf-lib";

type Categoria =
    | "doc-especifica"
    | "habilitacao"
    | "recurso"
    | "projetos"
    | "projetos2-identificado"
    | "projetos2-nao-identificado";

function resolverCategoria(categoria: Categoria): { tipo: TipoArquivo; prefix: string } {
    switch (categoria) {
        case "doc-especifica":
            return { tipo: TipoArquivo.DOC_ESPECIFICA, prefix: "EMAIL-" };
        case "habilitacao":
            return { tipo: TipoArquivo.DOC_ESPECIFICA, prefix: "HABILITACAO-EMAIL-" };
        case "recurso":
            return { tipo: TipoArquivo.DOC_ESPECIFICA, prefix: "RECURSO-EMAIL-" };
        case "projetos":
            return { tipo: TipoArquivo.PROJETOS, prefix: "EMAIL-" };
        case "projetos2-identificado":
            return { tipo: TipoArquivo.PROJETOS_2, prefix: "EMAIL-IDENTIFICADO-" };
        case "projetos2-nao-identificado":
            return { tipo: TipoArquivo.PROJETOS_2, prefix: "EMAIL-NAO_IDENTIFICADO-" };
    }
}

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const validaPermissao = await verificarPermissoes(session.user.id, ["DEV"]);
    if (!validaPermissao) {
        return NextResponse.json({ error: "Acesso restrito a usuários DEV" }, { status: 403 });
    }

    const { id } = await context.params;
    const cadastroId = parseInt(id);

    const cadastro = await db.cadastro.findUnique({ where: { id: cadastroId } });
    if (!cadastro) {
        return NextResponse.json({ error: "Cadastro não encontrado" }, { status: 404 });
    }

    try {
        const formData = await request.formData();
        const categoria = formData.get("categoria") as Categoria;
        const arquivos = formData.getAll("documentos") as File[];

        if (!categoria) {
            return NextResponse.json({ error: "Categoria não informada" }, { status: 400 });
        }

        if (!arquivos || arquivos.length === 0) {
            return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
        }

        const { tipo, prefix } = resolverCategoria(categoria);

        const uploadDir = join(process.cwd(), "uploads", "cadastros", id);
        await mkdir(uploadDir, { recursive: true });

        const arquivosSalvos = [];

        for (const arquivo of arquivos) {
            const timestamp = Date.now();
            const sanitizedName = arquivo.name
                .normalize("NFD")
                .replaceAll(" ", "_")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9._-]/g, "");
            const filename = `${prefix}${timestamp}-${sanitizedName}`;
            const filepath = join(uploadDir, filename);
            const relativePath = `uploads/cadastros/${id}/${filename}`;

            const bytes = await arquivo.arrayBuffer();
            let buffer = Buffer.from(bytes);

            const isPDF =
                (arquivo.type && arquivo.type.toLowerCase().includes("pdf")) ||
                filename.toLowerCase().endsWith(".pdf");
            if (isPDF) {
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
            }

            await writeFile(filepath, buffer);

            const arquivoSalvo = await db.arquivo.create({
                data: {
                    caminho: relativePath,
                    tipo,
                    cadastroId,
                    tamanho: buffer.length,
                },
            });

            arquivosSalvos.push(arquivoSalvo);
        }

        return NextResponse.json(
            { message: "Arquivos enviados com sucesso", arquivos: arquivosSalvos },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao fazer upload DEV:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
