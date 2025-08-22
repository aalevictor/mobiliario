/** @format */

'use client';

import { User } from 'next-auth';
import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserLogged({ usuario }: { usuario?: User }) {
	const router = useRouter();
	const nome = usuario?.nome || "";
	const nomes = nome.split(" ");
	const nomeExibicao = nomes.length <= 2 ? nome : `${nomes[0]} ${nomes[nomes.length - 1]}`;
	return (
		<div className='flex items-center gap-3'>
			{usuario ? <div className='flex gap-1'>
				<Link href="/cadastros" aria-label={`Acessar cadastros do usuário ${nomeExibicao}`}>
					<Button 
						variant="outline" 
						className='bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#A5942B]'
						aria-label={`Perfil do usuário ${nomeExibicao}`}
					>
						<UserIcon aria-hidden="true" />
						<span className='hidden md:block'>{nomeExibicao}</span>
					</Button>
				</Link>
				<Button
					variant='destructive'
					className='cursor-pointer hover:bg-destructive-foreground hover:text-destructive focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#A5942B]'
					title='Sair'
					aria-label="Fazer logout da conta"
					onClick={async () => {
						await signOut({ redirect: false });
						// Força o refresh da página e redirecionamento mesmo se já estiver na home
						router.refresh();
						router.push("/");
						// Fallback: se o router.push não funcionar, força o reload
						setTimeout(() => {
							window.location.href = "/";
						}, 100);
					}}
				>
					<LogOut aria-hidden="true" />
					<span className="sr-only">Sair</span>
				</Button>
			</div> :
			<Link href="/auth/login" aria-label="Entrar">
				<Button 
					variant="outline" 
					className='bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#A5942B]'
				>
					Entrar
				</Button>
			</Link>}
		</div>
	)
}
