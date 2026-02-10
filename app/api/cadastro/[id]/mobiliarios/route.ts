import { auth } from "@/auth"
import { db } from "@/lib/prisma"
import { verificarPermissoes } from "@/services/usuarios"
import { NextRequest, NextResponse } from "next/server"
import { Tipo_Mobiliario } from "@prisma/client"

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }
  const isDev = await verificarPermissoes(session.user.id, ["DEV"])
  if (!isDev) {
    return NextResponse.json({ error: "Apenas usuários DEV" }, { status: 403 })
  }

  const { id } = await context.params
  const cadastroId = parseInt(id)
  if (Number.isNaN(cadastroId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }

  const cadastro = await db.cadastro.findUnique({
    where: { id: cadastroId },
    select: { id: true, protocolo: true },
  })
  if (!cadastro) {
    return NextResponse.json({ error: "Cadastro não encontrado" }, { status: 404 })
  }

  const existentes = await db.mobiliario.findMany({
    where: { cadastroId },
    select: { tipo: true },
  })

  const tiposExistentes = new Set(existentes.map((m) => m.tipo))
  const todosTipos = Object.values(Tipo_Mobiliario)
  const tiposParaCriar = todosTipos.filter((t) => !tiposExistentes.has(t))

  const criados = await Promise.all(
    tiposParaCriar.map((tipo) =>
      db.mobiliario.create({
        data: { cadastroId, tipo },
        select: { id: true, tipo: true },
      })
    )
  )

  return NextResponse.json({
    cadastroId,
    protocolo: cadastro.protocolo,
    createdCount: criados.length,
    created: criados,
  })
}
