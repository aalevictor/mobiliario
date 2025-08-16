import { Card, CardContent } from '@/components/ui/card';
import { LoginForm } from './_components/login-form';
import Image from 'next/image';

export default function Login() {
	return (
		<>
			<div className='flex min-h-svh flex-col items-center justify-center p-0 md:p-6 md:p-10 z-50 bg-[#e9edde] sm:bg-transparent'>
				<div className='w-full max-w-sm md:max-w-3xl'>
					<div className='flex flex-col gap-6'>
						<Card className='overflow-hidden py-0 max-sm:border-none max-sm:shadow-none'>
							<CardContent className='relative grid p-0 md:grid-cols-2 items-center bg-[#e9edde]'>
								<LoginForm />
								<div className='flex flex-row gap-2 justify-center items-center p-10 bg-[#a5942b] hidden md:block'>
									<Image
										width={1200}
										height={1200}
										src="/logo-concurso.png"
										alt="Concurso de Mobiliário Urbano"
										className="inset-0 h-full w-full object-contain"
									/>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}