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
 import { useRef } from "react"
 import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
 
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
 
async function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a")
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

async function svgToPngDataUrl(svgEl: SVGSVGElement, size: number) {
  const clone = svgEl.cloneNode(true) as SVGSVGElement
  clone.setAttribute("width", String(size))
  clone.setAttribute("height", String(size))
  if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(clone)
  const svgData = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" })
  const url = URL.createObjectURL(svgData)
  try {
    const img = new Image()
    const loaded = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject()
    })
    img.src = url
    await loaded
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas context")
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size, size)
    ctx.drawImage(img, 0, 0, size, size)
    return canvas.toDataURL("image/png")
  } finally {
    URL.revokeObjectURL(url)
  }
}

async function pngDataUrlToBytes(pngDataUrl: string) {
  const base64 = pngDataUrl.split(",")[1]
  const bin = atob(base64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

async function exportQrAsPdf(svgEl: SVGSVGElement, tipoNome: string, mobiliarioId: string, urlTexto: string, size: number) {
  const pngDataUrl = await svgToPngDataUrl(svgEl, size)
  const pngBytes = await pngDataUrlToBytes(pngDataUrl)
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const qrImage = await pdfDoc.embedPng(pngBytes)
  const qrWidth = 256
  const qrHeight = 256
  const margin = 72
  const centerX = (595 - qrWidth) / 2
  const yTop = 842 - margin
  page.drawText(`QR do Mobiliário: ${tipoNome}`, { x: margin, y: yTop - 24, size: 18, font, color: rgb(0, 0, 0) })
  page.drawText(`ID: ${mobiliarioId}`, { x: margin, y: yTop - 48, size: 12, font, color: rgb(0.2, 0.2, 0.2) })
  page.drawImage(qrImage, { x: centerX, y: yTop - 48 - qrHeight - 24, width: qrWidth, height: qrHeight })
  page.drawText(urlTexto, { x: margin, y: yTop - 48 - qrHeight - 24 - 24, size: 12, font, color: rgb(0.2, 0.2, 0.2) })
  const dataUri = await pdfDoc.saveAsBase64({ dataUri: true })
  await downloadDataUrl(dataUri, `QR-${tipoNome}-${mobiliarioId}.pdf`)
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
                        <QrActions url={url} tipoNome={tipoLabel(m.tipo)} mobiliarioId={m.id} />
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
 
 function QrActions({ url, tipoNome, mobiliarioId }: { url: string, tipoNome: string, mobiliarioId: string }) {
   const qrRef = useRef<HTMLDivElement | null>(null)
   const size = 256
   return (
     <div className="flex flex-col items-center gap-4">
      <div ref={qrRef} className="bg-white p-3 rounded-md">
         <QRCode value={url} size={size} bgColor="#ffffff" />
       </div>
       <div className="flex gap-2">
         <Button
           size="sm"
           variant="outline"
           className="cursor-pointer"
           onClick={async () => {
             const svg = qrRef.current?.querySelector("svg") as SVGSVGElement | null
             if (!svg) return
            const dataUrl = await svgToPngDataUrl(svg, size)
             await downloadDataUrl(dataUrl, `QR-${tipoNome}-${mobiliarioId}.png`)
           }}
         >
           <span>Exportar PNG</span>
         </Button>
         <Button
           size="sm"
           variant="outline"
           className="cursor-pointer"
           onClick={async () => {
             const svg = qrRef.current?.querySelector("svg") as SVGSVGElement | null
             if (!svg) return
             await exportQrAsPdf(svg, tipoNome, mobiliarioId, url, size)
           }}
         >
           <span>Exportar PDF</span>
         </Button>
         <CopyButton text={url} />
       </div>
     </div>
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
