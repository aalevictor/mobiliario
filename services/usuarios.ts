/** @format */

import { db } from '@/lib/prisma';
import { gerarSenha, verificaLimite, verificaPagina } from '@/lib/utils';
import { ICreateUsuario } from '@/types/usuario';
import { Usuario } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { transporter } from '@/lib/nodemailer';
import { templateNotificacao } from '@/app/api/cadastro/_utils/email-templates';

export async function criarUsuario(dados: ICreateUsuario) {
    let enviarEmail = false;
	if (dados.tipo === 'INTERNO') {
		const { login, email, nome, permissao } = dados;
		if (!login || login === '' || !email || email === '') return null;
		if (await buscarPorLogin(login)) return null;
		if (await buscarPorEmail(email)) return null;
		const usuario = await db.usuario.create({
			data: { login, email, nome, permissao, tipo: 'INTERNO' },
		});
		return usuario;
	}
	if (dados.tipo === 'EXTERNO') {
		const { email, nome, permissao } = dados;
        let senha = dados.senha;
        let alterarSenha = false;
		if (!email || email === '') return null;
        if (!senha || senha === '') {
            senha = gerarSenha();
            alterarSenha = true;
            enviarEmail = true;
        }
		if (await buscarPorEmail(email)) return null;
		const senhaHash = await bcrypt.hash(senha, 10);
        console.log({ senha })
		const usuario = await db.usuario.create({
			data: { email, nome, permissao, senha: senhaHash, tipo: 'EXTERNO', alterarSenha },
		});
        if (usuario && enviarEmail) {
            try {
                if (!transporter) {
                    console.warn('⚠️  Não foi possível enviar email: SMTP não configurado');
                    return usuario;
                }
                await transporter.sendMail({
                    from: process.env.MAIL_FROM,
                    to: email,
                    subject: 'Concurso de Mobiliário Urbano 2025 - Cadastro',
                    html: templateNotificacao(
                        nome, 
                        'Cadastro realizado com sucesso', 
                        `Seu cadastro foi realizado com sucesso. Para acessar, use as credenciais abaixo:<br><strong>Login:</strong> ${email} <br><strong>Senha:</strong> ${senha}`
                    ),
                });
            } catch (error) {
                console.error(error);
            }
        }
        if (!usuario) return null;
		return usuario;
	}
	return null;
}

export async function atualizarUsuario(id: string, data: Partial<Usuario>) {
	const usuario = await db.usuario.update({ where: { id }, data });
	return usuario;
}

export async function buscarPorLogin(login: string) {
	const usuario = await db.usuario.findUnique({ where: { login } });
	return usuario;
}

export async function buscarPorEmail(email: string) {
	const usuario = await db.usuario.findUnique({ where: { email } });
	return usuario;
}

export async function alterarSenha(id: string, data: { senha: string, confirmarSenha: string }) {
    const { senha, confirmarSenha } = data;
    if (senha !== confirmarSenha) return null;
    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await db.usuario.update({ where: { id }, data: { senha: senhaHash, alterarSenha: false } });
    return usuario;
}

export async function verificarPermissoes(id: string, permissoes: string[] = []) {
    const usuario = await db.usuario.findUnique({ where: { id } });
    if (usuario && (permissoes.length === 0 || permissoes.includes(usuario.permissao))) return true;
    return false;
}

export async function retornaPermissao(id: string) {
    const usuario = await db.usuario.findUnique({ where: { id } });
    if (!usuario) return null;
    return usuario.permissao;
}

export async function validaSenha(id: string) {
    const usuario = await db.usuario.findUnique({ where: { id } });
    if (!usuario || usuario.alterarSenha) return false;
    return true;
}

export async function buscarUsuarios(
    pagina: number = 1,
    limite: number = 10,
    busca?: string,
) {
    [pagina, limite] = verificaPagina(pagina, limite);
    const searchParams = {
        ...(busca && {
            OR: [
                { nome: { contains: busca } },
                { email: { contains: busca } },
                { login: { contains: busca } },
            ],
        }),
    };
    const total = await db.usuario.count({ where: searchParams });
    if (total == 0) return { total: 0, pagina: 0, limite: 0, users: [] };
    [pagina, limite] = verificaLimite(pagina, limite, total);
    const usuarios = await db.usuario.findMany({
        where: searchParams,
        orderBy: { criadoEm: 'asc' },
        skip: (pagina - 1) * limite,
        take: limite,
    });
    return {
        total: +total,
        pagina: +pagina,
        limite: +limite,
        data: usuarios,
    };
}
