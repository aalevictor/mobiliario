import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { User as UserIcon } from 'lucide-react';
import Sair from './sair';
import { auth } from '@/auth';

export default async function UserLogged() {
	const session = await auth();
	const usuario = session?.user;
	
	const nome = usuario?.nome || "";
	const nomes = nome.split(" ");
	const nomeExibicao = nomes.length <= 2 ? nome : `${nomes[0]} ${nomes.length > 1 ? nomes[nomes.length - 1] : ''}`;
	
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
				<Sair />
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
