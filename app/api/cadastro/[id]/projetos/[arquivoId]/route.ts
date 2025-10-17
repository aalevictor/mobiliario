import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { unlink } from "fs/promises";
import { join } from "path";
import { verificarPermissoes } from "@/services/usuarios";

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string; arquivoId: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const { id, arquivoId } = await context.params;
    const cadastroId = parseInt(id);

    const validaPermissao = await verificarPermissoes(session.user.id, ["DEV", "ADMIN"]);
    const dataAberturaProjetos = new Date("2025-10-13 00:00:00")
    const dataLimiteProjetos = new Date("2025-10-27 23:59:59.999");
    const dataAtual = new Date();
    const cadastro = await db.cadastro.findFirst({
        where: { 
            id: cadastroId,
            ...(!validaPermissao && { usuarioId: session.user.id })
        },
        include: {
            avaliacao_licitadora: {
                select: {
                    aprovado: true
                }
            }
        }
    });
    if (!cadastro) return NextResponse.json({ error: "Cadastro não encontrado" }, { status: 404 });
    const eDeferido = cadastro.avaliacao_licitadora && cadastro.avaliacao_licitadora.aprovado;
    const podeExcluirProjetos = cadastroId === 57 || (dataAtual >= dataAberturaProjetos && dataAtual <= dataLimiteProjetos && eDeferido);
    
    try {
        // Buscar o arquivo
        const arquivo = await db.arquivo.findFirst({
            where: {
                id: arquivoId,
                cadastroId: cadastroId
            }
        });

        if (!arquivo) {
            return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
        }

        if (!podeExcluirProjetos) {
            if (validaPermissao) {
                if (!arquivo.caminho.split("/").pop()?.startsWith("EMAIL-") && !arquivo.caminho.split("/").pop()?.startsWith("RECURSO-EMAIL-"))
                    return NextResponse.json({ error: "Não é possível remover documentos fora do período de inscrição." }, { status: 400 });
            } else {
                return NextResponse.json({ error: "Não é possível remover documentos fora do período de inscrição." }, { status: 400 });
            }
        }

        // Deletar arquivo do sistema de arquivos
        try {
            const filepath = join(process.cwd(), arquivo.caminho);
            await unlink(filepath);
        } catch (error) {
            console.error('Erro ao deletar arquivo do sistema:', error);
            // Continuar mesmo se não conseguir deletar o arquivo físico
        }

        // Deletar registro do banco de dados
        await db.arquivo.delete({
            where: { id: arquivoId }
        });

        return NextResponse.json({ 
            message: "Arquivo removido com sucesso" 
        }, { status: 200 });

    } catch (error) {
        console.error('Erro ao deletar arquivo:', error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string; arquivoId: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            console.log('GET /api/cadastro/[id]/projetos/[arquivoId] - Sem sessão');
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }
        const { id, arquivoId } = await context.params;
        const cadastroId = parseInt(id);
        console.log(`GET /api/cadastro/${id}/projetos/${arquivoId} - Usuário: ${session.user.id}`);
        // Verificar permissões - proprietário do cadastro ou admin/dev
        const isAdmin = await verificarPermissoes(session.user.id, ["DEV", "ADMIN", "JULGADORA"]);
        const cadastro = await db.cadastro.findFirst({
            where: {
                id: cadastroId,
                ...(isAdmin ? {} : { usuarioId: session.user.id })
            }
        });
        if (!cadastro) {
            console.log(`Cadastro ${cadastroId} não encontrado para usuário ${session.user.id}`);
            return NextResponse.json({ error: "Cadastro não encontrado" }, { status: 404 });
        }
        // Buscar o arquivo
        const arquivo = await db.arquivo.findFirst({
            where: {
                id: arquivoId,
                cadastroId: cadastroId
            }
        });

        if (!arquivo) {
            console.log(`Arquivo ${arquivoId} não encontrado para cadastro ${cadastroId}`);
            return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
        }
        
        console.log(`Arquivo encontrado: ${arquivo.caminho}`);

        // Retornar o arquivo para download
        const filepath = join(process.cwd(), arquivo.caminho);
        
        console.log(`Tentando ler arquivo em: ${filepath}`);
        
        try {
            const { readFile } = await import('fs/promises');
            const fileBuffer = await readFile(filepath);
            
            console.log(`Arquivo lido com sucesso. Tamanho: ${fileBuffer.length} bytes`);
            
            // Determinar o tipo de conteúdo baseado na extensão
            const ext = arquivo.caminho.split('.').pop()?.toLowerCase();
            let contentType = 'application/octet-stream';
            
            switch (ext) {
                case 'pdf':
                    contentType = 'application/pdf';
                    break;
                case 'jpg':
                case 'jpeg':
                    contentType = 'image/jpeg';
                    break;
                case 'png':
                    contentType = 'image/png';
                    break;
                case 'doc':
                    contentType = 'application/msword';
                    break;
                case 'docx':
                    contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                    break;
                case 'dwg':
                    contentType = 'application/acad';
                    break;
                case 'dxf':
                    contentType = 'application/dxf';
                    break;
                case 'zip':
                    contentType = 'application/zip';
                    break;
                case 'rar':
                    contentType = 'application/vnd.rar';
                    break;
            }

            return new NextResponse(new Uint8Array(fileBuffer), {
                headers: {
                    'Content-Type': contentType,
                    'Content-Disposition': `attachment; filename="${arquivo.caminho.split('/').pop()}"`,
                },
            });
        } catch (error) {
            console.error('Erro ao ler arquivo:', error);
            return NextResponse.json({ error: "Arquivo não encontrado no sistema" }, { status: 404 });
        }

    } catch (error) {
        console.error('Erro ao fazer download:', error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
