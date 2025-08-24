/** @format */

import { db } from '@/lib/prisma';
import { gerarSenha, verificaLimite, verificaPagina } from '@/lib/utils';
import { ICreateUsuario } from '@/types/usuario';
import { Permissao, Usuario } from '@prisma/client';
import { hashPassword } from '@/lib/password';
import { transporter } from '@/lib/nodemailer';
import { templateNotificacao } from '@/app/api/cadastro/_utils/email-templates';
import { Logger } from '@/lib/logger';

export async function criarUsuario(
    dados: ICreateUsuario,
    contexto?: { usuarioId?: string; ip?: string; userAgent?: string }
) {
    const { usuarioId, ip, userAgent } = contexto || {};
    let enviarEmail = false;
    
    try {
        if (dados.tipo === 'INTERNO') {
            const { login, email, nome, permissao } = dados;
            if (!login || login === '' || !email || email === '') return null;
            if (await buscarPorLogin(login)) return null;
            if (await buscarPorEmail(email)) return null;
            
            const usuario = await db.usuario.create({
                data: { login, email, nome, permissao, tipo: 'INTERNO' },
            });

            // Log de criação de usuário interno
            await Logger.logCriacao("USUARIO", usuario.id, {
                login: usuario.login,
                email: usuario.email,
                nome: usuario.nome,
                permissao: usuario.permissao,
                tipo: usuario.tipo
            }, usuarioId, ip, userAgent);

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
            const senhaHash = hashPassword(senha);
            
            const usuario = await db.usuario.create({
                data: { email, nome, permissao, senha: senhaHash, tipo: 'EXTERNO', alterarSenha },
            });

            // Log de criação de usuário externo
            await Logger.logCriacao("USUARIO", usuario.id, {
                email: usuario.email,
                nome: usuario.nome,
                permissao: usuario.permissao,
                tipo: usuario.tipo,
                alterarSenha: usuario.alterarSenha
            }, usuarioId, ip, userAgent);

            if (usuario && enviarEmail) {
                try {
                    if (!transporter) {
                        console.warn('⚠️  Não foi possível enviar email: SMTP não configurado');
                        
                        // Log de aviso sobre SMTP não configurado
                        await Logger.logCustomizado({
                            acao: "WARNING",
                            entidade: "EMAIL",
                            mensagem: "SMTP não configurado - email não enviado para novo usuário",
                            nivel: "WARNING",
                            usuarioId,
                            ip,
                            userAgent
                        });
                        
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

                    // Log de envio de email
                    await Logger.logCustomizado({
                        acao: "EMAIL",
                        entidade: "USUARIO",
                        entidadeId: usuario.id,
                        mensagem: `Email de boas-vindas enviado para ${email}`,
                        nivel: "INFO",
                        usuarioId,
                        ip,
                        userAgent
                    });

                } catch (error) {
                    console.error(error);
                    
                    // Log de erro no envio de email
                    await Logger.logErro("Erro ao enviar email de boas-vindas", error as Error, {
                        entidade: "USUARIO",
                        entidadeId: usuario.id,
                        usuarioId,
                        ip,
                        userAgent
                    });
                }
            }
            
            if (!usuario) return null;
            return usuario;
        }
        
        return null;
    } catch (error) {
        // Log de erro na criação
        await Logger.logErro("Erro ao criar usuário", error as Error, {
            entidade: "USUARIO",
            usuarioId,
            ip,
            userAgent
        });
        
        throw error;
    }
}

export async function atualizarUsuario(
    id: string, 
    data: Partial<Usuario>,
    contexto?: { usuarioId?: string; ip?: string; userAgent?: string }
) {
    const { usuarioId, ip, userAgent } = contexto || {};
    
    try {
        // Buscar dados antes da atualização
        const usuarioAntes = await db.usuario.findUnique({
            where: { id },
            select: { nome: true, email: true, permissao: true, tipo: true, status: true }
        });

        const usuario = await db.usuario.update({ where: { id }, data });

        // Log de atualização
        await Logger.logAtualizacao("USUARIO", id, usuarioAntes as object, data as object, usuarioId, ip, userAgent);

        return usuario;
    } catch (error) {
        // Log de erro na atualização
        await Logger.logErro("Erro ao atualizar usuário", error as Error, {
            entidade: "USUARIO",
            entidadeId: id,
            usuarioId,
            ip,
            userAgent
        });
        
        throw error;
    }
}

export async function deletarUsuario(
    id: string,
    contexto?: { usuarioId?: string; ip?: string; userAgent?: string }
) {
    const { usuarioId, ip, userAgent } = contexto || {};
    
    try {
        // Buscar dados antes da exclusão
        const usuarioAntes = await db.usuario.findUnique({
            where: { id },
            select: { nome: true, email: true, permissao: true, tipo: true }
        });

        const usuario = await db.usuario.delete({ where: { id } });

        // Log de exclusão
        await Logger.logExclusao("USUARIO", id, usuarioAntes as object, usuarioId, ip, userAgent);

        return usuario;
    } catch (error) {
        // Log de erro na exclusão
        await Logger.logErro("Erro ao deletar usuário", error as Error, {
            entidade: "USUARIO",
            entidadeId: id,
            usuarioId,
            ip,
            userAgent
        });
        
        throw error;
    }
}

export async function buscarPorLogin(
    login: string,
    contexto?: { usuarioId?: string; ip?: string; userAgent?: string }
) {
    const { usuarioId, ip, userAgent } = contexto || {};
    
    try {
        const usuario = await db.usuario.findUnique({ where: { login } });
        
        if (usuario) {
            // Log de busca bem-sucedida
            await Logger.logAcesso("BUSCAR_USUARIO_LOGIN", usuarioId || "SISTEMA", true, 
                `Busca por login: ${login}`, ip, userAgent
            );
        } else {
            // Log de busca sem resultado
            await Logger.logAcesso("BUSCAR_USUARIO_LOGIN", usuarioId || "SISTEMA", false, 
                `Login não encontrado: ${login}`, ip, userAgent
            );
        }
        
        return usuario;
    } catch (error) {
        // Log de erro na busca
        await Logger.logErro("Erro ao buscar usuário por login", error as Error, {
            entidade: "USUARIO",
            usuarioId,
            ip,
            userAgent
        });
        
        throw error;
    }
}

export async function buscarPorEmail(
    email: string,
    contexto?: { usuarioId?: string; ip?: string; userAgent?: string }
) {
    const { usuarioId, ip, userAgent } = contexto || {};
    
    try {
        const usuario = await db.usuario.findUnique({ where: { email } });
        
        if (usuario) {
            // Log de busca bem-sucedida
            await Logger.logAcesso("BUSCAR_USUARIO_EMAIL", usuarioId || "SISTEMA", true, 
                `Busca por email: ${email}`, ip, userAgent
            );
        } else {
            // Log de busca sem resultado
            await Logger.logAcesso("BUSCAR_USUARIO_EMAIL", usuarioId || "SISTEMA", false, 
                `Email não encontrado: ${email}`, ip, userAgent
            );
        }
        
        return usuario;
    } catch (error) {
        // Log de erro na busca
        await Logger.logErro("Erro ao buscar usuário por email", error as Error, {
            entidade: "USUARIO",
            usuarioId,
            ip,
            userAgent
        });
        
        throw error;
    }
}

export async function alterarSenha(
    id: string, 
    data: { senha: string, confirmarSenha: string },
    contexto?: { usuarioId?: string; ip?: string; userAgent?: string }
) {
    const { usuarioId, ip, userAgent } = contexto || {};
    
    try {
        const { senha, confirmarSenha } = data;
        if (senha !== confirmarSenha) return null;
        
        const senhaHash = hashPassword(senha);
        const usuario = await db.usuario.update({ 
            where: { id }, 
            data: { senha: senhaHash, alterarSenha: false } 
        });

        // Log de alteração de senha
        await Logger.logAtualizacao("USUARIO", id, 
            { alterarSenha: true }, 
            { alterarSenha: false }, 
            usuarioId, ip, userAgent
        );

        return usuario;
    } catch (error) {
        // Log de erro na alteração de senha
        await Logger.logErro("Erro ao alterar senha", error as Error, {
            entidade: "USUARIO",
            entidadeId: id,
            usuarioId,
            ip,
            userAgent
        });
        
        throw error;
    }
}

export async function verificarPermissoes(
    id: string, 
    permissoes: string[] = [],
    contexto?: { usuarioId?: string; ip?: string; userAgent?: string }
) {
    const { usuarioId, ip, userAgent } = contexto || {};
    
    try {
        const usuario = await db.usuario.findUnique({ where: { id } });
        const temPermissao = usuario && (permissoes.length === 0 || permissoes.includes(usuario.permissao));
        
        // Log de verificação de permissões
        await Logger.logAcesso("VERIFICAR_PERMISSOES", id, !!temPermissao, 
            `Verificação de permissões: ${permissoes.join(', ')}`, ip, userAgent
        );
        
        return temPermissao;
    } catch (error) {
        // Log de erro na verificação
        await Logger.logErro("Erro ao verificar permissões", error as Error, {
            entidade: "USUARIO",
            entidadeId: id,
            usuarioId,
            ip,
            userAgent
        });
        
        throw error;
    }
}

export async function retornaPermissao(
    id: string,
    contexto?: { usuarioId?: string; ip?: string; userAgent?: string }
) {
    const { usuarioId, ip, userAgent } = contexto || {};
    
    try {
        const usuario = await db.usuario.findUnique({ where: { id } });
        
        if (usuario) {
            // Log de consulta de permissão
            await Logger.logAcesso("CONSULTAR_PERMISSAO", id, true, 
                `Permissão consultada: ${usuario.permissao}`, ip, userAgent
            );
        } else {
            // Log de usuário não encontrado
            await Logger.logAcesso("CONSULTAR_PERMISSAO", id, false, 
                "Usuário não encontrado para consulta de permissão", ip, userAgent
            );
        }
        
        return usuario?.permissao || null;
    } catch (error) {
        // Log de erro na consulta
        await Logger.logErro("Erro ao consultar permissão", error as Error, {
            entidade: "USUARIO",
            entidadeId: id,
            usuarioId,
            ip,
            userAgent
        });
        
        throw error;
    }
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
        permissao: {
            in: [Permissao.ADMIN, Permissao.JULGADORA, Permissao.DEV],
        },
    };
    const total = await db.usuario.count({ where: searchParams });
    if (total == 0) return { total: 0, pagina: 0, limite: 0, users: [] };
    [pagina, limite] = verificaLimite(pagina, limite, total);
    const usuarios = await db.usuario.findMany({
        where: searchParams,
        orderBy: { nome: 'asc' },
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
