import { auth } from "@/auth";
import { validaSenha } from "@/services/usuarios";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/");
  const validacao = await validaSenha(session.user.id);
  if (validacao) redirect("/");
  return children;
}