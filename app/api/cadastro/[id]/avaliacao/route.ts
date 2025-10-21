import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/prisma'
import { z } from 'zod'

const avaliacaoSchema = z.object({
    linhaTematica1: z.number().min(0).max(10),
    linhaTematica2: z.number().min(0).max(10),
    linhaTematica3: z.number().min(0).max(10),
    conceitoProjetual: z.number().min(0).max(10),
    atendimentoNormas: z.number().min(0).max(10),
    insercaoUrbana: z.number().min(0).max(10),
    qualidadeFuncional: z.number().min(0).max(10),
    exequibilidade: z.number().min(0).max(10),
    economicidade: z.number().min(0).max(10),
    qualidadeGrafica: z.number().min(0).max(10),
    observacoes: z.string().optional(),
    desclassificado: z.boolean().optional(),
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
        const validatedData = avaliacaoSchema.parse(body)

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

        let avaliacao
        if (avaliacaoExistente) {
            // Atualizar avaliação existente
            avaliacao = await db.avaliacao_Julgadora.update({
                where: { id: avaliacaoExistente.id },
                data: {
                    ...validatedData,
                    atualizadoEm: new Date()
                }
            })
        } else {
            // Criar nova avaliação
            avaliacao = await db.avaliacao_Julgadora.create({
                data: {
                    ...validatedData,
                    cadastroId,
                    avaliadorId: session.user.id,
                    criadoEm: new Date(),
                    atualizadoEm: new Date()
                }
            })
        }

        return NextResponse.json(avaliacao)
    } catch (error) {
        console.error('Erro ao salvar avaliação:', error)
        
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Dados inválidos', details: error.issues },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}

export async function GET(
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

        const avaliacao = await db.avaliacao_Julgadora.findFirst({
            where: {
                cadastroId,
                avaliadorId: session.user.id
            }
        })

        if (!avaliacao) {
            return NextResponse.json({ error: 'Avaliação não encontrada' }, { status: 404 })
        }

        return NextResponse.json(avaliacao)
    } catch (error) {
        console.error('Erro ao buscar avaliação:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}