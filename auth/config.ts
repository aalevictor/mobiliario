/** @format */

import { bind } from '@/services/ldap';
import Credentials from 'next-auth/providers/credentials';
import { Logger } from '@/lib/logger';
// import { bind } from '../services/ldap';

export const authConfig = {
	providers: [
		Credentials({
			name: 'credentials',
			credentials: {
				login: {},
				senha: {},
			},
			authorize: async (credentials, req) => {
				const { login, senha } = credentials ?? {};
				if (!login || !senha) return null;
				
				try {
					const usuario = await bind(login as string, senha as string);
					if (!usuario) {
						// Log de tentativa de login falhada
						await Logger.logLogin("", false, req?.headers?.get("x-forwarded-for") as string, req?.headers?.get("user-agent") as string);
						return null;
					}
					
					// Log de login bem-sucedido
					await Logger.logLogin(usuario.id, true, req?.headers?.get("x-forwarded-for") as string, req?.headers?.get("user-agent") as string);
					
					return {
						id: usuario.id,
						email: usuario.email,
						nome: usuario.nome,
						login: usuario.login || undefined,
						permissao: usuario.permissao,
						alterarSenha: usuario.alterarSenha,
					};
				} catch (error) {
					// Log de erro durante o login
					await Logger.logErro("Erro durante autenticação", error as Error, {
						entidade: "USUARIO",
						ip: req?.headers?.get("x-forwarded-for") as string,
						userAgent: req?.headers?.get("user-agent") as string,
					});
					return null;
				}
			},
		}),
	],
	callbacks: {
		// @eslint-disable-next-line
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async jwt({ token, user }: any) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.nome = user.nome;
				token.login = user.login;
				token.permissao = user.permissao;
				token.alterarSenha = user.alterarSenha;
			}
			return token;
		},
		// @eslint-disable-next-line
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async session({ session, token }: any) {
			session.user.id = token.id;
			session.user.email = token.email;
			session.user.nome = token.nome;
			session.user.login = token.login;
			session.user.permissao = token.permissao;
			session.user.alterarSenha = token.alterarSenha;
			return session;
		},
	},
	pages: {
		signIn: '/auth/login',
		error: '/auth/login',
	},
	trustHost: true,
};
