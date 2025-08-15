import { auth } from "@/auth";
import { buscarPorLogin } from "@/services/ldap";
import { verificarPermissoes } from "@/services/usuarios";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ login: string }> }
) {
  const { login } = await context.params;
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!await verificarPermissoes(session.user.id, ["ADMIN", "DEV"]))
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!login || login === "") return NextResponse.json({
    status: 400,
    error: "Login é obrigatório!"
  })
  try {
    const resposta = await buscarPorLogin(login);
    if (!resposta) return NextResponse.json({
        status: 404,
        error: "Usuário não encontrado"
    })
    return NextResponse.json({
        status: 200,
        data: resposta
    })
  } catch (err) {
    console.log(err)
    return NextResponse.json({
        status: 500,
        error: "Usuário não encontrado"
    })
  }
}