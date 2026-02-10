import { db } from "@/lib/prisma"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Perfil_Avaliador, Tipo_Mobiliario } from "@prisma/client"
import AvaliacaoForm from "./_components/avaliacao-form"

export default async function AvaliacaoPublicaPage({
  params,
}: {
  params: Promise<{ mobiliarioId: string }>
}) {
  const { mobiliarioId } = await params

  const mobiliario = await db.mobiliario.findUnique({
    where: { id: mobiliarioId },
    include: {
      cadastro: {
        select: { protocolo: true },
      },
    },
  })

  if (!mobiliario) {
    return (
      <div className="container mx-auto max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Mobiliário não encontrado</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const protocolo = mobiliario.cadastro?.protocolo ?? "Sem protocolo"
  const tipo = mobiliario.tipo as Tipo_Mobiliario
  const tipoLabelMap: Record<Tipo_Mobiliario, string> = {
    BALIZADOR: "Balizador Sólido",
    FLOREIRA: "Floreira",
    VASO: "Vaso",
    PAPELEIRA: "Papeleira dupla",
    BANCO: "Banco coletivo",
    PARACICLO: "Paraciclo",
  }
  const tipoLabel = tipoLabelMap[tipo]

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10 pb-24 sm:pb-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold">
          <span className="font-bold">{protocolo}</span>
        </h1>
        <span className="text-sm sm:text-lg rounded-md border border-primary/20 bg-primary/10 text-primary px-3 py-1">
          {tipoLabel}
        </span>
      </div>
      <Separator className="my-4 sm:my-6" />
      <AvaliacaoForm
        mobiliarioId={mobiliario.id}
        protocolo={protocolo}
        tipo={tipo}
      />
    </div>
  )
}
