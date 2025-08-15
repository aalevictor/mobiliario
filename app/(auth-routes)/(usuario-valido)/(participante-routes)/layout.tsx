import { auth } from "@/auth";
import { verificarPermissoes } from "@/services/usuarios";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/");
  const validacao = await verificarPermissoes(session.user.id, ['PARTICIPANTE']);
  if (!validacao) redirect("/");
  return <div className="h-full">
    {children}
  </div>
}