/** @format */

import { bind } from '@/services/ldap';
import Credentials from 'next-auth/providers/credentials';
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
				const usuario = await bind(login as string, senha as string);
				if (!usuario) return null;
				return {
					id: usuario.id,
					email: usuario.email,
					nome: usuario.nome,
					login: usuario.login || undefined,
					permissao: usuario.permissao,
					alterarSenha: usuario.alterarSenha,
				};
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
