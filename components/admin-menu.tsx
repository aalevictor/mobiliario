import Link from "next/link";
import { Users, FileText, HelpCircle, Settings, Mail, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { retornaPermissao } from "@/services/usuarios";

export default async function AdminMenu() {
  const session = await auth();
  const permissao = session?.user.id ? await retornaPermissao(session?.user?.id as string) : '';

  if (!permissao) {
    return null;
  }

  // Verificar se o usuário tem permissão DEV ou ADMIN
  const isAdmin = permissao === "DEV" || permissao === "ADMIN";
  const isDev = permissao === "DEV";
  
  if (!isAdmin) {
    return null;
  }

  const menuItems = [
    {
      href: "/usuarios",
      label: "Usuários",
      icon: Users,
      description: "Gerenciar usuários do sistema",
      showForDev: true,
      showForAdmin: true
    },
    {
      href: "/cadastros",
      label: "Cadastros",
      icon: FileText,
      description: "Visualizar e gerenciar cadastros",
      showForDev: true,
      showForAdmin: true
    },
    {
      href: "/duvidas",
      label: "Dúvidas",
      icon: HelpCircle,
      description: "Responder dúvidas dos participantes",
      showForDev: true,
      showForAdmin: true
    },
    {
      href: "/email-preview",
      label: "Emails",
      icon: Mail,
      description: "Visualizar templates de email",
      showForDev: true,
      showForAdmin: true
    },
    {
      href: "/logs",
      label: "Logs",
      icon: Activity,
      description: "Monitoramento e auditoria do sistema",
      showForDev: true,
      showForAdmin: false
    }
  ].filter(item => 
    (isDev && item.showForDev) || (permissao === "ADMIN" && item.showForAdmin)
  );

  return (
    <div className="bg-[#e8edde] shadow-none sticky z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 max-md:hidden">
              Painel Administrativo
            </span>
          </div>
          <nav className="flex items-center space-x-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  )}
                  title={item.description}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden text-sm md:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
