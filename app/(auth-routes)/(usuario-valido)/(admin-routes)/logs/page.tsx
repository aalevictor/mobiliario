"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Search, Trash2, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ILog, ILogsPaginados } from "@/services/logs";
import { toast } from "sonner";
import { NivelLog } from "@prisma/client";

export default function LogsPage() {
  const [logs, setLogs] = useState<ILog[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [limite] = useState(20);
  const [filtros, setFiltros] = useState({
    acao: "",
    entidade: "",
    nivel: "",
    dataInicio: "",
    dataFim: "",
    busca: "",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [logSelecionado, setLogSelecionado] = useState<ILog | null>(null);
  const [showLimparDialog, setShowLimparDialog] = useState(false);
  const [diasLimpeza, setDiasLimpeza] = useState(90);

  const niveisLog: { value: NivelLog; label: string; color: string }[] = [
    { value: "DEBUG", label: "Debug", color: "bg-gray-500" },
    { value: "INFO", label: "Info", color: "bg-blue-500" },
    { value: "WARNING", label: "Aviso", color: "bg-yellow-500" },
    { value: "ERROR", label: "Erro", color: "bg-red-500" },
    { value: "CRITICAL", label: "Crítico", color: "bg-red-700" },
  ];

  const acoes = ["CREATE", "UPDATE", "DELETE", "LOGIN", "ERROR", "CLEANUP"];

  const buscarLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        pagina: pagina.toString(),
        limite: limite.toString(),
        ...filtros,
      });

      const response = await fetch(`/api/logs?${params}`);
      if (!response.ok) throw new Error("Erro ao buscar logs");

      const data: ILogsPaginados = await response.json();
      setLogs(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      toast.error("Erro ao carregar logs");
    } finally {
      setLoading(false);
    }
  };

  const limparLogs = async () => {
    try {
      const response = await fetch("/api/logs/limpar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dias: diasLimpeza }),
      });

      if (!response.ok) throw new Error("Erro ao limpar logs");

      const data = await response.json();
      toast.success(data.mensagem);
      setShowLimparDialog(false);
      buscarLogs();
    } catch (error) {
      console.error("Erro ao limpar logs:", error);
      toast.error("Erro ao limpar logs");
    }
  };

  const exportarLogs = () => {
    const csvContent = [
      ["ID", "Ação", "Entidade", "Entidade ID", "Mensagem", "Nível", "Usuário", "IP", "Data"],
      ...logs.map(log => [
        log.id,
        log.acao,
        log.entidade,
        log.entidadeId || "",
        log.mensagem,
        log.nivel,
        log.usuario?.nome || "",
        log.ip || "",
        format(new Date(log.criadoEm), "dd/MM/yyyy HH:mm:ss", { locale: ptBR }),
      ]),
    ].map(row => row.map(field => `"${field}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `logs_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  };

  useEffect(() => {
    buscarLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, filtros]);

  const aplicarFiltros = () => {
    setPagina(1);
    buscarLogs();
  };

  const limparFiltros = () => {
    setFiltros({
      acao: "",
      entidade: "",
      nivel: "",
      dataInicio: "",
      dataFim: "",
      busca: "",
    });
    setPagina(1);
  };

  const getNivelColor = (nivel: NivelLog) => {
    return niveisLog.find(n => n.value === nivel)?.color || "bg-gray-500";
  };

  const getNivelLabel = (nivel: NivelLog) => {
    return niveisLog.find(n => n.value === nivel)?.label || nivel;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sistema de Logs</h1>
        <div className="flex gap-2">
          <Button onClick={exportarLogs} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Dialog open={showLimparDialog} onOpenChange={setShowLimparDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Logs Antigos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Limpar Logs Antigos</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dias">Dias para manter:</Label>
                  <Input
                    id="dias"
                    type="number"
                    value={diasLimpeza}
                    onChange={(e) => setDiasLimpeza(parseInt(e.target.value))}
                    min="1"
                    max="365"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Logs mais antigos que {diasLimpeza} dias serão removidos permanentemente.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowLimparDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={limparLogs} variant="destructive">
                    Confirmar Limpeza
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="busca">Busca Geral</Label>
              <Input
                id="busca"
                placeholder="Buscar em mensagens, entidades..."
                value={filtros.busca}
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="acao">Ação</Label>
              <Select value={filtros.acao} onValueChange={(value) => setFiltros({ ...filtros, acao: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Todas</SelectItem>
                  {acoes.map(acao => (
                    <SelectItem key={acao} value={acao}>{acao}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="entidade">Entidade</Label>
              <Input
                id="entidade"
                placeholder="Nome da entidade"
                value={filtros.entidade}
                onChange={(e) => setFiltros({ ...filtros, entidade: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="nivel">Nível</Label>
              <Select value={filtros.nivel} onValueChange={(value) => setFiltros({ ...filtros, nivel: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Todos</SelectItem>
                  {niveisLog.map(nivel => (
                    <SelectItem key={nivel.value} value={nivel.value}>{nivel.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={aplicarFiltros}>
              <Search className="w-4 h-4 mr-2" />
              Aplicar Filtros
            </Button>
            <Button onClick={limparFiltros} variant="outline">
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Logs */}
      <Card>
        <CardHeader>
          <CardTitle>
            Logs ({total} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando logs...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum log encontrado com os filtros aplicados.
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Badge className={getNivelColor(log.nivel)}>
                        {getNivelLabel(log.nivel)}
                      </Badge>
                      <Badge variant="outline">{log.acao}</Badge>
                      <Badge variant="secondary">{log.entidade}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLogSelecionado(log)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Log</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-semibold">ID:</Label>
                                <p className="text-sm">{log.id}</p>
                              </div>
                              <div>
                                <Label className="font-semibold">Data:</Label>
                                <p className="text-sm">
                                  {format(new Date(log.criadoEm), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                                </p>
                              </div>
                              <div>
                                <Label className="font-semibold">Ação:</Label>
                                <p className="text-sm">{log.acao}</p>
                              </div>
                              <div>
                                <Label className="font-semibold">Entidade:</Label>
                                <p className="text-sm">{log.entidade}</p>
                              </div>
                              <div>
                                <Label className="font-semibold">Nível:</Label>
                                <Badge className={getNivelColor(log.nivel)}>
                                  {getNivelLabel(log.nivel)}
                                </Badge>
                              </div>
                              <div>
                                <Label className="font-semibold">Usuário:</Label>
                                <p className="text-sm">{log.usuario?.nome || "Sistema"}</p>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <Label className="font-semibold">Mensagem:</Label>
                              <p className="text-sm bg-muted p-2 rounded">{log.mensagem}</p>
                            </div>
                            
                            {log.erro && (
                              <>
                                <Separator />
                                <div>
                                  <Label className="font-semibold text-red-600">Erro:</Label>
                                  <p className="text-sm bg-red-50 p-2 rounded text-red-700">{log.erro}</p>
                                </div>
                              </>
                            )}
                            
                            {log.dadosAntes && (
                              <>
                                <Separator />
                                <div>
                                  <Label className="font-semibold">Dados Antes:</Label>
                                  <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                                    {JSON.stringify(log.dadosAntes, null, 2)}
                                  </pre>
                                </div>
                              </>
                            )}
                            
                            {log.dadosDepois && (
                              <>
                                <Separator />
                                <div>
                                  <Label className="font-semibold">Dados Depois:</Label>
                                  <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                                    {JSON.stringify(log.dadosDepois, null, 2)}
                                  </pre>
                                </div>
                              </>
                            )}
                            
                            {log.ip && (
                              <>
                                <Separator />
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="font-semibold">IP:</Label>
                                    <p className="text-sm">{log.ip}</p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">User Agent:</Label>
                                    <p className="text-sm text-xs break-all">{log.userAgent}</p>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm">{log.mensagem}</p>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>
                      {log.usuario?.nome ? `Por: ${log.usuario.nome}` : "Sistema"}
                    </span>
                    <span>
                      {format(new Date(log.criadoEm), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Paginação */}
          {total > limite && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagina(pagina - 1)}
                disabled={pagina === 1}
              >
                Anterior
              </Button>
              <span className="text-sm">
                Página {pagina} de {Math.ceil(total / limite)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagina(pagina + 1)}
                disabled={pagina >= Math.ceil(total / limite)}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
