import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/");
  // const validacao = await verificarPermissoes(session.user.id, ['PARTICIPANTE']);
  // if (!validacao) redirect("/");
  return children
}