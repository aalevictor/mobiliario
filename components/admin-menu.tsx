"use client"

import { User } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileText, HelpCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminMenuProps {
  permissao?: string;
}

export default function AdminMenu({ permissao }: AdminMenuProps) {
  const pathname = usePathname();
  
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
    }
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 shadow-sm sticky z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Painel Administrativo
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
              {permissao}
            </span>
          </div>
          <nav className="flex items-center space-x-2 sm:space-x-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800"
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
