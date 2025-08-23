/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import z from 'zod';
import Link from 'next/link';

const formSchema = z.object({
	email: z.string().email({ message: 'Email inválido.' }),
});

export function ResetPasswordForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
	});

	async function onSubmit({ email }: z.infer<typeof formSchema>) {
		try {
			const response = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			if (response.ok) {
				toast.success('Um e-mail foi enviado com instruções de recuperação, caso esse email esteja cadastrado');
				router.push('/auth/login');
			} else {
				const error = await response.json();
				toast.error(error.message || 'Erro ao processar solicitação');
			}
		} catch (e) {
			console.log(e);
			toast.error('Não foi possível processar a solicitação.');
		}
	}

	return (
		<Form {...form} {...props}>
			<form
				className='p-10 dark:bg-muted'
				onSubmit={form.handleSubmit(onSubmit)}>
				<div className={cn('flex flex-col gap-6', className)}>
					<div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
						<Image src="/promocao/spurbanismo.png" alt="Logo" width={300} height={300} className='w-1/2 h-auto' />
						<Image src="/promocao/prefeitura.png" alt="Logo" width={300} height={300} className='w-1/2 h-auto' />
					</div>
					
					<div className='text-center'>
						<h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
							Recuperar Senha
						</h2>
						<p className='text-gray-600 dark:text-gray-400'>
							Digite seu email para receber instruções de recuperação
						</p>
					</div>

					<div className='grid gap-2'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											type='email'
											placeholder='seu@email.com'
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
								Enviando... <Loader2 className='animate-spin' />
							</>
						) : (
							'Enviar Instruções'
						)}
					</Button>

					<div className='text-center'>
						<Link 
							href='/auth/login' 
							className='inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
						>
							<ArrowLeft className='w-4 h-4 mr-2' />
							Voltar para o login
						</Link>
					</div>
				</div>
			</form>
		</Form>
	)
}
