import { db } from "@/lib/prisma"
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
 import { Separator } from "@/components/ui/separator"
 import AvaliacoesPublicasTableClient from "./_components/table-client"
 import type { Tipo_Mobiliario } from "@prisma/client"
 import { auth } from "@/auth"
 import { redirect } from "next/navigation"
import { verificarPermissoes } from "@/services/usuarios"
 
 export default async function AvaliacoesPublicasPage({
   params,
 }: {
   params: Promise<{ mobiliarioId: string }>
 }) {
   const session = await auth()
   if (!session) return redirect("/")
  if (!await verificarPermissoes(session.user.id, ["ADMIN", "DEV"])) return redirect("/meu-cadastro")
 
   const { mobiliarioId } = await params
 
   const mobiliario = await db.mobiliario.findUnique({
     where: { id: mobiliarioId },
     include: {
       cadastro: { select: { protocolo: true } },
       avaliacoes_publicas: true,
     }
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
 
   return (
     <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
       <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
         <div>
           <h1 className="text-xl sm:text-2xl font-semibold">
             <span className="font-bold">{protocolo}</span>
           </h1>
           <p className="text-sm text-muted-foreground">Avaliações públicas para {tipoLabelMap[tipo]}</p>
         </div>
       </div>
       <Separator className="my-4 sm:my-6" />
       <Card>
         <CardHeader className="pb-2">
           <CardTitle className="text-lg">Avaliações</CardTitle>
           <CardDescription>Total: {mobiliario.avaliacoes_publicas.length}</CardDescription>
         </CardHeader>
         <CardContent>
           <AvaliacoesPublicasTableClient avaliacoes={mobiliario.avaliacoes_publicas} />
         </CardContent>
       </Card>
     </div>
   )
 }
