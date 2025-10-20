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
    const dataAberturaDocumento = new Date("2025-09-08 00:00:00")
    const dataLimiteDocumento = new Date("2025-09-22 23:59:59.999")
    const dataAberturaComplementar = new Date("2025-09-26 08:00:00")
    const dataLimiteComplementar = new Date("2025-09-26 15:00:00")
    const dataAtual = new Date()
    const podeEnviarDocumento = dataAtual >= dataAberturaDocumento && dataAtual <= dataLimiteDocumento
    const podeEnviarComplementar = dataAtual >= dataAberturaComplementar && dataAtual <= dataLimiteComplementar
    if (!podeEnviarDocumento && !podeEnviarComplementar && !validaPermissao) return NextResponse.json({ error: "Não é possível atualizar os dados do cadastro fora do período de inscrição." }, { status: 400 });
    try {
        const { id } = await context.params;
        const cadastroId = parseInt(id);

        // Verificar se o cadastro pertence ao usuário
        const cadastro = await db.cadastro.findFirst({
            where: {
                id: cadastroId,
                ...(!validaPermissao && { usuarioId: session.user.id })
            }
        });

        if (!cadastro) {
            return NextResponse.json({ error: "Cadastro não encontrado" }, { status: 404 });
        }

        const formData = await request.formData();
        const tipo = formData.get('tipo') as TipoArquivo;
        const arquivos = formData.getAll('documentos') as File[];

        if (!arquivos || arquivos.length === 0) {
            return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
        }

        // Definir limites baseados no tipo de arquivo
        const MAX_SIZE_DOC_ESPECIFICA = 20 * 1024 * 1024; // 50MB
        const MAX_SIZE_PROJETOS = 180 * 1024 * 1024; // 200MB
        
        const maxSizeForType = tipo === TipoArquivo.DOC_ESPECIFICA ? MAX_SIZE_DOC_ESPECIFICA : MAX_SIZE_PROJETOS;

        // Calcular tamanho total atual dos arquivos do mesmo tipo
        const arquivosExistentes = await db.arquivo.findMany({
            where: { 
                cadastroId,
                tipo: tipo
            }
        });

        const tamanhoTotalExistente = arquivosExistentes.reduce((total: number, arquivo: Partial<Arquivo>) => {
            return total + (arquivo.tamanho || 0);
        }, 0);

        const tamanhoNovosArquivos = arquivos.reduce((total, arquivo) => {
            return total + arquivo.size;
        }, 0);

        if (tamanhoTotalExistente + tamanhoNovosArquivos > maxSizeForType && !validaPermissao) {
            const tipoDescricao = tipo === TipoArquivo.DOC_ESPECIFICA ? 'documentos' : 'projetos';
            const limite = tipo === TipoArquivo.DOC_ESPECIFICA ? '20MB' : '180MB';
            
            return NextResponse.json(
                { error: `Tamanho total dos ${tipoDescricao} excede o limite de ${limite}` },
                { status: 400 }
            );
        }

        const uploadDir = join(process.cwd(), 'uploads', 'cadastros', id);
        
        // Criar diretório se não existir
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (error) {
            console.error('Erro ao criar diretório:', error);
        }

        const arquivosSalvos = [];

        for (const arquivo of arquivos) {
            // Gerar nome único para o arquivo
            const timestamp = Date.now();
            const filename = `${timestamp}-${arquivo.name.normalize('NFD').replaceAll(" ", "_").replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, "")}`;
            const filepath = join(uploadDir, filename);
            // Usar barras normais para o caminho relativo (padrão web)
            const relativePath = `uploads/cadastros/${id}/${filename}`;

            // Salvar arquivo no sistema de arquivos
            const bytes = await arquivo.arrayBuffer();
            let buffer = Buffer.from(bytes);

            // Se for PDF, regravar páginas em um novo documento e limpar metadados
            const isPDF = (arquivo.type && arquivo.type.toLowerCase().includes('pdf')) || filename.toLowerCase().endsWith('.pdf')
            if (isPDF) {
                try {
                    const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })
                    const newDoc = await PDFDocument.create()
                    const pages = await newDoc.copyPages(srcDoc, srcDoc.getPageIndices())
                    pages.forEach(p => newDoc.addPage(p))

                    newDoc.setTitle('')
                    newDoc.setAuthor('')
                    newDoc.setSubject('')
                    newDoc.setKeywords([])
                    newDoc.setProducer('')
                    newDoc.setCreator('')
                    newDoc.setCreationDate(new Date(0))
                    newDoc.setModificationDate(new Date())

                    const sanitizedBytes = await newDoc.save()
                    buffer = Buffer.from(sanitizedBytes)
                } catch (e) {
                    console.warn('Falha ao sanitizar PDF, salvando original:', e)
                }
            }

            await writeFile(filepath, buffer);

            // Salvar referência no banco de dados
            const arquivoSalvo = await db.arquivo.create({
                data: {
                    caminho: relativePath,
                    tipo: tipo,
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
