"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Play } from "lucide-react"
import { useRouter } from "next/navigation"

interface IniciarAvaliacaoButtonProps {
    cadastroId: number
}

export default function IniciarAvaliacaoButton({ cadastroId }: IniciarAvaliacaoButtonProps) {
    const [isCreating, setIsCreating] = useState(false)
    const router = useRouter()

    const handleIniciarAvaliacao = async () => {
        setIsCreating(true)
        try {
            const response = await fetch(`/api/cadastro/${cadastroId}/avaliacao/iniciar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Erro ao iniciar avaliação')
            }

            toast.success('Avaliação iniciada com sucesso!')
            router.refresh() // Atualiza a página para mostrar a avaliação
        } catch (error) {
            console.error('Erro ao iniciar avaliação:', error)
            toast.error('Erro ao iniciar avaliação')
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
            
            <Button 
                onClick={handleIniciarAvaliacao}
                disabled={isCreating}
                size="lg"
                className="min-w-48"
            >
                {isCreating ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando Avaliação...
                    </>
                ) : (
                    <>
                        <Play className="mr-2 h-4 w-4" />
                        Iniciar Avaliação
                    </>
                )}
            </Button>
        </div>
    )
}