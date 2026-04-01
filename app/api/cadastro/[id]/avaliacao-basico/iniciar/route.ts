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

        const cadastro = await db.cadastro.findUnique({ where: { id: cadastroId } })
        if (!cadastro) {
            return NextResponse.json({ error: 'Cadastro não encontrado' }, { status: 404 })
        }

        const avaliacaoExistente = await db.avaliacao_Basico.findFirst({ where: { cadastroId, avaliadorId: session.user.id } })
        if (avaliacaoExistente) {
            return NextResponse.json({ error: 'Avaliação básica já existe para este cadastro' }, { status: 400 })
        }

        const novaAvaliacao = await db.avaliacao_Basico.create({
            data: {
                cadastroId,
                avaliadorId: session.user.id,
                qualidade_detalhamento: 0,
                coerencia_compatibilidade: 0,
                exequibiliade: 0,
                sustentabilidade: 0,
                viabilidade_economica: 0,
                qualidade_grafica: 0,
            }
        })

        return NextResponse.json(novaAvaliacao)
    } catch (error) {
        console.error('Erro ao iniciar avaliação básica:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
