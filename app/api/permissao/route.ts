import { auth } from "@/auth";
import { retornaPermissao } from "@/services/usuarios";
import { Usuario } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    const usuarioLogado = session?.user as Usuario;
    const permissao = await retornaPermissao(usuarioLogado.id);
    return NextResponse.json(permissao);
}