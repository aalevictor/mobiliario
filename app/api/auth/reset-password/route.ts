import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { transporter } from '@/lib/nodemailer';
import { templateRecuperacaoSenha } from '@/app/api/cadastro/_utils/email-templates';

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json(
				{ message: 'Email é obrigatório' },
				{ status: 400 }
			);
		}

		// Buscar usuário com tipo EXTERNO
		const usuario = await db.usuario.findFirst({
			where: {
				email: email.toLowerCase(),
				tipo: 'EXTERNO',
				status: true
			}
		});

		// Sempre retornar sucesso para não revelar se o email existe ou não
		if (!usuario) {
			return NextResponse.json(
				{ message: 'Email enviado com sucesso' },
				{ status: 200 }
			);
		}

		// Gerar nova senha temporária
		const novaSenha = gerarSenhaTemporaria();
		
		// Hash da nova senha
		const { hashPassword } = await import('@/lib/password');
		const senhaHash = hashPassword(novaSenha);

		// Atualizar usuário com nova senha e marcar para alteração
		await db.usuario.update({
			where: { id: usuario.id },
			data: {
				senha: senhaHash,
				alterarSenha: true,
				atualizadoEm: new Date()
			}
		});

		// Enviar email com nova senha
		if (transporter) {
			const emailHtml = templateRecuperacaoSenha(usuario.nome, novaSenha);
			
			await transporter.sendMail({
				from: process.env.MAIL_FROM || 'noreply@concursomoburb.prefeitura.sp.gov.br',
				to: usuario.email,
				subject: 'Recuperação de Senha - Concurso Mobiliário Urbano',
				html: emailHtml,
			});
		}

		return NextResponse.json(
			{ message: 'Email enviado com sucesso' },
			{ status: 200 }
		);

	} catch (error) {
		console.error('Erro no reset de senha:', error);
		return NextResponse.json(
			{ message: 'Erro interno do servidor' },
			{ status: 500 }
		);
	}
}

function gerarSenhaTemporaria(): string {
	const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let senha = '';
	
	// Garantir pelo menos uma letra maiúscula, uma minúscula e um número
	senha += caracteres.charAt(Math.floor(Math.random() * 26)); // Letra maiúscula
	senha += caracteres.charAt(26 + Math.floor(Math.random() * 26)); // Letra minúscula
	senha += caracteres.charAt(52 + Math.floor(Math.random() * 10)); // Número
	
	// Completar com caracteres aleatórios
	for (let i = 3; i < 8; i++) {
		senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
	}
	
	// Embaralhar a senha
	return senha.split('').sort(() => Math.random() - 0.5).join('');
}
