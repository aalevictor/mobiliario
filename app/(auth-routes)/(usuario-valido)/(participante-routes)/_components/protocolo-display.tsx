"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Copy, FileText, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ProtocoloDisplayProps {
    protocolo: string;
}

export default function ProtocoloDisplay({ protocolo }: ProtocoloDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(protocolo);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Erro ao copiar protocolo:', error);
        }
    };

    return (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md">
            <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Protocolo do Cadastro</p>
                            <p className="text-2xl font-bold text-blue-900">{protocolo}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Cadastrado
                        </Badge>
                        <button 
                            onClick={handleCopy}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors relative"
                            title={copied ? "Copiado!" : "Copiar protocolo"}
                        >
                            <Copy className="h-5 w-5 text-blue-600" />
                            {copied && (
                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                    Copiado!
                                </span>
                            )}
                        </button>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                        <span className="font-semibold">Importante:</span> Guarde este protocolo para acompanhar o status do seu cadastro e para futuras consultas.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
