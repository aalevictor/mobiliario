import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import * as XLSX from 'xlsx';
import { verificarPermissoes } from "@/services/usuarios";

export async function POST(request: NextRequest) {
    try {
        // Verificar autenticação
        const session = await auth();
        if (!session) {
            return NextResponse.json(
                { message: "Não autorizado" },
                { status: 401 }
            );
        }

        // Verificar permissões - apenas ADMIN e DEV podem importar avaliações
        if (!await verificarPermissoes(session.user.id, ["ADMIN", "DEV"])) {
            return NextResponse.json(
                { message: "Sem permissão para importar avaliações" },
                { status: 403 }
            );
        }

        // Obter o arquivo do FormData
        const formData = await request.formData();
        const arquivo = formData.get('arquivo') as File;

        if (!arquivo) {
            return NextResponse.json(
                { message: "Nenhum arquivo enviado" },
                { status: 400 }
            );
        }

        // Verificar se é um arquivo Excel
        const isExcel = arquivo.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                       arquivo.type === 'application/vnd.ms-excel' ||
                       arquivo.name.endsWith('.xlsx') ||
                       arquivo.name.endsWith('.xls');

        if (!isExcel) {
            return NextResponse.json(
                { message: "Arquivo deve ser um Excel (.xlsx ou .xls)" },
                { status: 400 }
            );
        }

        // Converter arquivo para buffer
        const buffer = await arquivo.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        
        // Pegar a primeira planilha
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Converter para JSON
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (data.length < 2) {
            return NextResponse.json(
                { message: "Arquivo deve conter pelo menos uma linha de dados além do cabeçalho" },
                { status: 400 }
            );
        }

        console.log(data);

        let sucessos = 0;
        let erros = 0;
        const mensagens: string[] = [];

        // Processar cada linha (pular a primeira se for cabeçalho)
        const startRow = data[0] && typeof data[0][0] === 'string' && 
                        (data[0][0].toLowerCase().includes('ID') || 
                         data[0][0].toLowerCase().includes('número')) ? 1 : 0;

        for (let i = startRow; i < data.length; i++) {
            const linha = data[i];
            
            // Pular linhas vazias
            if (!linha || linha.length < 2 || !linha[0]) {
                continue;
            }

            const protocolo = String(linha[0]).trim();
            const statusTexto = String(linha[1] || '').trim().toUpperCase();
            const parecer = String(linha[2] || '').trim();

            try {
                // Verificar se o protocolo existe
                const cadastro = await db.cadastro.findUnique({
                    where: { protocolo },
                    select: { id: true }
                });

                if (!cadastro) {
                    erros++;
                    mensagens.push(`Linha ${i + 1}: Protocolo '${protocolo}' não encontrado`);
                    continue;
                }

                // Determinar se foi aprovado
                let aprovado: boolean;
                if (statusTexto === 'INSCRIÇÃO DEFERIDA') {
                    aprovado = true;
                } else if (statusTexto === 'INSCRIÇÃO INDEFERIDA') {
                    aprovado = false;
                } else {
                    erros++;
                    mensagens.push(`Linha ${i + 1}: Status '${statusTexto}' inválido. Use DEFERIDA ou INDEFERIDA`);
                    continue;
                }

                // Verificar se já existe uma avaliação para este cadastro
                const avaliacaoExistente = await db.avaliacao_Licitadora.findUnique({
                    where: { cadastroId: cadastro.id }
                });

                // Usar upsert para criar ou atualizar avaliação
                await db.avaliacao_Licitadora.upsert({
                    where: { cadastroId: cadastro.id },
                    update: {
                        aprovado,
                        parecer,
                        atualizadoEm: new Date(),
                        avaliadorId: session.user.id
                    },
                    create: {
                        cadastroId: cadastro.id,
                        avaliadorId: session.user.id,
                        aprovado,
                        parecer
                    }
                });
                sucessos++;
                const acao = avaliacaoExistente ? 'atualizada' : 'criada';
                mensagens.push(`Linha ${i + 1}: Avaliação do protocolo '${protocolo}' ${acao}`);

            } catch (error) {
                console.error(`Erro ao processar linha ${i + 1}:`, error);
                erros++;
                mensagens.push(`Linha ${i + 1}: Erro ao processar protocolo '${protocolo}'`);
            }
        }

        return NextResponse.json({
            message: `Importação concluída: ${sucessos} sucessos, ${erros} erros`,
            sucesso: sucessos,
            erro: erros,
            mensagens
        });

    } catch (error) {
        console.error('Erro ao importar avaliações:', error);
        return NextResponse.json(
            { message: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}