import { bind } from "@/services/ldap"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { login, senha } = await req.json()
  if (!login || !senha) return NextResponse.json({
    status: 400,
    error: "Credenciais incompletas!"
  })
  const usuario = await bind(login, senha);
  if (!usuario) return NextResponse.json({
    status: 401,
    error: "Credenciais incorretas!"
  })
  return NextResponse.json({
    status: 200,
    usuario
  })
}