import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FormularioInscricao from "./_components/formulario_inscricao";

export default async function Inscricao() {
    const session = await auth();
    if (session) redirect("/cadastros");
    return <FormularioInscricao />;
}