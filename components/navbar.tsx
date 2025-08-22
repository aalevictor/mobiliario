import Image from 'next/image';
import Link from 'next/link';
import UserLogged from './user-logged';
import AdminMenu from './admin-menu';

export default async function Navbar() {
  return (
    <header id="top" className="bg-[#A5942B] dark:bg-zinc-800 text-white sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={"/#top"} aria-label="Página inicial - Concurso Nacional de Mobiliário Urbano">
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
          <Link href="/#top" className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#A5942B] rounded px-1">
            Início
          </Link>
          <Link 
            href="/#info" 
            className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#A5942B] rounded px-1"
            aria-label="Ir para seção de informações do concurso"
          >
            Informações
          </Link>
          <Link 
            href="/#docs" 
            className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#A5942B] rounded px-1"
            aria-label="Ir para seção de bases do concurso"
          >
            Bases do Concurso
          </Link>
        </nav>
        <div className="flex items-center gap-5" aria-label="Área do usuário">
          <UserLogged />
        </div>
      </div>
      <AdminMenu />
    </header>
  );
}
