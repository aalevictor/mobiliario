'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface ModalImportarExcelProps {
    onImportSuccess?: () => void;
}

export default function ModalImportarExcel({ onImportSuccess }: ModalImportarExcelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [resultado, setResultado] = useState<{
        sucesso: number;
        erro: number;
        mensagens: string[];
    } | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Verificar se é um arquivo Excel
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                           file.type === 'application/vnd.ms-excel' ||
                           file.name.endsWith('.xlsx') ||
                           file.name.endsWith('.xls');
            
            if (!isExcel) {
                toast.error('Por favor, selecione um arquivo Excel (.xlsx ou .xls)');
                return;
            }
            
            setArquivo(file);
            setResultado(null);
        }
    };

    const handleUpload = async () => {
        if (!arquivo) {
            toast.error('Por favor, selecione um arquivo');
            return;
        }

        setIsUploading(true);
        
        try {
            const formData = new FormData();
            formData.append('arquivo', arquivo);

            const response = await fetch('/api/cadastro/importar-avaliacoes', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setResultado({
                    sucesso: data.sucesso || 0,
                    erro: data.erro || 0,
                    mensagens: data.mensagens || []
                });
                
                if (data.sucesso > 0) {
                    toast.success(`${data.sucesso} avaliações importadas com sucesso!`);
                    onImportSuccess?.();
                }
                
                if (data.erro > 0) {
                    toast.warning(`${data.erro} registros com erro`);
                }
            } else {
                toast.error(data.message || 'Erro ao importar arquivo');
            }
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            toast.error('Erro ao processar arquivo');
        } finally {
            setIsUploading(false);
        }
    };

    const resetModal = () => {
        setArquivo(null);
        setResultado(null);
        setIsUploading(false);
    };

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(resetModal, 300); // Aguarda a animação do modal fechar
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    Importar Avaliações Excel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5" />
                        Importar Avaliações do Excel
                    </DialogTitle>
                    <DialogDescription>
                        Faça upload de um arquivo Excel com as avaliações das licitadoras.
                        <br />
                        <strong>Formato esperado:</strong>
                        <br />
                        • Coluna A: Protocolo
                        <br />
                        • Coluna B: Status (DEFERIDA/INDEFERIDA)
                        <br />
                        • Coluna C: Motivo/Parecer
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="arquivo">Arquivo Excel</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="arquivo"
                                type="file"
                                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                onChange={handleFileChange}
                                disabled={isUploading}
                            />
                        </div>
                        {arquivo && (
                            <p className="text-sm text-muted-foreground">
                                Arquivo selecionado: {arquivo.name}
                            </p>
                        )}
                    </div>

                    {resultado && (
                        <div className="space-y-2">
                            {resultado.sucesso > 0 && (
                                <Alert>
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {resultado.sucesso} avaliações importadas com sucesso
                                    </AlertDescription>
                                </Alert>
                            )}
                            
                            {resultado.erro > 0 && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {resultado.erro} registros com erro
                                    </AlertDescription>
                                </Alert>
                            )}
                            
                            {resultado.mensagens.length > 0 && (
                                <div className="max-h-32 overflow-y-auto space-y-1">
                                    {resultado.mensagens.map((msg, index) => (
                                        <p key={index} className="text-sm text-muted-foreground">
                                            {msg}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose} disabled={isUploading}>
                        {resultado ? 'Fechar' : 'Cancelar'}
                    </Button>
                    {!resultado && (
                        <Button 
                            onClick={handleUpload} 
                            disabled={!arquivo || isUploading}
                            className="gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processando...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    Importar
                                </>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}