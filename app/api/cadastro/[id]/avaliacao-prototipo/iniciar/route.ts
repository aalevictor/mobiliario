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

        const avaliacaoExistente = await db.avaliacao_Prototipo.findFirst({ where: { cadastroId } })
        if (avaliacaoExistente) {
            return NextResponse.json({ error: 'Avaliação de protótipo já existe para este cadastro' }, { status: 400 })
        }

        const novaAvaliacao = await db.avaliacao_Prototipo.create({
            data: {
                cadastroId,
                avaliadorId: session.user.id,
                ergonomia: 0,
                desempenho_funcional: 0,
                qualidade_construtiva: 0,
                durabilidade: 0,
                receptividade_interacao: 0,
                compatibilidade_preliminar: 0,
            }
        })

        return NextResponse.json(novaAvaliacao)
    } catch (error) {
        console.error('Erro ao iniciar avaliação de protótipo:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
