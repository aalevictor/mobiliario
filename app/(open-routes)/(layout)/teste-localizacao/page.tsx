import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import LocalizacaoTeste from "./_components/localizacao-teste"

export default async function TesteLocalizacaoPage() {
  const centerLat = Number(process.env.AVALIACAO_PUBLICA_CENTER_LAT)
  const centerLng = Number(process.env.AVALIACAO_PUBLICA_CENTER_LNG)
  const radiusMeters = Number(process.env.AVALIACAO_PUBLICA_RADIUS_METERS ?? "1000")

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Localização</CardTitle>
          <CardDescription>
            Valide sua localização e veja a distância até o ponto central.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LocalizacaoTeste
            centerLat={Number.isFinite(centerLat) ? centerLat : undefined}
            centerLng={Number.isFinite(centerLng) ? centerLng : undefined}
            radiusMeters={Number.isFinite(radiusMeters) ? radiusMeters : 1000}
          />
          <Separator className="mt-6" />
        </CardContent>
      </Card>
    </div>
  )
}
