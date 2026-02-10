import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/prisma"
import { z } from "zod"
import { Perfil_Avaliador } from "@prisma/client"

const schema = z.object({
  perfil: z.nativeEnum(Perfil_Avaliador).optional(),
  perfilOutro: z.string().optional(),
  identidade: z.number().min(1).max(5),
  frequencia: z.number().min(1).max(5),
  ergonomia: z.number().min(1).max(5),
  resistenciaClima: z.number().min(1).max(5),
  resistenciaUso: z.number().min(1).max(5),
  materiais: z.number().min(1).max(5),
  operacao: z.number().min(1).max(5),
  aprovacao: z.number().min(1).max(5),
  comentario: z.string().optional(),
})

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ mobiliarioId: string }> }
) {
  try {
    const { mobiliarioId } = await context.params
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    const data = parsed.data
    const perfil = data.perfil ?? Perfil_Avaliador.OUTRO
    const perfilOutro =
      perfil === Perfil_Avaliador.OUTRO ? data.perfilOutro || undefined : undefined

    const avaliacao = await db.avaliacao_Publica.create({
      data: {
        mobiliarioId,
        perfil,
        perfilOutro,
        identidade: data.identidade,
        frequencia: data.frequencia,
        ergonomia: data.ergonomia,
        resistenciaClima: data.resistenciaClima,
        resistenciaUso: data.resistenciaUso,
        materiais: data.materiais,
        operacao: data.operacao,
        aprovacao: data.aprovacao,
        comentario: data.comentario,
      },
    })

    return NextResponse.json({ id: avaliacao.id })
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao salvar avaliação" },
      { status: 500 }
    )
  }
}
