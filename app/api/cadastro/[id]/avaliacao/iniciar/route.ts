import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/prisma'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session || !session.user.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { id } = await params
        const cadastroId = parseInt(id)

        if (isNaN(cadastroId)) {
            return NextResponse.json({ error: 'ID do cadastro inválido' }, { status: 400 })
        }

        // Verificar se o cadastro existe
        const cadastro = await db.cadastro.findUnique({
            where: { id: cadastroId }
        })

        if (!cadastro) {
            return NextResponse.json({ error: 'Cadastro não encontrado' }, { status: 404 })
        }

        // Verificar se já existe uma avaliação para este cadastro
        const avaliacaoExistente = await db.avaliacao_Julgadora.findFirst({
            where: { 
                cadastroId,
                avaliadorId: session.user.id
            }
        })

        if (avaliacaoExistente) {
            return NextResponse.json({ error: 'Avaliação já existe para este cadastro' }, { status: 400 })
        }

        // Criar nova avaliação com notas zeradas
        const novaAvaliacao = await db.avaliacao_Julgadora.create({
            data: {
                cadastroId,
                avaliadorId: session.user.id,
                linhaTematica1: 0,
                linhaTematica2: 0,
                linhaTematica3: 0,
                conceitoProjetual: 0,
                atendimentoNormas: 0,
                insercaoUrbana: 0,
                qualidadeFuncional: 0,
                exequibilidade: 0,
                economicidade: 0
            }
        })

        return NextResponse.json(novaAvaliacao)
    } catch (error) {
        console.error('Erro ao iniciar avaliação:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}