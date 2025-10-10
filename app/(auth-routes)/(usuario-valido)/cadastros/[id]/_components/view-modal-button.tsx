"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface ViewModalButtonProps {
    cadastroId: number
    arquivoId: string
    nomeArquivo: string
    className?: string
    tipo?: string
}

export default function ViewModalButton({ cadastroId, arquivoId, nomeArquivo, className, tipo = 'arquivos' }: ViewModalButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const handleView = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/cadastro/${cadastroId}/${tipo}/${arquivoId}`)
            
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
            setPdfUrl(url)
            setIsOpen(true)
            
            toast.success('PDF carregado com sucesso!')
            
        } catch (error) {
            console.error('Erro ao visualizar arquivo:', error)
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
            toast.error(`Erro ao visualizar arquivo: ${errorMessage}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        if (pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl)
            setPdfUrl(null)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                handleClose()
            }
        }}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleView}
                    disabled={isLoading}
                    className={className}
                    title="Visualizar PDF em popup"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-none !w-[90vw] h-[95vh] p-0">
                <DialogHeader className="p-4 pb-0">
                    <DialogTitle className="text-lg font-semibold">
                        Visualizar: {nomeArquivo}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 p-4 pt-2">
                    {pdfUrl && (
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full border-0 rounded-md"
                            title={`Visualizar ${nomeArquivo}`}
                            style={{ minHeight: '85vh' }}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}