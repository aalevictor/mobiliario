'use client';

import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import UserLogged from './user-logged';

interface NavbarClientProps {
  initialSession: Session | null;
}

export function NavbarClient({ initialSession }: NavbarClientProps) {
  const { data: session, status } = useSession();
  
  // Usa a sessão do hook useSession como fonte da verdade
  // Se não houver sessão ativa, usa a sessão inicial do servidor
  const currentSession = session || initialSession;
  
  // Mostra loading enquanto verifica a sessão
  if (status === 'loading') {
    return (
      <div className='flex items-center gap-3'>
        <div className='flex gap-1'>
          <div className='w-8 h-8 bg-white/20 rounded animate-pulse'></div>
          <div className='w-20 h-8 bg-white/20 rounded animate-pulse hidden md:block'></div>
        </div>
      </div>
    );
  }
  
  return <UserLogged usuario={currentSession?.user} />;
}
