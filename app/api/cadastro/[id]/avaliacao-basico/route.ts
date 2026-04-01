import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/prisma'
import { z } from 'zod'

const avaliacaoBasicoSchema = z.object({
    qualidade_detalhamento: z.number().min(0).max(10),
    coerencia_compatibilidade: z.number().min(0).max(10),
    exequibiliade: z.number().min(0).max(10),
    sustentabilidade: z.number().min(0).max(10),
    viabilidade_economica: z.number().min(0).max(10),
    qualidade_grafica: z.number().min(0).max(10),
    observacoes: z.string().optional(),
    avaliado: z.boolean().optional(),
})

export async function PUT(
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

        const body = await request.json()
        const validatedData = avaliacaoBasicoSchema.parse(body)

        const avaliacaoExistente = await db.avaliacao_Basico.findFirst({ where: { cadastroId, avaliadorId: session.user.id } })
        if (!avaliacaoExistente) {
            return NextResponse.json({ error: 'Avaliação não encontrada' }, { status: 404 })
        }

        const avaliacao = await db.avaliacao_Basico.update({
            where: { id: avaliacaoExistente.id },
            data: { ...validatedData, atualizadoEm: new Date() }
        })

        return NextResponse.json(avaliacao)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Dados inválidos', details: error.issues }, { status: 400 })
        }
        console.error('Erro ao salvar avaliação básica:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
