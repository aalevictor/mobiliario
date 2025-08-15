/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Sair({ session }: { session: Session | null }) {
	const router = useRouter();
	return session ? (
		<Button
			variant={'outline'}
			className=' text-secondary hover:text-foreground'
			onClick={async () => await signOut()}>
			Sair
		</Button>
	) : (
		<Button
			variant={'outline'}
			className=' text-secondary hover:text-foreground'
			onClick={() => router.push('/auth/login')}>
			Entrar
		</Button>
	);
}
