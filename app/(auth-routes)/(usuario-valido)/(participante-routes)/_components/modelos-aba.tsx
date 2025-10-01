"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Download, FileArchive, FileText } from "lucide-react"
import Link from "next/link"

const arquivos = [
    {
        nome: "Planilha de Custos Unificada - FASE 2",
        descricao: "Modelo Resumo da Planilha de Custos (Anexo 01 do Termo de Referência) + Modelo da Planilha de Composição de Custos com Memória de Cálculo (Anexo 02 do Termo de Referência) + Modelo de Composição de Preço Unitário (Anexo 03 do Termo de Referência)",
        link: "/modelos/MOB-2025-0000000000_CMU_01_4_MU_PQ_001_A.xlsm",
        icon: FileText,
    },
    {
        nome: "Nomenclatura dos arquivos - FASE 1 E FASE 2",
        descricao: "Modelo de Identificação do Arquivo das Pranchas e documentos técnicos submetidos pelos Candidatos - Fase 1 e Fase 2 (Anexo 04 do Termo de Referência)",
        link: "/modelos/CMU_Nomenclatura-dos-arquivos.zip",
        icon: FileArchive,
    },
    {
        nome: "Imagens para fotomontagens - FASE 1",
        descricao: "Modelo de Imagens para fotomontagens (Anexo 05 do Termo de Referência)",
        link: "/modelos/CMU_FOTOMONTAGENS.zip",
        icon: FileArchive,
    },
    {
        nome: "Modelo de Prancha - FASE 1",
        descricao: "Modelo de Prancha - Estudos Preliminares - FASE 1 (Anexo 06 do Termo de Referência)",
        link: "/modelos/CMU_Modelo_Prancha_EP_FASE_1.zip",
        icon: FileArchive,
    },
    {
        nome: "Modelo de Prancha - FASE 2",
        descricao: "Modelo de Pranchas - Projetos em Nível Básico (FASE 2) Versão 1 - sem identificação (Anexo 07 do Termo de Referência) e Versão 2 - com identificação (Anexo 08 do Termo de Referência)",
        link: "/modelos/CMU_Modelo_Pranchas_PB_FASE_2.zip",
        icon: FileArchive,
    },
]
export default function ModelosAba() {
    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">Modelos de Referência</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                    Confira os modelos de referência para os projetos.
                </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 flex flex-col gap-2">
                {arquivos.map((arquivo, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <arquivo.icon className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                            <div className="flex flex-col min-w-0 flex-1">
                                <p className="font-medium truncate">{arquivo.nome}</p>
                                <p className="text-sm text-gray-500 break-words">{arquivo.descricao}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Link
                                href={arquivo.link}
                                download
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}