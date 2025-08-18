"use client"

import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface DownloadButtonProps {
    cadastroId: number
    arquivoId: string
    nomeArquivo: string
    className?: string
}

export default function DownloadButton({ cadastroId, arquivoId, nomeArquivo, className }: DownloadButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false)

    const handleDownload = async () => {
        setIsDownloading(true)
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
            
            // Criar URL temporária para o blob
            const url = window.URL.createObjectURL(blob)
            
            // Criar elemento <a> temporário para download
            const a = document.createElement('a')
            a.href = url
            a.download = nomeArquivo
            document.body.appendChild(a)
            a.click()
            
            // Limpar recursos
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            
            toast.success('Download iniciado com sucesso!')
            
        } catch (error) {
            console.error('Erro ao fazer download:', error)
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
            toast.error(`Erro ao fazer download: ${errorMessage}`)
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className={className}
        >
            {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Download className="h-4 w-4" />
            )}
        </Button>
    )
}
