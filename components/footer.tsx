/** @format */

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
	return (
		<footer
			id="contact"
			className="bg-gradient-to-br from-[#A5942B] via-[#B8A73A] to-[#A5942B] dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 text-white py-12 mt-auto"
			role="contentinfo"
			aria-labelledby="footer-heading"
		>
			<div className="container mx-auto px-6 max-w-7xl">
				{/* Conteúdo Principal */}
				<div className="flex flex-col-reverse items-start max-md:items-center md:flex-row gap-6 md:gap-12 mb-12">
					{/* SP Urbanismo */}
					<div className="text-center md:text-left max-w-64 h-full">
						<div className="md:mb-6">
							<Link 
								href="https://prefeitura.sp.gov.br/sp_urbanismo" 
								target="_blank" 
								rel="noopener noreferrer"
								className="inline-block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-lg p-2"
							>
								<Image
									src="/logos/spurbanismo_branco.png"
									alt="Logo SP Urbanismo"
									width={180}
									height={80}
									className="h-20 w-auto object-contain filter drop-shadow-lg"
								/>
							</Link>
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold text-lg text-white/90 mb-3">São Paulo Urbanismo</h3>
							<div className="text-sm text-white/80 space-y-1">
								<p>Rua São Bento, 405 - Centro</p>
								<p>São Paulo - SP, 01011-100</p>
							</div>
						</div>
					</div>

					{/* SMUL */}
					<div className="text-center md:text-left max-w-64 h-full">
						<div className="md:mb-6">
							<Link 
								href="https://prefeitura.sp.gov.br/licenciamento" 
								target="_blank" 
								rel="noopener noreferrer"
								className="inline-block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-lg p-2"
							>
								<Image
									src="/logos/smul_branco.png"
									alt="Brasão da Prefeitura de São Paulo - SMUL"
									width={180}
									height={90}
									className="h-20 w-auto object-contain filter drop-shadow-lg"
								/>
							</Link>
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold text-lg text-white/90 mb-3">Secretaria Municipal de Urbanismo e Licenciamento</h3>
							<div className="text-sm text-white/80 space-y-1">
								<p>Rua São Bento, 405 - Centro</p>
								<p>São Paulo - SP, 01011-100</p>
							</div>
						</div>
					</div>
				</div>

				{/* Separador */}
				<div className="border-t border-white/20 mb-8"></div>

				{/* Rodapé Inferior */}
				<div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
					{/* Copyright */}
					<div className="text-center md:text-left">
						<p className="text-sm text-white/70">
							© 2025{' '}
							<Link 
								href="https://prefeitura.sp.gov.br/" 
								target="_blank" 
								rel="noopener noreferrer" 
								className="hover:text-white transition-colors underline decoration-white/30 hover:decoration-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded px-1"
							>
								Prefeitura de São Paulo
							</Link>
							. Todos os direitos reservados.
						</p>
					</div>

					{/* Links Úteis */}
					<div className="flex items-center space-x-6 text-sm md:self-end">
						<Link 
							href="https://prefeitura.sp.gov.br/"
							target="_blank" 
							rel="noopener noreferrer"
							className="text-white/70 hover:text-white transition-colors underline decoration-white/30 hover:decoration-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded px-1"
						>
							Prefeitura
						</Link>
						<Link 
							href="https://prefeitura.sp.gov.br/licenciamento" 
							target="_blank" 
							rel="noopener noreferrer"
							className="text-white/70 hover:text-white transition-colors underline decoration-white/30 hover:decoration-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded px-1"
						>
							SMUL
						</Link>
						<Link 
							href="https://prefeitura.sp.gov.br/sp_urbanismo" 
							target="_blank" 
							rel="noopener noreferrer"
							className="text-white/70 hover:text-white transition-colors underline decoration-white/30 hover:decoration-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded px-1"
						>
							SP Urbanismo
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
