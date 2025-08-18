/** @format */

import Image from 'next/image';
import Link from 'next/link';
import UserLogged from './user-logged';
import { auth } from '@/auth';

export default async function Navbar() {
  const session = await auth();
	return (
    <header className="bg-[#A5942B] dark:bg-zinc-800 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={"/"}>
          <Image
            src="/logo-header.png"
            alt="Brasão da Prefeitura de São Paulo"
            width={120}
            height={80}
            quality={100}
          />
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm hover:underline">
            Início
          </Link>
          <a href="#info" className="text-sm hover:underline">
            Informações
          </a>
          <a href="#docs" className="text-sm hover:underline">
            Documentos
          </a>
        </nav>
        <div className="flex items-center gap-5">
          <UserLogged usuario={session?.user} />
        </div>
      </div>
    </header>
  );
}
