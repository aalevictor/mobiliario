"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

interface ICadastroAvaliacaoJulgadora {
    id: string;
    linhaTematica1: number | null;
    linhaTematica2: number | null;
    linhaTematica3: number | null;
    conceitoProjetual: number | null;
    atendimentoNormas: number | null;
    insercaoUrbana: number | null;
    qualidadeFuncional: number | null;
    exequibilidade: number | null;
    economicidade: number | null;
    qualidadeGrafica: number | null;
    observacoes: string | null;
    criadoEm: Date;
    atualizadoEm: Date;
}

interface AvaliacaoJulgadoraProps {
    avaliacao: ICadastroAvaliacaoJulgadora;
    cadastroId: number;
}

const criterios = [
    {
        key: 'linhaTematica1' as keyof ICadastroAvaliacaoJulgadora,
        nome: 'Linha Temática 1: Diversidade dos territórios e identidade paulistana',
        descricao: 'Reconhecer a pluralidade dos contextos urbanos da cidade e, ao mesmo tempo, revelar um traço unificador que simbolize a identidade coletiva de São Paulo.'
    },
    {
        key: 'linhaTematica2' as keyof ICadastroAvaliacaoJulgadora,
        nome: 'Linha Temática 2: Inclusão e integração das atividades no espaço público',
        descricao: 'Promover o uso democrático do espaço público com soluções que acolham diferentes corpos, idades e modos de vida, incentivando a convivência e a interação às atividades cotidianas.'
    },
    {
        key: 'linhaTematica3' as keyof ICadastroAvaliacaoJulgadora,
        nome: 'Linha Temática 3: Adaptação climática e sustentabilidade',
        descricao: 'Incentivar soluções de baixo impacto ambiental que respondam de forma adaptativa às mudanças do clima, contribuindo para o conforto ambiental urbano e a mitigação dos efeitos negativos dos eventos extremos.'
    },
    {
        key: 'conceitoProjetual' as keyof ICadastroAvaliacaoJulgadora,
        nome: 'Conceito e partido projetual',
        descricao: 'Clareza na exposição textual do conceito e partido adotados e sua compatibilidade ao desenho proposto'
    },
    {
        key: 'atendimentoNormas' as keyof ICadastroAvaliacaoJulgadora,
        nome: 'Atendimento às Normas Técnicas',
        descricao: 'Atendimento às normas aplicáveis'
    },
    {
        key: 'insercaoUrbana' as keyof ICadastroAvaliacaoJulgadora,
        nome: 'Inserção no espaço urbano',
        descricao: 'Atendimento às disposições específicas de inserção do elemento no espaço público, conforme diretrizes específicas.'
    },
    {
        key: 'qualidadeFuncional' as keyof ICadastroAvaliacaoJulgadora,
        nome: 'Qualidade Funcional',
        descricao: 'Habilidade de compreensão do programa de necessidades dos elementos e sua respectiva resolução técnica; Ergonomia, conforto e funcionalidade.'
    },
    {
        key: 'exequibilidade' as keyof ICadastroAvaliacaoJulgadora,
        nome: 'Exequibilidade',
        descricao: 'Indicação dos métodos construtivos e materiais empregados. Critério associado à indicação das estimativas preliminares de custo'
    },
    {
        key: 'economicidade' as keyof ICadastroAvaliacaoJulgadora,
        nome: 'Economicidade',
        descricao: 'Sustentabilidade econômica, viabilidade técnico-construtiva de implantação e manutenção. Critério associado à indicação das estimativas preliminares de custo'
    },
    {
        key: 'qualidadeGrafica' as keyof ICadastroAvaliacaoJulgadora,
        nome: 'Qualidade Gráfica',
        descricao: 'Qualidade da apresentação gráfica, clareza dos desenhos, organização das pranchas e comunicação visual do projeto'
    }
]

export default function AvaliacaoJulgadora({ avaliacao, cadastroId }: AvaliacaoJulgadoraProps) {
    const [notas, setNotas] = useState<Record<string, number>>({
        linhaTematica1: avaliacao.linhaTematica1 || 0,
        linhaTematica2: avaliacao.linhaTematica2 || 0,
        linhaTematica3: avaliacao.linhaTematica3 || 0,
        conceitoProjetual: avaliacao.conceitoProjetual || 0,
        atendimentoNormas: avaliacao.atendimentoNormas || 0,
        insercaoUrbana: avaliacao.insercaoUrbana || 0,
        qualidadeFuncional: avaliacao.qualidadeFuncional || 0,
        exequibilidade: avaliacao.exequibilidade || 0,
        economicidade: avaliacao.economicidade || 0,
        qualidadeGrafica: avaliacao.qualidadeGrafica || 0
    })
    const [observacoes, setObservacoes] = useState<string>(avaliacao.observacoes || '')
    const [isSaving, setIsSaving] = useState(false)
    const [isAutoSaving, setIsAutoSaving] = useState(false)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)
    const debounceObservacaoRef = useRef<NodeJS.Timeout | null>(null)
    const initialNotasRef = useRef<Record<string, number>>(notas)
    const initialObservacaoRef = useRef<string>(observacoes)

    const handleNotaChange = useCallback((criterio: string, valor: string) => {
        const nota = parseFloat(valor)
        if (isNaN(nota) || nota < 0 || nota > 10) return
        
        // Limitar a 1 casa decimal
        const notaLimitada = Math.round(nota * 10) / 10
        
        setNotas(prev => ({
            ...prev,
            [criterio]: notaLimitada
        }))
    }, [])

    const autoSave = useCallback(async (notasParaSalvar: Record<string, number>, observacoesParaSalvar: string) => {
        setIsAutoSaving(true)
        try {
            const response = await fetch(`/api/cadastro/${cadastroId}/avaliacao`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...notasParaSalvar, observacoes: observacoesParaSalvar })
            })

            if (!response.ok) {
                throw new Error('Erro ao salvar avaliação automaticamente')
            }

            // Não mostrar toast para salvamento automático para não poluir a interface
        } catch (error) {
            console.error('Erro no salvamento automático:', error)
            // Apenas mostrar erro se for crítico
        } finally {
            setIsAutoSaving(false)
        }
    }, [cadastroId])

    // Effect para salvamento automático das notas com debounce
    useEffect(() => {
        // Não salvar na primeira renderização
        const notasIniciais = initialNotasRef.current
        const notasMudaram = Object.keys(notas).some(key => notas[key] !== notasIniciais[key])
        
        if (!notasMudaram) {
            return
        }

        // Limpar timeout anterior
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        // Configurar novo timeout para salvamento
        debounceRef.current = setTimeout(() => {
            autoSave(notas, observacoes)
        }, 1500) // Salvar após 1.5 segundos de inatividade

        // Cleanup
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }
    }, [notas, autoSave, observacoes])

    // Effect para salvamento automático da observação com debounce
    useEffect(() => {
        // Não salvar na primeira renderização
        const observacaoInicial = initialObservacaoRef.current
        const observacaoMudou = observacoes !== observacaoInicial
        
        if (!observacaoMudou) {
            return
        }

        // Limpar timeout anterior
        if (debounceObservacaoRef.current) {
            clearTimeout(debounceObservacaoRef.current)
        }

        // Configurar novo timeout para salvamento
        debounceObservacaoRef.current = setTimeout(() => {
            autoSave(notas, observacoes)
        }, 1500) // Salvar após 1.5 segundos de inatividade

        // Cleanup
        return () => {
            if (debounceObservacaoRef.current) {
                clearTimeout(debounceObservacaoRef.current)
            }
        }
    }, [observacoes, autoSave, notas])

    const handleSave = useCallback(async () => {
        setIsSaving(true)
        try {
            const response = await fetch(`/api/cadastro/${cadastroId}/avaliacao`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...notas, observacoes })
            })

            if (!response.ok) {
                throw new Error('Erro ao salvar avaliação')
            }

            toast.success('Avaliação salva com sucesso!')
        } catch (error) {
            console.error('Erro ao salvar avaliação:', error)
            toast.error('Erro ao salvar avaliação')
        } finally {
            setIsSaving(false)
        }
    }, [notas, observacoes, cadastroId])

    const calcularMediaParcial = () => {
        const notasLinhasTemáticas = (notas.linhaTematica1 + notas.linhaTematica2 + notas.linhaTematica3) / 3
        return notasLinhasTemáticas.toFixed(2)
    }

    const calcularMediaParcialSegundaMetade = () => {
        const notasSegundaMetade = (
            notas.conceitoProjetual + 
            notas.atendimentoNormas + 
            notas.insercaoUrbana + 
            notas.qualidadeFuncional + 
            notas.exequibilidade + 
            notas.economicidade + 
            notas.qualidadeGrafica
        ) / 7
        return notasSegundaMetade.toFixed(2)
    }

    const calcularMediaFinal = () => {
        const todasNotas = Object.values(notas)
        const soma = todasNotas.reduce((acc, nota) => acc + nota, 0)
        return (soma / todasNotas.length).toFixed(2)
    }

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>Observação:</strong> As notas poderão variar de 0 (zero) a 10 (dez), admitidas frações com uma casa decimal.
                </p>
            </div>

            <Table>
                 <TableHeader>
                     <TableRow>
                         <TableHead className="w-1/4">Critério básico</TableHead>
                         <TableHead className="w-2/3">Descrição</TableHead>
                         <TableHead className="w-20 text-center">Nota</TableHead>
                     </TableRow>
                 </TableHeader>
                <TableBody>
                    <TableRow className="bg-gray-50">
                        <TableCell colSpan={3} className="font-semibold text-center">
                            Aderência à Temática:
                        </TableCell>
                    </TableRow>
                    {criterios.slice(0, 3).map((criterio) => (
                         <TableRow key={criterio.key}>
                             <TableCell className="font-medium align-top">
                                 <div className="whitespace-normal break-words">
                                     {criterio.nome}
                                 </div>
                             </TableCell>
                             <TableCell className="text-sm text-gray-600 align-top">
                                 <div className="whitespace-normal break-words">
                                     {criterio.descricao}
                                 </div>
                             </TableCell>
                             <TableCell className="text-center align-top">
                                 <Input
                                     type="number"
                                     min="0"
                                     max="10"
                                     step="0.1"
                                     value={notas[criterio.key]}
                                     onChange={(e) => handleNotaChange(criterio.key, e.target.value)}
                                     onBlur={(e) => {
                                         const valor = parseFloat(e.target.value)
                                         if (!isNaN(valor)) {
                                             const valorLimitado = Math.round(valor * 10) / 10
                                             e.target.value = valorLimitado.toString()
                                             handleNotaChange(criterio.key, valorLimitado.toString())
                                         }
                                     }}
                                     className="w-16 text-center"
                                 />
                             </TableCell>
                         </TableRow>
                     ))}
                    <TableRow className="bg-blue-50">
                        <TableCell colSpan={2} className="font-semibold text-right">
                            MÉDIA PARCIAL:
                        </TableCell>
                        <TableCell className="text-center font-bold">
                            {calcularMediaParcial()}
                        </TableCell>
                    </TableRow>
                    {criterios.slice(3).map((criterio) => (
                         <TableRow key={criterio.key}>
                             <TableCell className="font-medium align-top">
                                 <div className="whitespace-normal break-words">
                                     {criterio.nome}
                                 </div>
                             </TableCell>
                             <TableCell className="text-sm text-gray-600 align-top">
                                 <div className="whitespace-normal break-words">
                                     {criterio.descricao}
                                 </div>
                             </TableCell>
                             <TableCell className="text-center align-top">
                                 <Input
                                     type="number"
                                     min="0"
                                     max="10"
                                     step="0.1"
                                     value={notas[criterio.key]}
                                     onChange={(e) => handleNotaChange(criterio.key, e.target.value)}
                                     onBlur={(e) => {
                                         const valor = parseFloat(e.target.value)
                                         if (!isNaN(valor)) {
                                             const valorLimitado = Math.round(valor * 10) / 10
                                             e.target.value = valorLimitado.toString()
                                             handleNotaChange(criterio.key, valorLimitado.toString())
                                         }
                                     }}
                                     className="w-16 text-center"
                                 />
                             </TableCell>
                         </TableRow>
                     ))}
                    <TableRow className="bg-blue-50">
                        <TableCell colSpan={2} className="font-semibold text-right">
                            MÉDIA PARCIAL:
                        </TableCell>
                        <TableCell className="text-center font-bold">
                            {calcularMediaParcialSegundaMetade()}
                        </TableCell>
                    </TableRow>
                    <TableRow className="bg-green-50">
                        <TableCell colSpan={2} className="font-semibold text-right">
                            MÉDIA FINAL:
                        </TableCell>
                        <TableCell className="text-center font-bold text-green-700">
                            {calcularMediaFinal()}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <div className="space-y-4">
                <div>
                    <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">
                        Observações Gerais da Avaliação
                    </label>
                    <Textarea
                        id="observacoes"
                        placeholder="Digite aqui suas observações gerais sobre a avaliação..."
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        className="min-h-[100px] resize-y"
                    />
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    {isAutoSaving && (
                        <div className="flex items-center">
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Salvando automaticamente...
                        </div>
                    )}
                </div>
                <Button 
                    onClick={handleSave} 
                    disabled={isSaving || isAutoSaving}
                    className="min-w-32"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Avaliação
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}