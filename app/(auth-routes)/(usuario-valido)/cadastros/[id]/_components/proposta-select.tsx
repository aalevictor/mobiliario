"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PROPOSTA_LABELS, PROPOSTA_GRUPOS } from "@/lib/proposta-labels"

interface PropostaSelectProps {
    cadastroId: number
    arquivoId: string
    proposta: string
    onUpdate?: () => void
}

export default function PropostaSelect({ cadastroId, arquivoId, proposta, onUpdate }: PropostaSelectProps) {
    const [value, setValue] = useState<string>(proposta)
    const [loading, setLoading] = useState(false)

    const handleChange = async (nova: string) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/cadastro/${cadastroId}/arquivos/${arquivoId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ proposta: nova }),
            })
            if (res.ok) {
                setValue(nova)
                onUpdate?.()
                toast.success("Proposta atualizada.")
            } else {
                const body = await res.json().catch(() => ({}))
                toast.error(body.error || "Erro ao atualizar proposta.")
            }
        } catch {
            toast.error("Erro ao atualizar proposta.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-1">
            {loading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            <Select value={value} onValueChange={handleChange} disabled={loading}>
                <SelectTrigger className="w-full max-w-64 h-8 text-xs">
                    <SelectValue placeholder="Selecione a proposta" />
                </SelectTrigger>
                <SelectContent>
                    {PROPOSTA_GRUPOS.map((grupo) => (
                        <SelectGroup key={grupo.label}>
                            <SelectLabel className="text-xs">{grupo.label}</SelectLabel>
                            {grupo.items.map((item) => (
                                <SelectItem key={item} value={item} className="text-xs">
                                    {PROPOSTA_LABELS[item]}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
