 "use client"
 
 import DataTable from "@/components/data-table"
 import { getAdministradoraColumns } from "./administradora"
 import { julgadoraColumns } from "./julgadora"
 import { Permissao } from "@prisma/client"
 import { ColumnDef } from "@tanstack/react-table"
 
 export default function CadastrosTableClient({
   permissao,
   dados,
 }: {
   permissao: Permissao
   dados: unknown[]
 }) {
   const isDev = permissao === "DEV"
   const columns =
     ["ADMIN", "DEV"].includes(permissao) ? getAdministradoraColumns(isDev) :
     ["JULGADORA"].includes(permissao) ? julgadoraColumns :
     []
   return <DataTable columns={columns as unknown as ColumnDef<unknown, unknown>[]} data={dados || []} />
 }
