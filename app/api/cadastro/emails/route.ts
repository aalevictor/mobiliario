import { auth } from "@/auth";
import { emailsParticipantes } from "@/services/cadastros";
import { retornaPermissao } from "@/services/usuarios";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    const permissao = await retornaPermissao(session.user.id);
    if (!permissao || permissao !== "DEV") return NextResponse.json({ error: "Permissão inválida." }, { status: 401 });
    const emails = await emailsParticipantes();
    return NextResponse.json({ emails: emails }, { status: 200 });
}