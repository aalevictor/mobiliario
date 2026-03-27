"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PROPOSTA_LABELS, PROPOSTA_GRUPOS } from "@/lib/proposta-labels"

interface PropostaSelectProps {
    cadastroId: number
    arquivoId: string
    propostas: string[]
    onUpdate?: () => void
}

export default function PropostaSelect({ cadastroId, arquivoId, propostas: initial, onUpdate }: PropostaSelectProps) {
    const [selected, setSelected] = useState<string[]>(initial)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const save = async (nova: string[]) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/cadastro/${cadastroId}/arquivos/${arquivoId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ propostas: nova }),
            })
            if (res.ok) {
                setSelected(nova)
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

    const toggle = (value: string) => {
        const nova = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value]
        save(nova)
    }

    const remove = (value: string, e: React.MouseEvent) => {
        e.stopPropagation()
        save(selected.filter((v) => v !== value))
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    className="h-auto min-h-8 w-full max-w-72 justify-between px-2 py-1 text-xs font-normal"
                    disabled={loading}
                >
                    <span className="flex flex-wrap gap-1 flex-1 min-w-0">
                        {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                        {selected.length === 0 && !loading && (
                            <span className="text-muted-foreground">Selecione as propostas…</span>
                        )}
                        {selected.map((v) => (
                            <Badge key={v} variant="secondary" className="text-[11px] px-1 py-0 gap-1">
                                {PROPOSTA_LABELS[v] ?? v}
                                <span
                                    role="button"
                                    onClick={(e) => remove(v, e)}
                                    className="rounded hover:bg-muted-foreground/20 cursor-pointer"
                                >
                                    <X className="h-2.5 w-2.5" />
                                </span>
                            </Badge>
                        ))}
                    </span>
                    <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="start">
                <Command>
                    <CommandInput placeholder="Buscar proposta…" className="text-xs h-8" />
                    <CommandList>
                        <CommandEmpty className="text-xs py-4 text-center text-muted-foreground">
                            Nenhuma proposta encontrada.
                        </CommandEmpty>
                        {PROPOSTA_GRUPOS.map((grupo) => (
                            <CommandGroup key={grupo.label} heading={grupo.label}>
                                {grupo.items.map((item) => (
                                    <CommandItem
                                        key={item}
                                        value={`${item} ${PROPOSTA_LABELS[item]}`}
                                        onSelect={() => toggle(item)}
                                        className="text-xs"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-3.5 w-3.5",
                                                selected.includes(item) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {PROPOSTA_LABELS[item]}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
