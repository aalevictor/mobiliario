import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Arquivo, TipoArquivo } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { verificarPermissoes } from "@/services/usuarios";
import { PDFDocument } from "pdf-lib";

const MAX_TOTAL = 600 * 1024 * 1024; // 600MB total

function isIdentificado(caminho: string): boolean {
    const nome = caminho.split('/').pop() || '';
    return nome.startsWith('IDENTIFICADO-') || nome.startsWith('EMAIL-IDENTIFICADO-');
}

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const { id } = await context.params;
    const cadastroId = parseInt(id);

    const validaPermissao = await verificarPermissoes(session.user.id, ["DEV", "ADMIN"]);

    const cadastro = await db.cadastro.findFirst({
        where: {
            id: cadastroId,
            ...(!validaPermissao && { usuarioId: session.user.id })
        }
    });
    if (!cadastro) return NextResponse.json({ error: "Cadastro não encontrado" }, { status: 404 });

    const dataLimite = new Date('2026-03-20T23:59:59.999');
    const dentroDoPrazo = new Date() <= dataLimite;
    const podeEnviar = (cadastro.finalista && dentroDoPrazo) || validaPermissao;
    if (!podeEnviar) {
        if (!cadastro.finalista) return NextResponse.json({ error: "Não é possível enviar documentos. Cadastro não habilitado para Fase 2." }, { status: 400 });
        return NextResponse.json({ error: "Prazo de envio encerrado em 20/03/2026." }, { status: 400 });
    }

    try {
        const formData = await request.formData();
        const arquivos = formData.getAll('documentos') as File[];
        const identificado = formData.get('identificado') === 'true';

        if (!arquivos || arquivos.length === 0) {
            return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
        }

        const prefix = identificado ? 'IDENTIFICADO-' : 'NAO_IDENTIFICADO-';

        // Buscar arquivos existentes do mesmo subtipo para checar limite
        const arquivosExistentes = await db.arquivo.findMany({
            where: { cadastroId, tipo: TipoArquivo.PROJETOS_2 }
        });

        const tamanhoTotalExistente = arquivosExistentes.reduce((total: number, arquivo: Partial<Arquivo>) => {
            return total + (arquivo.tamanho || 0);
        }, 0);

        const tamanhoNovosArquivos = arquivos.reduce((total, arquivo) => total + arquivo.size, 0);

        if (tamanhoTotalExistente + tamanhoNovosArquivos > MAX_TOTAL && !validaPermissao) {
            return NextResponse.json(
                { error: `Tamanho total dos arquivos da Fase 2 excede o limite de 600MB` },
                { status: 400 }
            );
        }

        const uploadDir = join(process.cwd(), 'uploads', 'cadastros', id);
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (error) {
            console.error('Erro ao criar diretório:', error);
        }

        const arquivosSalvos = [];

        for (const arquivo of arquivos) {
            const timestamp = Date.now();
            const filename = `${validaPermissao ? "EMAIL-" : ""}${prefix}${timestamp}-${arquivo.name.normalize('NFD').replaceAll(" ", "_").replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, "")}`;
            const filepath = join(uploadDir, filename);
            const relativePath = `uploads/cadastros/${id}/${filename}`;

            const bytes = await arquivo.arrayBuffer();
            let buffer = Buffer.from(bytes);

            const isPDF = (arquivo.type && arquivo.type.toLowerCase().includes('pdf')) || filename.toLowerCase().endsWith('.pdf');
            if (isPDF) {
                try {
                    const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
                    const newDoc = await PDFDocument.create();
                    const pages = await newDoc.copyPages(srcDoc, srcDoc.getPageIndices());
                    pages.forEach(p => newDoc.addPage(p));
                    newDoc.setTitle('');
                    newDoc.setAuthor('');
                    newDoc.setSubject('');
                    newDoc.setKeywords([]);
                    newDoc.setProducer('');
                    newDoc.setCreator('');
                    newDoc.setCreationDate(new Date(0));
                    newDoc.setModificationDate(new Date());
                    const sanitizedBytes = await newDoc.save();
                    buffer = Buffer.from(sanitizedBytes);
                } catch (e) {
                    console.warn('Falha ao sanitizar PDF, salvando original:', e);
                }
            }

            await writeFile(filepath, buffer);

            const arquivoSalvo = await db.arquivo.create({
                data: {
                    caminho: relativePath,
                    tipo: TipoArquivo.PROJETOS_2,
                    cadastroId: cadastroId,
                    tamanho: buffer.length
                }
            });

            arquivosSalvos.push(arquivoSalvo);
        }

        return NextResponse.json({
            message: "Arquivos enviados com sucesso",
            arquivos: arquivosSalvos
        }, { status: 201 });

    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
