/** @format */

import { db } from '@/lib/prisma';
import { Client } from 'ldapts';
import { matchPassword } from '@/lib/password';
import { Usuario } from '@prisma/client';

const ldapServers = [
	"ldap://10.10.53.10",
	"ldap://10.10.53.11",
	"ldap://10.10.53.12",
	"ldap://10.10.64.213",
	"ldap://10.10.65.242",
	"ldap://10.10.65.90",
	"ldap://10.10.65.91",
	"ldap://10.10.66.85",
	"ldap://10.10.68.42",
	"ldap://10.10.68.43",
	"ldap://10.10.68.44",
	"ldap://10.10.68.45",
	"ldap://10.10.68.46",
	"ldap://10.10.68.47",
	"ldap://10.10.68.48",
	"ldap://10.10.68.49",
];

function createLdapServer(server: string) {
	return new Client({
		url: server,
	});
}

async function bind(login: string, senha: string) {
	let usuario: Usuario | null = null;
	try {
		const ldap = new Client({
			url: process.env.LDAP_SERVER || 'ldap://1.1.1.1',
		});
		const agora = new Date();
		const dataEncerramentoIndeferidos = new Date("2025-10-21T00:00:00.000Z");
		const validarIndeferido = agora >= dataEncerramentoIndeferidos;
		usuario = await db.usuario.findFirst({ where: {
			OR: [
				{ login },
				{ email: login }
			]
		}});
		if (!usuario || usuario.status === false) return null;
		if (process.env.ENVIRONMENT === 'local') return usuario;
		if (usuario.tipo === 'INTERNO') {
			try {
				await ldap.bind(`${usuario.login}${process.env.LDAP_DOMAIN}`, senha);
				await ldap.unbind();
			} catch (err) {
				console.log(err);
				usuario = null;
			}
		} else if (usuario.tipo === 'EXTERNO' && usuario.senha) {
			const validaSenha = matchPassword(senha, usuario.senha);
			if (usuario.permissao === "PARTICIPANTE" && validarIndeferido){
				const cadastro = await db.cadastro.findFirst({ 
					where: {
						usuarioId: usuario.id,
					},
					include: {
						avaliacao_licitadora: true
					}
				});
				if (!cadastro || !cadastro.avaliacao_licitadora || cadastro.avaliacao_licitadora.aprovado === false) return null;
			}
			if (!validaSenha) return null;
		}
	} catch (err) {
		console.log(err);
	}
	return usuario;
}

async function buscarPorLogin(login: string): Promise<{ nome: string | undefined; email: string | undefined; login: string } | null> {
	if (!login || login === '') return null
	let resposta: { nome: string | undefined; email: string | undefined; login: string } | null = null;
	let serverNum = 0;
	const erros: any[] = [];
	const servers = ldapServers;
	do {
		const ldap = createLdapServer(servers[serverNum]);
		try {
			await ldap.bind(
				`${process.env.LDAP_USER}${process.env.LDAP_DOMAIN}`,
				process.env.LDAP_PASS || '',
			);
			const usuario = await ldap.search(process.env.LDAP_BASE || '', {
				filter: `(&(samaccountname=${login}))`,
				scope: 'sub',
				attributes: ['name', 'mail', 'samaccountname'],
			});
			if (usuario.searchEntries.length > 0) {
				const { name, mail, sAMAccountName } = usuario.searchEntries[0];
				const nome = name ? name.toString() : undefined;
				const email = mail ? mail.toString().toLowerCase() : undefined;
				login = sAMAccountName ? sAMAccountName.toString().toLowerCase() : login;
				resposta = { nome, email, login };
			} else {
				erros.push({
				server: servers[serverNum],
				error: "Usuário não encontrado.",
				});
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			erros.push({
				server: servers[serverNum],
				error: err,
			});
		}
		ldap.unbind();
		serverNum++;
		if (resposta) break;
	} while (serverNum < servers.length);
	if (!resposta) return null
	return resposta;
}

// async function buscarPorLogin2(
// 	login: string,
// ): Promise<{ nome: string; email: string; login: string } | null> {
// 	const ldap = new Client({
// 		url: process.env.LDAP_SERVER || 'ldap://1.1.1.1',
// 	});
	
// 	if (!login || login === '') return null;
	
// 	let resposta = null;
// 	try {
// 		// Bind com credenciais de administrador
// 		await ldap.bind(`${process.env.LDAP_USER}${process.env.LDAP_DOMAIN}`, process.env.LDAP_PASS || "");
		
// 		// Buscar usuário
// 		const searchResult = await ldap.search(process.env.LDAP_BASE || "", {
// 			filter: `(&(samaccountname=${login}))`,
// 			scope: 'sub',
// 			attributes: ['name', 'mail'],
// 		});
		
// 		if (searchResult.searchEntries && searchResult.searchEntries.length > 0) {
// 			const entry = searchResult.searchEntries[0];
// 			const nome = Array.isArray(entry.name) ? entry.name[0] : entry.name;
// 			const email = Array.isArray(entry.mail) ? entry.mail[0] : entry.mail;
			
// 			const nomeStr = (nome as string)?.replace(/"/g, '') || '';
// 			const emailStr = (email as string)?.replace(/"/g, '').toLowerCase() || '';
			
// 			if (nomeStr && emailStr && nomeStr !== "" && emailStr !== "") {
// 				resposta = { nome: nomeStr, email: emailStr, login };
// 			}
// 		}
		
// 		await ldap.unbind();
// 	} catch (err) {
// 		console.log(err);
// 	}
	
// 	return resposta;
// }

export { bind, buscarPorLogin };
