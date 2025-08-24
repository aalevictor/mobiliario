import { auth } from "@/auth";
import { criarUsuario, verificarPermissoes } from "@/services/usuarios";
import { ICreateUsuario } from "@/types/usuario";
import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/error-handler";
import { AuditLogger } from "@/lib/audit-logger";
import { NivelLog } from "@prisma/client";

async function handler(request: NextRequest) {
    const session = await auth();
    if (!session) {
        await AuditLogger.logAuth(
            'TENTATIVA_ACESSO_NAO_AUTORIZADO',
            undefined,
            request.headers.get('x-forwarded-for') || 'unknown',
            request.headers.get('user-agent') || '',
            NivelLog.WARNING
        );
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    if (!await verificarPermissoes(session.user.id, ["ADMIN", "DEV"])) {
        await AuditLogger.logAuth(
            'TENTATIVA_CRIAR_USUARIO_SEM_PERMISSAO',
            session.user.id,
            request.headers.get('x-forwarded-for') || 'unknown',
            request.headers.get('user-agent') || '',
            NivelLog.WARNING
        );
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    const data: ICreateUsuario = await request.json();
    
    try {
        // Log da tentativa de criação
        await AuditLogger.logAuth(
            'CRIAR_USUARIO_INICIADO',
            session.user.id,
            request.headers.get('x-forwarded-for') || 'unknown',
            request.headers.get('user-agent') || '',
            NivelLog.INFO
        );
        
        const usuario = await criarUsuario(data);
        
        if (!usuario) {
            await AuditLogger.logError(
                'Falha ao criar usuário - retorno nulo',
                undefined,
                NivelLog.ERROR,
                '/api/usuario',
                'POST',
                session.user.id,
                request.headers.get('x-forwarded-for') || 'unknown',
                request.headers.get('user-agent') || ''
            );
            return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 });
        }
        
        // Log de sucesso na criação
        await AuditLogger.logAuth(
            'USUARIO_CRIADO_SUCESSO',
            session.user.id,
            request.headers.get('x-forwarded-for') || 'unknown',
            request.headers.get('user-agent') || '',
            NivelLog.INFO
        );
        
        return NextResponse.json({ message: "Usuário criado com sucesso" }, { status: 201 });
    } catch (error) {
        await AuditLogger.logError(
            `Erro ao criar usuário: ${error}`,
            error instanceof Error ? error.stack : undefined,
            NivelLog.ERROR,
            '/api/usuario',
            'POST',
            session.user.id,
            request.headers.get('x-forwarded-for') || 'unknown',
            request.headers.get('user-agent') || ''
        );
        return NextResponse.json({ error }, { status: 500 });
    }
}

export const POST = withErrorHandling(handler);