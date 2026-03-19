"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Play } from "lucide-react"
import { useRouter } from "next/navigation"

interface IniciarAvaliacaoGenericaButtonProps {
    cadastroId: number
    endpoint: string
    label: string
}

export default function IniciarAvaliacaoGenericaButton({ cadastroId, endpoint, label }: IniciarAvaliacaoGenericaButtonProps) {
    const [isCreating, setIsCreating] = useState(false)
    const router = useRouter()

    const handleIniciar = async () => {
        setIsCreating(true)
        try {
            const response = await fetch(`/api/cadastro/${cadastroId}/${endpoint}/iniciar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            if (!response.ok) throw new Error(`Erro ao iniciar ${label}`)
            toast.success(`${label} iniciada com sucesso!`)
            router.refresh()
        } catch (error) {
            console.error(`Erro ao iniciar ${label}:`, error)
            toast.error(`Erro ao iniciar ${label}`)
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className="text-center py-8">
            <div className="mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma avaliação encontrada
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                    A avaliação ainda não foi iniciada para este cadastro.
                </p>
            </div>
            <Button onClick={handleIniciar} disabled={isCreating} size="lg" className="min-w-48">
                {isCreating ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Iniciando...</>
                ) : (
                    <><Play className="mr-2 h-4 w-4" />Iniciar {label}</>
                )}
            </Button>
        </div>
    )
}
