 "use client"
 
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
 import { Button } from "@/components/ui/button"
 import { Badge } from "@/components/ui/badge"
 import { useState } from "react"
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
 import { Eye, QrCode, Copy, Check } from "lucide-react"
 import QRCode from "react-qr-code"
 import { Avaliacao_Publica, Tipo_Mobiliario } from "@prisma/client"
 import Link from "next/link"
 
 type MobiliarioItem = {
   id: string
   tipo: Tipo_Mobiliario
   avaliacoes_publicas: Avaliacao_Publica[]
 }
 
 function tipoLabel(tipo: Tipo_Mobiliario) {
   const map: Record<Tipo_Mobiliario, string> = {
     BALIZADOR: "Balizador Sólido",
     FLOREIRA: "Floreira",
     VASO: "Vaso",
     PAPELEIRA: "Papeleira dupla",
     BANCO: "Banco coletivo",
     PARACICLO: "Paraciclo",
   }
   return map[tipo]
 }
 
 export default function MobiliariosSection({
   mobiliarios,
 }: {
   mobiliarios: MobiliarioItem[]
 }) {
   return (
     <Card>
       <CardHeader className="pb-4">
         <CardTitle className="text-lg text-primary">Mobiliários</CardTitle>
         <CardDescription>Lista de mobiliários vinculados ao cadastro</CardDescription>
       </CardHeader>
       <CardContent>
         {mobiliarios && mobiliarios.length > 0 ? (
           <div className="space-y-3">
             {mobiliarios.map((m) => {
               const url = `${process.env.NEXT_PUBLIC_APP_URL}/avaliacao-publica/${m.id}`
               return (
                 <div key={m.id} className="p-3 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                   <div className="flex items-center gap-3">
                     <Badge variant="outline">{tipoLabel(m.tipo)}</Badge>
                     <span className="text-xs text-muted-foreground">{m.id}</span>
                   </div>
                   <div className="flex flex-wrap gap-2 sm:justify-end">
                     <Dialog>
                       <DialogTrigger asChild>
                         <Button size="sm" variant="outline" className="cursor-pointer">
                           <QrCode className="w-4 h-4" />
                           <span className="ml-2">QR Code</span>
                         </Button>
                       </DialogTrigger>
                       <DialogContent className="max-w-md">
                         <DialogHeader>
                           <DialogTitle>QR Code do mobiliário</DialogTitle>
                           <DialogDescription className="break-words">{url}</DialogDescription>
                         </DialogHeader>
                         <div className="flex flex-col items-center gap-4">
                           <div className="bg-white p-3 rounded-md">
                             <QRCode value={url} size={192} />
                           </div>
                           <CopyButton text={url} />
                         </div>
                       </DialogContent>
                     </Dialog>
                     <Link href={`/avaliacoes-publicas/${m.id}`} title="Ver avaliações">
                       <Button size="sm" variant="outline" className="cursor-pointer">
                         <Eye className="w-4 h-4" />
                         <span className="ml-2">Ver avaliações</span>
                       </Button>
                     </Link>
                   </div>
                 </div>
               )
             })}
           </div>
         ) : (
           <div className="text-center py-8 text-gray-500">
             <p>Nenhum mobiliário encontrado</p>
           </div>
         )}
       </CardContent>
     </Card>
   )
 }
 
 
 function CopyButton({ text }: { text: string }) {
   const [copied, setCopied] = useState(false)
   return (
     <Button
       size="sm"
       variant="outline"
       className="cursor-pointer"
       onClick={async () => {
         try {
           await navigator.clipboard.writeText(text)
           setCopied(true)
           setTimeout(() => setCopied(false), 1500)
         } catch {}
       }}
     >
       {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
       <span className="ml-2">{copied ? "Copiado" : "Copiar link"}</span>
     </Button>
   )
 }
