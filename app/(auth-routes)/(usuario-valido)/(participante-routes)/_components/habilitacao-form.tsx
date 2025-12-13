"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ICadastro } from "../../cadastros/page"
import { useState, useTransition, useRef } from "react"
import { FileText, Download, Upload, AlertCircle, Loader2 } from "lucide-react"
import DragDropInput, { DragDropInputRef } from "@/components/drag-drop-input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TipoArquivo } from "@prisma/client"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"

interface HabilitacaoFormProps {
  cadastro: ICadastro
  atualizarPagina: (tab: string) => Promise<void>
}

const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 10MB

const uploadSchema = z.object({
  documentos: z.array(z.instanceof(File)).min(1, "Selecione pelo menos um documento")
})

type UploadForm = z.infer<typeof uploadSchema>

export default function HabilitacaoForm({ cadastro, atualizarPagina }: HabilitacaoFormProps) {
  const [isPending, startTransition] = useTransition()
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null)
  const [removingFileId, setRemovingFileId] = useState<string | null>(null)
  const dragDropRef = useRef<DragDropInputRef>(null)

  // Filtrar documentos de habilitação (DOC_ESPECIFICA com prefixo HABILITACAO-)
  const documentos = (cadastro.arquivos || []).filter(
    (arquivo) => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA && arquivo.caminho?.split("/").pop()?.startsWith("HABILITACAO-")
  )

  const anoAtual = new Date().getFullYear()
  const dataAberturaHabilitacao = new Date(`${anoAtual}-12-11 00:00:00`)
  const dataLimiteHabilitacao = new Date(`${anoAtual}-12-13 05:30:00`)
  const dataAtual = new Date()
  const podeEnviarHabilitacao = dataAtual >= dataAberturaHabilitacao && dataAtual <= dataLimiteHabilitacao

  // Calcular tamanho total dos documentos existentes
  const tamanhoTotalExistente = documentos.reduce((total, doc) => {
    return total + (doc.tamanho || 0)
  }, 0)

  const espacoDisponivel = MAX_TOTAL_SIZE - tamanhoTotalExistente

  const form = useForm<UploadForm>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      documentos: []
    }
  })

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB"
  }

  const onSubmit = (data: UploadForm) => {
    if (!podeEnviarHabilitacao) {
      toast.error("Não é possível enviar documentos fora do período de habilitação.")
      return
    }
    startTransition(async () => {
      try {
        const formData = new FormData()

        data.documentos.forEach((file) => {
          formData.append("documentos", file)
        })

        formData.append("tipo", TipoArquivo.DOC_ESPECIFICA)
        formData.append("cadastroId", cadastro.id?.toString() || "")

        const response = await fetch(`/api/cadastro/${cadastro.id}/habilitacao`, {
          method: "POST",
          body: formData
        })

        if (response.ok) {
          toast.success("Documentos de habilitação enviados com sucesso!")
          form.reset()
          dragDropRef.current?.reset()
          await atualizarPagina("documentos-habilitacao")
        } else {
          const errorData = await response.json().catch(() => ({}))
          toast.error(errorData.error || "Erro ao enviar documentos. Tente novamente.")
        }
      } catch (error) {
        console.error("Erro ao enviar documentos de habilitação:", error)
        toast.error("Erro ao enviar documentos. Tente novamente.")
      }
    })
  }

  const downloadDocumento = async (arquivoId: string, nomeArquivo: string) => {
    setDownloadingFileId(arquivoId)
    try {
      const response = await fetch(`/api/cadastro/${cadastro.id}/arquivos/${arquivoId}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erro desconhecido" }))
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Resposta inesperada do servidor")
      }

      const blob = await response.blob()
      if (blob.size === 0) throw new Error("Arquivo vazio ou corrompido")

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = nomeArquivo
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Download iniciado com sucesso!")
    } catch (error) {
      console.error("Erro ao fazer download:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      toast.error(`Erro ao fazer download: ${errorMessage}`)
    } finally {
      setDownloadingFileId(null)
    }
  }

  const removerDocumento = async (arquivoId: string, nomeArquivo: string) => {
    if (!podeEnviarHabilitacao) {
      toast.error("Remoção permitida apenas durante o período de habilitação.")
      return
    }
    const confirmar = window.confirm(`Remover o documento "${nomeArquivo}"? Esta ação não pode ser desfeita.`)
    if (!confirmar) return
    setRemovingFileId(arquivoId)
    try {
      const response = await fetch(`/api/cadastro/${cadastro.id}/arquivos/${arquivoId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erro desconhecido" }))
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`)
      }

      toast.success("Documento removido com sucesso!")
      await atualizarPagina("documentos-habilitacao")
    } catch (error) {
      console.error("Erro ao remover documento:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      toast.error(`Erro ao remover documento: ${errorMessage}`)
    } finally {
      setRemovingFileId(null)
    }
  }

  const handleFileChange = (files: File[]) => {
    const tamanhoNovosArquivos = files.reduce((total, file) => total + file.size, 0)
    if (tamanhoTotalExistente + tamanhoNovosArquivos > MAX_TOTAL_SIZE) {
      toast.error(`O tamanho total dos arquivos não pode exceder ${formatFileSize(MAX_TOTAL_SIZE)}`)
      return
    }
    form.setValue("documentos", files)
  }

  return (
    <div className="space-y-6">
      {/* Lista de Documentos Existentes */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos de Habilitação Enviados
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Lista de documentos enviados para habilitação.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {documentos.length > 0 ? (
            <div className="space-y-3">
              {documentos.map((documento) => (
                <div key={documento.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium break-all">{documento.caminho?.split("/").pop() || "Documento"}</p>
                      <p className="text-sm text-gray-600">Tamanho: {formatFileSize(documento.tamanho || 0)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => documento.id && downloadDocumento(documento.id, documento.caminho?.split("/").pop() || "documento.pdf")}
                      disabled={downloadingFileId === documento.id}
                      className="text-xs sm:text-sm"
                    >
                      {downloadingFileId === documento.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Baixando...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                    {podeEnviarHabilitacao && (
                      <Button
                        variant="destructive"
                        onClick={() => documento.id && removerDocumento(documento.id, documento.caminho?.split("/").pop() || "documento.pdf")}
                        disabled={removingFileId === documento.id}
                        className="text-xs sm:text-sm"
                      >
                        {removingFileId === documento.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Removendo...
                          </>
                        ) : (
                          <>Remover</>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              <p>Nenhum documento de habilitação enviado</p>
              {podeEnviarHabilitacao && <p className="text-sm">Utilize o formulário abaixo para enviar seus documentos</p>}
            </div>
          )}
        </CardContent>

        {/* Formulário de Upload */}
        {espacoDisponivel > 0 && podeEnviarHabilitacao && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="px-4 sm:px-6 gap-4">
                <Separator />
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Enviar Documentos de Habilitação
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  <p>Envie os documentos de habilitação (formato PDF) relacionados no item 9 do Edital nº 005/SP-URB/2025, em atenção ao item 14.4.2 e o <strong>TERMO DE COMPROMISSO DE EXECUÇÃO DOS PROTÓTIPOS PROJETOS EM NÍVEL BÁSICO</strong>, conforme modelo constante do ANEXO VI do Edital, em atenção ao item 14.4.2. </p>
                  <p className="text-xs">Limite máximo total: {formatFileSize(MAX_TOTAL_SIZE)}</p>
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 space-y-4">
                {espacoDisponivel < MAX_TOTAL_SIZE * 0.1 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Atenção: Pouco espaço disponível ({formatFileSize(espacoDisponivel)}).
                      Considere remover alguns documentos antes de enviar novos.
                    </AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="documentos"
                  render={({ field }) => (
                    <FormItem className="w-full mt-4">
                      <FormLabel>Documentos de Habilitação</FormLabel>
                      <FormControl>
                        <DragDropInput
                          ref={dragDropRef}
                          accept=".pdf"
                          multiple={true}
                          maxSize={espacoDisponivel}
                          buttonText="Selecionar documentos"
                          dropzoneText="Arraste e solte seus documentos PDF aqui"
                          helperText="Formatos aceitos: PDF"
                          onChange={handleFileChange}
                          disabled={isPending}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="px-4 sm:px-6 mt-4 flex justify-end">
                <Button type="submit" disabled={isPending || !form.watch("documentos")?.length} className="w-full sm:w-auto">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Enviar Documentos
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </Card>

      {espacoDisponivel <= 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Limite de {formatFileSize(MAX_TOTAL_SIZE)} atingido. Remova documentos para liberar espaço.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}