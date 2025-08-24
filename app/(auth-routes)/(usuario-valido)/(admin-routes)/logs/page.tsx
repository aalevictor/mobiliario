'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, AlertCircle, XCircle, RefreshCw, Download } from 'lucide-react';
import DataTable from '@/components/data-table';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LogsColumns } from './_components/logs-columns';
import { LogsStats } from './_components/logs-stats';
import { LogsFilters } from './_components/logs-filters';
import Pagination from '@/components/pagination';
import { User } from 'next-auth';

interface LogEntry {
  id: string;
  tipo: string;
  nivel: string;
  operacao?: string;
  tabela?: string;
  registroId?: string;
  usuario?: string;
  ip?: string;
  erro?: string;
  endpoint?: string;
  metodo?: string;
  duracao?: number;
  emailEnviado: boolean;
  criadoEm: string;
}

interface LogsResponse {
  logs: LogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface LogsStats {
  totalLogs: number;
  logsHoje: number;
  logsOntem: number;
  logsSemana: number;
  errosCriticos: number;
  erroresPorTipo: Array<{
    tipo: string;
    nivel: string;
    _count: { id: number };
  }>;
}

export default function LogsPage() {
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    tipo: '',
    nivel: '',
    usuario: '',
    tabela: '',
    dataInicio: '',
    dataFim: '',
  });

  const { data: stats, refetch: refetchStats } = useQuery<LogsStats>({
    queryKey: ['logs-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/logs/stats');
      if (!response.ok) throw new Error('Erro ao carregar estatísticas');
      return response.json();
    },
  });

  const { data: logsData, refetch: refetchLogs, isLoading } = useQuery<LogsResponse>({
    queryKey: ['logs', currentPage, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
      });

      const response = await fetch(`/api/admin/logs?${params}`);
      if (!response.ok) throw new Error('Erro ao carregar logs');
      return response.json();
    },
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      tipo: '',
      nivel: '',
      usuario: '',
      tabela: '',
      dataInicio: '',
      dataFim: '',
    });
    setCurrentPage(1);
  };

  const exportLogs = async () => {
    try {
      const params = new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
        limit: '1000', // Limite maior para export
      });

      const response = await fetch(`/api/admin/logs/export?${params}`);
      if (!response.ok) throw new Error('Erro ao exportar logs');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Logs exportados com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar logs');
    }
  };

  const getLevelIcon = (nivel: string) => {
    switch (nivel) {
      case 'INFO':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'ERROR':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'CRITICAL':
        return <XCircle className="h-4 w-4 text-red-700" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLevelBadge = (nivel: string) => {
    //eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const variants: Record<string, any> = {
      INFO: 'default',
      WARNING: 'secondary',
      ERROR: 'destructive',
      CRITICAL: 'destructive',
    };

    return (
      <Badge variant={variants[nivel] || 'default'} className="flex items-center gap-1">
        {getLevelIcon(nivel)}
        {nivel}
      </Badge>
    );
  };

  // Verificar permissão após todos os hooks
  if (status === 'loading') {
    return <div className="flex items-center justify-center h-96">Carregando...</div>;
  }

  if (!session?.user || (session.user as User).permissao !== 'DEV') {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Apenas usuários com permissão DEV podem acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Logs de Auditoria</h1>
          <p className="text-gray-600">
            Monitoramento e auditoria de operações do sistema
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              refetchStats();
              refetchLogs();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          
          <Button onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="errors">Erros Críticos</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <LogsStats stats={stats} />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <LogsFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Logs</CardTitle>
              <CardDescription>
                {logsData?.total ? `${logsData.total} logs encontrados` : 'Carregando...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <>
                  <DataTable
                    columns={LogsColumns}
                    data={logsData?.logs || []}
                  />
                  {logsData && logsData.totalPages > 1 && (
                    <Pagination
                      total={logsData.total}
                      pagina={currentPage}
                      limite={50}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Erros Críticos</CardTitle>
              <CardDescription>
                Erros que requerem atenção imediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtrar apenas erros críticos */}
              <LogsFilters 
                filters={{ ...filters, nivel: 'CRITICAL' }} 
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                hideNivelFilter
              />
              
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <>
                  <DataTable
                    columns={LogsColumns}
                    data={logsData?.logs.filter(log => log.nivel === 'CRITICAL') || []}
                  />
                  {logsData && logsData.totalPages > 1 && (
                    <Pagination
                      total={logsData.total}
                      pagina={currentPage}
                      limite={50}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
