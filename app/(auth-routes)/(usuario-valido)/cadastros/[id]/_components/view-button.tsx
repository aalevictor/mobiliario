"use client"

import { Button } from "@/components/ui/button"
import { Eye, Loader2, ViewIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface ViewButtonProps {
    cadastroId: number
    arquivoId: string
    nomeArquivo: string
    className?: string
}

export default function ViewButton({ cadastroId, arquivoId, nomeArquivo, className }: ViewButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleView = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/cadastro/${cadastroId}/arquivos/${arquivoId}`)
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
                throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`)
            }
            
            // Verificar se a resposta é realmente um arquivo
            const contentType = response.headers.get('content-type')
            if (contentType?.includes('application/json')) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Resposta inesperada do servidor')
            }
            
            // Criar um blob com o conteúdo do arquivo
            const blob = await response.blob()
            
            if (blob.size === 0) {
                throw new Error('Arquivo vazio ou corrompido')
            }
            
            // Verificar se é um PDF
            const isPDF = blob.type === 'application/pdf' || nomeArquivo.toLowerCase().endsWith('.pdf')
            
            if (!isPDF) {
                toast.error('Este arquivo não é um PDF e não pode ser visualizado')
                return
            }
            
            // Criar URL temporária para o blob
            const url = window.URL.createObjectURL(blob)
            
            // Abrir em nova aba
            const newWindow = window.open(url, '_blank')
            
            if (!newWindow) {
                toast.error('Não foi possível abrir o arquivo. Verifique se o bloqueador de pop-ups está desabilitado.')
                window.URL.revokeObjectURL(url)
                return
            }
            
            // Limpar URL após um tempo (para dar tempo do navegador carregar)
            setTimeout(() => {
                window.URL.revokeObjectURL(url)
            }, 1000)
            
            toast.success('PDF aberto em nova aba!')
            
        } catch (error) {
            console.error('Erro ao visualizar arquivo:', error)
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
            toast.error(`Erro ao visualizar arquivo: ${errorMessage}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleView}
            disabled={isLoading}
            className={className}
            title="Visualizar PDF em nova aba"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <ViewIcon className="h-4 w-4" />
            )}
        </Button>
    )
}