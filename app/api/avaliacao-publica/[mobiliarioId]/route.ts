import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/prisma"
import { z } from "zod"
import { Perfil_Avaliador, Local_Avaliacao } from "@prisma/client"

const schema = z.object({
  perfil: z.nativeEnum(Perfil_Avaliador).optional(),
  local: z.nativeEnum(Local_Avaliacao),
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
  lat: z.number().optional(),
  lng: z.number().optional(),
})

const CENTER_LAT = Number(process.env.AVALIACAO_PUBLICA_CENTER_LAT)
const CENTER_LNG = Number(process.env.AVALIACAO_PUBLICA_CENTER_LNG)
const RADIUS_METERS = Number(process.env.AVALIACAO_PUBLICA_RADIUS_METERS ?? "1000")

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

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

    const hasCenter =
      Number.isFinite(CENTER_LAT) && Number.isFinite(CENTER_LNG)
    if (hasCenter && data.local === Local_Avaliacao.PRESENCIAL) {
      if (!Number.isFinite(data.lat!) || !Number.isFinite(data.lng!)) {
        return NextResponse.json({ error: "Localização obrigatória" }, { status: 400 })
      }
      const distance = haversine(data.lat!, data.lng!, CENTER_LAT, CENTER_LNG)
      if (distance > RADIUS_METERS) {
        return NextResponse.json({ error: "Fora da área autorizada" }, { status: 403 })
      }
    }

    const perfil = data.perfil ?? Perfil_Avaliador.OUTRO
    const perfilOutro =
      perfil === Perfil_Avaliador.OUTRO ? data.perfilOutro || undefined : undefined

    const avaliacao = await db.avaliacao_Publica.create({
      data: {
        mobiliarioId,
        local: data.local,
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
