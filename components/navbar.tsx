/** @format */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import UserLogged from './user-logged';
import AdminMenu from './admin-menu';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Session } from 'next-auth';

interface NavbarProps {
  session: Session | null;
  permissao: string;
}

export default function Navbar({ session, permissao }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header id="top" className="bg-[#A5942B] dark:bg-zinc-800 text-white sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={"#top"} aria-label="Página inicial - Concurso Nacional de Mobiliário Urbano">
          <Image
            src="/logo-header.png"
            alt="Brasão da Prefeitura de São Paulo"
            width={120}
            height={80}
            quality={100}
          />
        </Link>
        {/* Menu desktop */}
        <nav className="hidden md:flex gap-6" role="navigation" aria-label="Navegação principal">
          <Link href="#top" className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#A5942B] rounded px-1">
            Início
          </Link>
          <a 
            href="#info" 
            className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#A5942B] rounded px-1"
            aria-label="Ir para seção de informações do concurso"
          >
            Informações
          </a>
          <a 
            href="#docs" 
            className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#A5942B] rounded px-1"
            aria-label="Ir para seção de bases do concurso"
          >
            Bases do Concurso
          </a>
        </nav>
        <div className="flex items-center gap-5" aria-label="Área do usuário">
          <UserLogged usuario={session?.user} />
          {/* Botão do menu móvel */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#A5942B]"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
      {/* Menu móvel */}
      {isMenuOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden bg-[#A5942B] dark:bg-zinc-800 border-t border-white/20"
          role="navigation"
          aria-label="Menu de navegação móvel"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              href="/" 
              className="block text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#A5942B] rounded px-2 py-2"
              onClick={closeMenu}
            >
              Início
            </Link>
            <a 
              href="#info" 
              className="block text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#A5942B] rounded px-2 py-2"
              aria-label="Ir para seção de informações do concurso"
              onClick={closeMenu}
            >
              Informações
            </a>
            <a 
              href="#docs" 
              className="block text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#A5942B] rounded px-2 py-2"
              aria-label="Ir para seção de bases do concurso"
              onClick={closeMenu}
            >
              Bases do Concurso
            </a>
          </div>
        </nav>
      )}
      <AdminMenu permissao={permissao || ''} />
    </header>
  );
}
