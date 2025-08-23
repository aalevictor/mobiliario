/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import z from 'zod';
import Link from 'next/link';

const formSchema = z.object({
	login: z.string().min(2, { message: 'Login inválido.' }),
	senha: z.string().min(2, {
		message: 'Campo senha não pode ser vazio.',
	}),
});

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			login: '',
			senha: '',
		},
	});

	async function onSubmit({ login, senha }: z.infer<typeof formSchema>) {
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
		} catch (e) {
			console.log(e);
			toast.error('Não foi possível realizar o login.');
		}
	}

	return (
		<Form {...form} {...props}>
			<form
				className='p-10 dark:bg-muted'
				onSubmit={form.handleSubmit(onSubmit)}>
				<div className={cn('flex flex-col gap-6', className)}>
					<div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
						<Image src="/logos/spurbanismo_preto.png" alt="Logo" width={300} height={300} className='w-1/2 h-auto' />
						<Image src="/logos/smul_preto.png" alt="Logo" width={300} height={300} className='w-1/2 h-auto' />
					</div>
					<div className='grid gap-2'>
						<FormField
							control={form.control}
							name='login'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Login</FormLabel>
									<FormControl>
										<Input
											{...field}
											className='dark:bg-background bg-muted'
										/>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='grid gap-2'>
						<FormField
							control={form.control}
							name='senha'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Senha</FormLabel>
									<FormControl>
										<Input
											{...field}
											type='password'
											className='dark:bg-background bg-muted'
										/>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button
						disabled={form.formState.isSubmitting || form.formState.isLoading}
						type='submit'
						className='w-full disabled:opacity-50'>
						{form.formState.isSubmitting || form.formState.isLoading ? (
							<>
								Entrar <Loader2 className='animate-spin' />
							</>
						) : (
							'Entrar'
						)}
					</Button>

					<div className='text-center'>
						<Link 
							href='/auth/reset' 
							className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
						>
							Esqueci minha senha
						</Link>
					</div>
				</div>
			</form>
		</Form>
	)
}
