/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { toast } from 'sonner';

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	const router = useRouter();

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const login = form.get('login');
		const senha = form.get('senha');
		try {
			const res = await signIn('credentials', {
				login: login as string,
				senha: senha as string,
				redirect: false,
			});
			if (res.error) toast.error('Credenciais incorretas!');
			else {
				toast.success('Seja bem-vindo!');
				router.push('/cadastros');
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div
			className={cn('flex flex-col gap-6', className)}
			{...props}>
			<div className='-translate-y-14'>
				<Image
					src="/logo-header.png"
					alt='SPUrbanismo'
					width={602}
					height={200}
					className='w-60 mx-auto rounded-md'
				/>

				<form
					onSubmit={handleSubmit}
					className='mt-10'>
					<div className='grid gap-6'>
						<div className='grid gap-6'>
							<div className='grid gap-2'>
								<Label htmlFor='email'>Login</Label>
								<Input
									className='bg-background'
									id='login'
									type='text'
									name='login'
									placeholder='Login'
									required
								/>
							</div>
							<div className='grid gap-2'>
								<div className='flex items-center'>
									<Label htmlFor='senha'>Senha</Label>
								</div>
								<Input
									className='bg-background'
									id='senha'
									placeholder='*********'
									type='password'
									name='senha'
									required
								/>
							</div>
							<Button
								type='submit'
								className='w-full'>
								Login
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
