"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Eye, Loader2, ExternalLink, Download, X } from "lucide-react"
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
            
            const contentType = response.headers.get('content-type')
            if (contentType?.includes('application/json')) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Resposta inesperada do servidor')
            }
            
            const blob = await response.blob()
            
            if (blob.size === 0) {
                throw new Error('Arquivo vazio ou corrompido')
            }
            
            const isPDF = blob.type === 'application/pdf' || nomeArquivo.toLowerCase().endsWith('.pdf')
            
            if (!isPDF) {
                toast.error('Este arquivo não é um PDF e não pode ser visualizado')
                return
            }
            
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

    const openInNewTab = () => {
        if (pdfUrl) {
            const win = window.open(pdfUrl, '_blank')
            if (!win) toast.error('Bloqueado pelo navegador. Permita pop-ups.')
        }
    }

    const downloadPdf = () => {
        if (pdfUrl) {
            const a = document.createElement('a')
            a.href = pdfUrl
            a.download = nomeArquivo || 'arquivo.pdf'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
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
            <DialogContent className="max-w-none sm:!w-[90vw] !w-[96vw] sm:h-[90vh] h-[92vh] p-0" showCloseButton={false}>
                <DialogHeader className="p-4 pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-0">
                        <DialogTitle className="flex-1 min-w-0 text-sm sm:text-lg font-semibold break-all sm:truncate" title={nomeArquivo}>
                            Visualizar: {nomeArquivo}
                        </DialogTitle>
                        <div className="flex flex-wrap gap-2 sm:justify-end shrink-0">
                            <Button variant="outline" size="sm" onClick={openInNewTab} disabled={!pdfUrl} title="Abrir em nova guia">
                                <ExternalLink className="h-4 w-4" />
                                <span className="hidden sm:inline ml-1">Abrir</span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={downloadPdf} disabled={!pdfUrl} title="Baixar PDF">
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline ml-1">Baixar</span>
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline" size="sm" title="Fechar">
                                    <X className="h-4 w-4" />
                                    <span className="hidden sm:inline ml-1">Fechar</span>
                                </Button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogHeader>
                <div className="flex-1 p-4 pt-2">
                    {pdfUrl && (
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full border-0 rounded-md"
                            title={`Visualizar ${nomeArquivo}`}
                            style={{ minHeight: '80vh' }}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}