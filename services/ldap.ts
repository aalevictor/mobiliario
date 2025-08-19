/** @format */

import { db } from '@/lib/prisma';
import { Client, createClient } from 'ldapjs';
import bcrypt from 'bcryptjs';
import { Usuario } from '@prisma/client';

async function bind(login: string, senha: string) {
	let usuario: Usuario | null = null;
	try {
		const ldap: Client = createClient({
			url: process.env.LDAP_SERVER || 'ldap://1.1.1.1',
		});
		usuario = await db.usuario.findFirst({ where: {
			OR: [
				{ login },
				{ email: login }
			]
		}});
		if (!usuario || usuario.status === false) return null;
		if (process.env.ENVIRONMENT === 'local' && usuario.tipo === 'INTERNO') return usuario;
		if (usuario.tipo === 'INTERNO') {
			await new Promise<void>((resolve) => {
				ldap.bind(`${login}${process.env.LDAP_DOMAIN}`, senha, (err: any) => {
					if (err) {
						ldap.destroy();
						usuario = null;
					}
					resolve();
				});
			});
			ldap.unbind();
		} else if (usuario.tipo === 'EXTERNO' && usuario.senha) {
			const validaSenha = await bcrypt.compare(senha, usuario.senha);
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
	const ldap: Client = createClient({
		url: process.env.LDAP_SERVER || 'ldap://1.1.1.1',
	});
	if (!login || login === '') return null;
	let resposta = null;
	try {
		await new Promise<void>((resolve) => {
			ldap.bind(`${process.env.LDAP_USER}${process.env.LDAP_DOMAIN}`, process.env.LDAP_PASS || "", (err: any) => {
				if (err) {
					ldap.destroy();
				}
				resolve();
			});
		});
		const usuario_ldap = await new Promise<any>((resolve, _reject) => {
			ldap.search(
				process.env.LDAP_BASE || "",
				{
					filter: `(&(samaccountname=${login})(company=SMUL))`,
					scope: 'sub',
					attributes: ['name', 'mail'],
				},
				(err, res) => {
					if (err) {
						ldap.destroy();
						resolve('erro');
					}
					res.on('searchEntry', async (entry) => {
						const nome = JSON.stringify(
						entry.pojo.attributes[0].values[0],
						).replaceAll('"', '');
						const email = JSON.stringify(entry.pojo.attributes[1].values[0])
						.replaceAll('"', '')
						.toLowerCase();
						resolve({ nome, email });
					});
					res.on('error', (_err) => {
						ldap.destroy();
						resolve('erro');
					});
					res.on('end', () => {
						ldap.destroy();
						resolve('erro');
					});
				},
			);
		});
		const { nome, email } = usuario_ldap;
		if (nome && email && nome !== "" && email !== "")
			resposta = { nome, email, login };		
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {}
	ldap.unbind();
	return resposta;
}

export { bind, buscarPorLogin };
