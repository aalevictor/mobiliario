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

    const cadastro = await db.cadastro.findFirst({
        where: {
            id: cadastroId,
            ...(!validaPermissao && { usuarioId: session.user.id })
        }
    });
    if (!cadastro) return NextResponse.json({ error: "Cadastro não encontrado" }, { status: 404 });

    const dataLimite = new Date('2026-03-20T23:59:59.999');
    const dentroDoPrazo = new Date() <= dataLimite;
    const podeExcluir = (cadastro.finalista && dentroDoPrazo) || validaPermissao;
    if (!podeExcluir) {
        if (!cadastro.finalista) return NextResponse.json({ error: "Não é possível remover documentos. Cadastro não habilitado para Fase 2." }, { status: 400 });
        return NextResponse.json({ error: "Prazo de envio encerrado em 20/03/2026." }, { status: 400 });
    }

    try {
        const arquivo = await db.arquivo.findFirst({
            where: { id: arquivoId, cadastroId }
        });

        if (!arquivo) {
            return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
        }

        try {
            const filepath = join(process.cwd(), arquivo.caminho);
            await unlink(filepath);
        } catch (error) {
            console.error('Erro ao deletar arquivo do sistema:', error);
        }

        await db.arquivo.delete({ where: { id: arquivoId } });

        return NextResponse.json({ message: "Arquivo removido com sucesso" }, { status: 200 });

    } catch (error) {
        console.error('Erro ao deletar arquivo:', error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string; arquivoId: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }
        const { id, arquivoId } = await context.params;
        const cadastroId = parseInt(id);

        const isAdmin = await verificarPermissoes(session.user.id, ["DEV", "ADMIN", "LICITACAO"]);
        const isJulgadora = await verificarPermissoes(session.user.id, ["JULGADORA"]);

        const cadastro = await db.cadastro.findFirst({
            where: {
                id: cadastroId,
                ...((isAdmin || isJulgadora) ? {} : { usuarioId: session.user.id })
            }
        });
        if (!cadastro) {
            return NextResponse.json({ error: "Cadastro não encontrado" }, { status: 404 });
        }

        const arquivo = await db.arquivo.findFirst({
            where: { id: arquivoId, cadastroId }
        });

        if (!arquivo) {
            return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
        }

        // Julgadora só pode acessar arquivos NAO_IDENTIFICADO
        if (isJulgadora && !isAdmin) {
            const nome = arquivo.caminho.split('/').pop() || '';
            const eIdentificado = nome.startsWith('IDENTIFICADO-') || nome.startsWith('EMAIL-IDENTIFICADO-');
            if (eIdentificado) {
                return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
            }
        }

        const filepath = join(process.cwd(), arquivo.caminho);

        try {
            const { readFile } = await import('fs/promises');
            const fileBuffer = await readFile(filepath);

            const ext = arquivo.caminho.split('.').pop()?.toLowerCase();
            let contentType = 'application/octet-stream';
            switch (ext) {
                case 'pdf': contentType = 'application/pdf'; break;
                case 'jpg': case 'jpeg': contentType = 'image/jpeg'; break;
                case 'png': contentType = 'image/png'; break;
                case 'doc': contentType = 'application/msword'; break;
                case 'docx': contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; break;
                case 'dwg': contentType = 'application/acad'; break;
                case 'dxf': contentType = 'application/dxf'; break;
                case 'zip': contentType = 'application/zip'; break;
                case 'rar': contentType = 'application/vnd.rar'; break;
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
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
