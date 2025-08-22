import Link from "next/link";
import { Users, FileText, HelpCircle, Settings, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { retornaPermissao } from "@/services/usuarios";

interface AdminMenuProps {
  permissao?: string;
}

export default async function AdminMenu() {
  const session = await auth();
  const permissao = session?.user.id ? await retornaPermissao(session?.user?.id as string) : '';

  if (!permissao) {
    return null;
  }

  // Verificar se o usuário tem permissão DEV ou ADMIN
  const isAdmin = permissao === "DEV" || permissao === "ADMIN";
  
  if (!isAdmin) {
    return null;
  }

  const menuItems = [
    {
      href: "/usuarios",
      label: "Usuários",
      icon: Users,
      description: "Gerenciar usuários do sistema"
    },
    {
      href: "/cadastros",
      label: "Cadastros",
      icon: FileText,
      description: "Visualizar e gerenciar cadastros"
    },
    {
      href: "/duvidas",
      label: "Dúvidas",
      icon: HelpCircle,
      description: "Responder dúvidas dos participantes"
    },
    {
      href: "/email-preview",
      label: "Emails",
      icon: Mail,
      description: "Visualizar templates de email"
    }
  ];

  return (
    <div className="bg-[#e8edde] shadow-none sticky z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 max-sm:hidden">
              Painel Administrativo
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
              {permissao}
            </span>
          </div>
          <nav className="flex items-center space-x-2 sm:space-x-4">
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
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
