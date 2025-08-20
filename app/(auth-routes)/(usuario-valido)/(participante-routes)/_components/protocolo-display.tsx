"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProtocoloDisplayProps {
    protocolo: string;
}

export default function ProtocoloDisplay({ protocolo }: ProtocoloDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(protocolo);
            setCopied(true);
            toast.success("Protocolo copiado para área de transferência");
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Erro ao copiar protocolo:', error);
        }
    };

    return (
        <Card className="w-full max-w-4xl shadow mx-auto">
            <CardContent className="p-6 py-2">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex flex-col gap-1">
                        <p className="px-2 text-sm font-medium text-gray-600 mb-1">Protocolo do Cadastro</p>
                        <Button 
                            onClick={handleCopy}
                            variant="ghost"
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors relative"
                            title={copied ? "Copiado!" : "Copiar protocolo"}
                        >
                            <p className="text-2xl font-bold text-blue-900">{protocolo}</p>
                        </Button>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">
                        <span className="font-semibold">Importante:</span> Guarde este protocolo para acompanhar o status do seu cadastro e para futuras consultas.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
