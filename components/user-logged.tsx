/** @format */

'use client';

import { User } from 'next-auth';
import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function UserLogged({ usuario }: { usuario?: User }) {
	const nome = usuario?.nome || "";
	const nomes = nome.split(" ");
	const nomeExibicao = nomes.length <= 2 ? nome : `${nomes[0]} ${nomes[nomes.length - 1]}`;
	return (
		<div className='flex items-center gap-3'>
			{usuario ? <div className='flex gap-1'>
				<Link href="/cadastros">
					<Button variant="outline" className='bg-transparent cursor-pointer'>{nomeExibicao}</Button>
				</Link>
				<Button
					variant='destructive'
					className='cursor-pointer hover:bg-destructive-foreground hover:text-destructive'
					title='Sair'
					onClick={async () => {
						await signOut({ redirect: true, redirectTo: '/' });
					}}
				>
					<LogOut />
				</Button>
			</div> :
			<Link href="/auth/login">
				<Button variant="outline" className='bg-transparent cursor-pointer'>Entrar</Button>
			</Link>}
		</div>
	)
}
