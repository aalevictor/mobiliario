"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface LiberarFase2ButtonProps {
    cadastroId: number
    arquivoId: string
    liberado: boolean
    onUpdate?: () => void
}

export default function LiberarFase2Button({ cadastroId, arquivoId, liberado, onUpdate }: LiberarFase2ButtonProps) {
    const [value, setValue] = useState(liberado)
    const [loading, setLoading] = useState(false)

    const handleToggle = async (checked: boolean) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/cadastro/${cadastroId}/arquivos/${arquivoId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ liberadoFase2: checked }),
            })
            if (res.ok) {
                setValue(checked)
                onUpdate?.()
                toast.success(checked ? "Arquivo liberado para a julgadora." : "Arquivo ocultado da julgadora.")
            } else {
                const body = await res.json().catch(() => ({}))
                toast.error(body.error || "Erro ao atualizar visibilidade.")
            }
        } catch {
            toast.error("Erro ao atualizar visibilidade.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            {loading
                ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                : <Switch
                    checked={value}
                    onCheckedChange={handleToggle}
                    disabled={loading}
                    className="cursor-pointer"
                />
            }
            <Label className="text-xs text-muted-foreground cursor-pointer select-none whitespace-nowrap">
                {value ? "Liberado" : "Oculto"}
            </Label>
        </div>
    )
}
