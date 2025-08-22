/** @format */

import { db } from '@/lib/prisma';
import { Client } from 'ldapts';
import { matchPassword } from '@/lib/password';
import { Usuario } from '@prisma/client';

async function bind(login: string, senha: string) {
	let usuario: Usuario | null = null;
	try {
		const ldap = new Client({
			url: process.env.LDAP_SERVER || 'ldap://1.1.1.1',
		});
		
		usuario = await db.usuario.findFirst({ where: {
			OR: [
				{ login },
				{ email: login }
			]
		}});
		if (!usuario || usuario.status === false) return null;		
		if (usuario.tipo === 'INTERNO') {
			if (process.env.ENVIRONMENT === 'local') return usuario;
			try {
				await ldap.bind(`${login}${process.env.LDAP_DOMAIN}`, senha);
				await ldap.unbind();
			} catch (err) {
				console.log(err);
				usuario = null;
			}
		} else if (usuario.tipo === 'EXTERNO' && usuario.senha) {
			const validaSenha = matchPassword(senha, usuario.senha);
			if (!validaSenha) return null;
		}
	} catch (err) {
		console.log(err);
	}
	return usuario;
}

async function buscarPorLogin(
	login: string,
): Promise<{ nome: string; email: string; login: string } | null> {
	const ldap = new Client({
		url: process.env.LDAP_SERVER || 'ldap://1.1.1.1',
	});
	
	if (!login || login === '') return null;
	
	let resposta = null;
	try {
		// Bind com credenciais de administrador
		await ldap.bind(`${process.env.LDAP_USER}${process.env.LDAP_DOMAIN}`, process.env.LDAP_PASS || "");
		
		// Buscar usuário
		const searchResult = await ldap.search(process.env.LDAP_BASE || "", {
			filter: `(&(samaccountname=${login})(|(company=SMUL)(company=SPURBANISMO)))`,
			scope: 'sub',
			attributes: ['name', 'mail'],
		});
		
		if (searchResult.searchEntries && searchResult.searchEntries.length > 0) {
			const entry = searchResult.searchEntries[0];
			const nome = Array.isArray(entry.name) ? entry.name[0] : entry.name;
			const email = Array.isArray(entry.mail) ? entry.mail[0] : entry.mail;
			
			const nomeStr = (nome as string)?.replace(/"/g, '') || '';
			const emailStr = (email as string)?.replace(/"/g, '').toLowerCase() || '';
			
			if (nomeStr && emailStr && nomeStr !== "" && emailStr !== "") {
				resposta = { nome: nomeStr, email: emailStr, login };
			}
		}
		
		await ldap.unbind();
	} catch (err) {
		console.log(err);
	}
	
	return resposta;
}

export { bind, buscarPorLogin };
