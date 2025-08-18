import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { TipoArquivo } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { id } = await context.params;
        const cadastroId = parseInt(id);

        // Verificar se o cadastro pertence ao usuário
        const cadastro = await db.cadastro.findFirst({
            where: {
                id: cadastroId,
                usuarioId: session.user.id
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
        const MAX_SIZE_DOC_ESPECIFICA = 50 * 1024 * 1024; // 50MB
        const MAX_SIZE_PROJETOS = 200 * 1024 * 1024; // 200MB
        
        const maxSizeForType = tipo === TipoArquivo.DOC_ESPECIFICA ? MAX_SIZE_DOC_ESPECIFICA : MAX_SIZE_PROJETOS;

        // Calcular tamanho total atual dos arquivos do mesmo tipo
        const arquivosExistentes = await db.arquivo.findMany({
            where: { 
                cadastroId,
                tipo: tipo
            }
        });

        const tamanhoTotalExistente = arquivosExistentes.reduce((total, arquivo) => {
            return total + (arquivo.tamanho || 0);
        }, 0);

        const tamanhoNovosArquivos = arquivos.reduce((total, arquivo) => {
            return total + arquivo.size;
        }, 0);

        if (tamanhoTotalExistente + tamanhoNovosArquivos > maxSizeForType) {
            const tipoDescricao = tipo === TipoArquivo.DOC_ESPECIFICA ? 'documentos' : 'projetos';
            const limite = tipo === TipoArquivo.DOC_ESPECIFICA ? '50MB' : '200MB';
            
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
            const filename = `${timestamp}-${arquivo.name}`;
            const filepath = join(uploadDir, filename);
            // Usar barras normais para o caminho relativo (padrão web)
            const relativePath = `uploads/cadastros/${id}/${filename}`;
            
            console.log(`Salvando arquivo: ${filename} em ${relativePath}`);

            // Salvar arquivo no sistema de arquivos
            const bytes = await arquivo.arrayBuffer();
            const buffer = Buffer.from(bytes);
            await writeFile(filepath, buffer);

            // Salvar referência no banco de dados
            const arquivoSalvo = await db.arquivo.create({
                data: {
                    caminho: relativePath,
                    tipo: tipo,
                    cadastroId: cadastroId,
                    tamanho: arquivo.size
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
