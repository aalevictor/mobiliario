"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

interface IAvaliacaoProtetipo {
    id: string
    ergonomia: number
    desempenho_funcional: number
    qualidade_construtiva: number
    durabilidade: number
    receptividade_interacao: number
    compatibilidade_preliminar: number
    observacoes: string | null
    avaliado: boolean
    criadoEm: Date
    atualizadoEm: Date
}

interface AvaliacaoPrototipoProps {
    avaliacao: IAvaliacaoProtetipo
    cadastroId: number
}

const criterios = [
    {
        key: 'ergonomia' as keyof IAvaliacaoProtetipo,
        nome: 'Ergonomia, conforto e acessibilidade',
        descricao: 'Avaliação da usabilidade dos elementos pelos diferentes perfis de usuários, considerando conforto físico, ergonomia e conformidade com as normas de acessibilidade vigentes.',
    },
    {
        key: 'desempenho_funcional' as keyof IAvaliacaoProtetipo,
        nome: 'Desempenho funcional e adaptabilidade ao espaço urbano',
        descricao: 'Verificação da eficiência do mobiliário em seu uso público real, sua integração ao ambiente urbano e a adaptabilidade a diferentes contextos espaciais.',
    },
    {
        key: 'qualidade_construtiva' as keyof IAvaliacaoProtetipo,
        nome: 'Qualidade construtiva e escolha de materiais',
        descricao: 'Observação direta da execução dos protótipos, com foco na coerência técnica da montagem, acabamento e adequação dos materiais empregados quanto à estética, resistência e sustentabilidade.',
    },
    {
        key: 'durabilidade' as keyof IAvaliacaoProtetipo,
        nome: 'Durabilidade e manutenção',
        descricao: 'Capacidade de resistência ao uso contínuo, intempéries e condições do espaço público ao longo do tempo.',
    },
    {
        key: 'receptividade_interacao' as keyof IAvaliacaoProtetipo,
        nome: 'Receptividade e interação pública',
        descricao: 'Grau de aceitação e apropriação dos protótipos pela população usuária durante o período de experimentação, considerando aspectos como empatia, engajamento e clareza de uso.',
    },
    {
        key: 'compatibilidade_preliminar' as keyof IAvaliacaoProtetipo,
        nome: 'Compatibilidade com as informações do estudo preliminar e projeto em nível básico',
        descricao: 'Correspondência com as informações contidas no Estudo Preliminar e disposições técnicas do projeto em nível básico apresentado',
    },
]

export default function AvaliacaoProtetipo({ avaliacao, cadastroId }: AvaliacaoPrototipoProps) {
    const [notas, setNotas] = useState<Record<string, number>>({
        ergonomia: avaliacao.ergonomia || 0,
        desempenho_funcional: avaliacao.desempenho_funcional || 0,
        qualidade_construtiva: avaliacao.qualidade_construtiva || 0,
        durabilidade: avaliacao.durabilidade || 0,
        receptividade_interacao: avaliacao.receptividade_interacao || 0,
        compatibilidade_preliminar: avaliacao.compatibilidade_preliminar || 0,
    })
    const [observacoes, setObservacoes] = useState<string>(avaliacao.observacoes || '')
    const [avaliado, setAvaliado] = useState<boolean>(avaliacao.avaliado || false)
    const [isSaving, setIsSaving] = useState(false)
    const [isAutoSaving, setIsAutoSaving] = useState(false)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)
    const debounceObservacaoRef = useRef<NodeJS.Timeout | null>(null)
    const initialNotasRef = useRef<Record<string, number>>(notas)
    const initialObservacaoRef = useRef<string>(observacoes)

    const handleNotaChange = useCallback((criterio: string, valor: string) => {
        const nota = parseFloat(valor)
        if (isNaN(nota) || nota < 0 || nota > 10) return
        setNotas(prev => ({ ...prev, [criterio]: Math.round(nota * 10) / 10 }))
    }, [])

    const autoSave = useCallback(async (
        notasParaSalvar: Record<string, number>,
        observacoesParaSalvar: string,
        avaliadoParaSalvar: boolean
    ) => {
        setIsAutoSaving(true)
        try {
            const response = await fetch(`/api/cadastro/${cadastroId}/avaliacao-prototipo`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...notasParaSalvar, observacoes: observacoesParaSalvar, avaliado: avaliadoParaSalvar })
            })
            if (!response.ok) throw new Error('Erro ao salvar avaliação automaticamente')
        } catch (error) {
            console.error('Erro no salvamento automático:', error)
        } finally {
            setIsAutoSaving(false)
        }
    }, [cadastroId])

    useEffect(() => {
        const notasIniciais = initialNotasRef.current
        const notasMudaram = Object.keys(notas).some(key => notas[key] !== notasIniciais[key])
        if (!notasMudaram) return

        setAvaliado(false)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            autoSave(notas, observacoes, false)
        }, 1500)
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    }, [notas, autoSave, observacoes])

    useEffect(() => {
        const observacaoInicial = initialObservacaoRef.current
        if (observacoes === observacaoInicial) return

        setAvaliado(false)
        if (debounceObservacaoRef.current) clearTimeout(debounceObservacaoRef.current)
        debounceObservacaoRef.current = setTimeout(() => {
            autoSave(notas, observacoes, false)
        }, 1500)
        return () => { if (debounceObservacaoRef.current) clearTimeout(debounceObservacaoRef.current) }
    }, [observacoes, autoSave, notas])

    const handleSave = useCallback(async () => {
        setIsSaving(true)
        try {
            const response = await fetch(`/api/cadastro/${cadastroId}/avaliacao-prototipo`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...notas, observacoes, avaliado })
            })
            if (!response.ok) throw new Error('Erro ao salvar avaliação')
            toast.success('Avaliação salva com sucesso!')
        } catch (error) {
            console.error('Erro ao salvar avaliação:', error)
            toast.error('Erro ao salvar avaliação')
        } finally {
            setIsSaving(false)
        }
    }, [notas, observacoes, cadastroId, avaliado])

    const calcularMedia = () => {
        const soma = Object.values(notas).reduce((acc, n) => acc + n, 0)
        return (soma / Object.values(notas).length).toFixed(2)
    }

    const inputProps = (key: string) => ({
        type: "number" as const,
        inputMode: "decimal" as const,
        min: "0",
        max: "10",
        step: "0.1",
        value: notas[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleNotaChange(key, e.target.value),
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
            const valor = parseFloat(e.target.value)
            if (!isNaN(valor)) {
                const v = Math.round(valor * 10) / 10
                e.target.value = v.toString()
                handleNotaChange(key, v.toString())
            }
        },
        pattern: "[0-9]+(\\.[0-9]{1})?",
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <div>
                    <p className="text-sm font-medium">Avaliação concluída</p>
                    <p className="text-xs text-gray-600">Marque quando finalizar sua avaliação.</p>
                </div>
                <Switch
                    checked={avaliado}
                    onCheckedChange={(checked) => {
                        setAvaliado(checked)
                        autoSave(notas, observacoes, checked)
                    }}
                    className="data-[state=checked]:bg-green-600"
                />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>Observação:</strong> As notas poderão variar de 0 (zero) a 10 (dez), admitidas frações com uma casa decimal.
                </p>
            </div>

            {/* Layout mobile */}
            <div className="md:hidden space-y-3">
                {criterios.map((criterio) => (
                    <div key={criterio.key} className="p-3 border rounded-lg">
                        <div className="text-sm font-medium mb-1 break-words">{criterio.nome}</div>
                        <div className="text-xs text-gray-600 mb-3 break-words">{criterio.descricao}</div>
                        <div className="flex items-center justify-between">
                            <label className="text-xs text-gray-700">Nota</label>
                            <Input {...inputProps(criterio.key)} className="w-24 text-center" />
                        </div>
                    </div>
                ))}
                <div className="bg-green-50 p-2 rounded font-semibold flex justify-between">
                    <span>MÉDIA FINAL</span>
                    <span className="text-green-700">{calcularMedia()}</span>
                </div>
            </div>

            {/* Layout desktop */}
            <div className="hidden md:block overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-64 w-1/4">Critério</TableHead>
                            <TableHead className="min-w-[480px] w-2/3">Descrição</TableHead>
                            <TableHead className="min-w-20 w-20 text-center">Nota</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {criterios.map((criterio) => (
                            <TableRow key={criterio.key}>
                                <TableCell className="font-medium align-top">
                                    <div className="whitespace-normal break-words">{criterio.nome}</div>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600 align-top">
                                    <div className="whitespace-normal break-words">{criterio.descricao}</div>
                                </TableCell>
                                <TableCell className="text-center align-top">
                                    <Input {...inputProps(criterio.key)} className="w-16 text-center" />
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow className="bg-green-50">
                            <TableCell colSpan={2} className="font-semibold text-right">MÉDIA FINAL:</TableCell>
                            <TableCell className="text-center font-bold text-green-700">{calcularMedia()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações Gerais da Avaliação
                </label>
                <Textarea
                    placeholder="Digite aqui suas observações gerais sobre a avaliação..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    className="min-h-[100px] resize-y"
                />
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
                <Button onClick={handleSave} disabled={isSaving || isAutoSaving} className="min-w-32">
                    {isSaving ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
                    ) : (
                        <><Save className="mr-2 h-4 w-4" />Salvar Avaliação</>
                    )}
                </Button>
            </div>
        </div>
    )
}
