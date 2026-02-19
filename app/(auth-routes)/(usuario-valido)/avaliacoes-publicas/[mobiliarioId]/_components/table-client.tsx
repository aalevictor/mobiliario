 "use client"
 
 import DataTable from "@/components/data-table"
 import { ColumnDef } from "@tanstack/react-table"
 import { Avaliacao_Publica } from "@prisma/client"
 import { Badge } from "@/components/ui/badge"
 
 const columns: ColumnDef<Avaliacao_Publica>[] = [
   {
     accessorKey: "perfil",
     header: "Perfil",
     cell: ({ row }) => {
       const perfil = row.original.perfil
       const outro = row.original.perfilOutro
       return (
         <div className="flex items-center gap-2">
           <Badge variant="secondary">{perfil}</Badge>
           {perfil === "OUTRO" && outro && <span className="text-xs text-muted-foreground">({outro})</span>}
         </div>
       )
     },
   },
   {
     accessorKey: "criadoEm",
     header: "Data",
     cell: ({ row }) => {
       const d = new Date(row.original.criadoEm)
       return d.toLocaleString("pt-BR")
     },
   },
   { accessorKey: "identidade", header: "Identidade" },
   { accessorKey: "frequencia", header: "Frequência" },
   { accessorKey: "ergonomia", header: "Ergonomia" },
   { accessorKey: "resistenciaClima", header: "Res. Clima" },
   { accessorKey: "resistenciaUso", header: "Res. Uso" },
   { accessorKey: "materiais", header: "Materiais" },
   { accessorKey: "operacao", header: "Operação" },
   { accessorKey: "aprovacao", header: "Aprovação" },
   {
     accessorKey: "comentario",
     header: "Comentário",
     cell: ({ row }) => {
       const c = row.original.comentario || ""
       return <span title={c}>{c.length > 120 ? `${c.substring(0, 120)}...` : c}</span>
     }
   },
 ]
 
 export default function AvaliacoesPublicasTableClient({
   avaliacoes,
 }: {
   avaliacoes: Avaliacao_Publica[]
 }) {
   return <DataTable columns={columns} data={avaliacoes || []} />
 }
