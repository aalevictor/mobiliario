import { auth } from "@/auth";
import { verificarPermissoes } from "@/services/usuarios";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  const permissao = await verificarPermissoes(session.user.id, ['ADMIN']);
  if (!permissao) redirect("/meu-cadastro");
  return children;
}