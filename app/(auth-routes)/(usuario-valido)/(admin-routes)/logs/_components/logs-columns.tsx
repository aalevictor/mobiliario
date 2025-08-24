'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Info, AlertTriangle, AlertCircle, XCircle, Eye, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

const getTipoBadge = (tipo: string) => {
  const colors: Record<string, string> = {
    DATABASE_OPERATION: 'bg-blue-100 text-blue-800',
    ERROR: 'bg-red-100 text-red-800',
    AUTH: 'bg-green-100 text-green-800',
    API_REQUEST: 'bg-purple-100 text-purple-800',
    SYSTEM: 'bg-gray-100 text-gray-800',
  };

  return (
    <Badge className={colors[tipo] || 'bg-gray-100 text-gray-800'}>
      {tipo.replace('_', ' ')}
    </Badge>
  );
};

const LogDetails = ({ log }: { log: LogEntry }) => (
  <div className="space-y-4 max-w-2xl">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold mb-2">Informações Básicas</h4>
        <div className="space-y-2 text-sm">
          <div><strong>ID:</strong> {log.id}</div>
          <div><strong>Tipo:</strong> {getTipoBadge(log.tipo)}</div>
          <div><strong>Nível:</strong> {getLevelBadge(log.nivel)}</div>
          <div><strong>Data:</strong> {new Date(log.criadoEm).toLocaleString('pt-BR')}</div>
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">Contexto</h4>
        <div className="space-y-2 text-sm">
          {log.usuario && <div><strong>Usuário:</strong> {log.usuario}</div>}
          {log.ip && <div><strong>IP:</strong> {log.ip}</div>}
          {log.duracao && <div><strong>Duração:</strong> {log.duracao}ms</div>}
          {log.emailEnviado && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>Email enviado</span>
            </div>
          )}
        </div>
      </div>
    </div>

    {(log.operacao || log.tabela || log.registroId) && (
      <div>
        <h4 className="font-semibold mb-2">Operação no Banco</h4>
        <div className="space-y-2 text-sm">
          {log.operacao && <div><strong>Operação:</strong> {log.operacao}</div>}
          {log.tabela && <div><strong>Tabela:</strong> {log.tabela}</div>}
          {log.registroId && <div><strong>ID do Registro:</strong> {log.registroId}</div>}
        </div>
      </div>
    )}

    {(log.endpoint || log.metodo) && (
      <div>
        <h4 className="font-semibold mb-2">Requisição HTTP</h4>
        <div className="space-y-2 text-sm">
          {log.metodo && <div><strong>Método:</strong> <Badge variant="outline">{log.metodo}</Badge></div>}
          {log.endpoint && <div><strong>Endpoint:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{log.endpoint}</code></div>}
        </div>
      </div>
    )}

    {log.erro && (
      <div>
        <h4 className="font-semibold mb-2 text-red-600">Erro</h4>
        <pre className="bg-red-50 p-3 rounded border text-sm overflow-x-auto whitespace-pre-wrap">
          {log.erro}
        </pre>
      </div>
    )}
  </div>
);

export const LogsColumns: ColumnDef<LogEntry>[] = [
  {
    accessorKey: 'criadoEm',
    header: 'Data/Hora',
    cell: ({ row }) => {
      const date = new Date(row.getValue('criadoEm'));
      return (
        <div className="text-sm">
          <div>{date.toLocaleDateString('pt-BR')}</div>
          <div className="text-gray-500 text-xs">
            {date.toLocaleTimeString('pt-BR')}
          </div>
          <div className="text-gray-400 text-xs">
            {formatDistanceToNow(date, { addSuffix: true, locale: ptBR })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'nivel',
    header: 'Nível',
    cell: ({ row }) => getLevelBadge(row.getValue('nivel')),
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
    cell: ({ row }) => getTipoBadge(row.getValue('tipo')),
  },
  {
    accessorKey: 'operacao',
    header: 'Operação',
    cell: ({ row }) => {
      const operacao = row.getValue('operacao') as string;
      const metodo = row.original.metodo;
      
      if (metodo) {
        return <Badge variant="outline">{metodo}</Badge>;
      }
      
      if (operacao) {
        return <Badge variant="secondary">{operacao}</Badge>;
      }
      
      return <span className="text-gray-400">-</span>;
    },
  },
  {
    accessorKey: 'tabela',
    header: 'Tabela/Endpoint',
    cell: ({ row }) => {
      const tabela = row.getValue('tabela') as string;
      const endpoint = row.original.endpoint;
      
      const value = endpoint || tabela;
      
      if (!value) return <span className="text-gray-400">-</span>;
      
      return (
        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
          {value.length > 30 ? `${value.substring(0, 30)}...` : value}
        </code>
      );
    },
  },
  {
    accessorKey: 'usuario',
    header: 'Usuário',
    cell: ({ row }) => {
      const usuario = row.getValue('usuario') as string;
      return usuario ? (
        <Badge variant="outline">{usuario}</Badge>
      ) : (
        <span className="text-gray-400">Sistema</span>
      );
    },
  },
  {
    accessorKey: 'duracao',
    header: 'Duração',
    cell: ({ row }) => {
      const duracao = row.getValue('duracao') as number;
      if (!duracao) return <span className="text-gray-400">-</span>;
      
      const color = duracao > 1000 ? 'text-red-600' : duracao > 500 ? 'text-yellow-600' : 'text-green-600';
      return <span className={`text-sm ${color}`}>{duracao}ms</span>;
    },
  },
  {
    accessorKey: 'emailEnviado',
    header: 'Email',
    cell: ({ row }) => {
      const emailEnviado = row.getValue('emailEnviado') as boolean;
      const nivel = row.original.nivel;
      
      if (nivel === 'CRITICAL') {
        return emailEnviado ? (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <Mail className="h-3 w-3 mr-1" />
            Enviado
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Falha
          </Badge>
        );
      }
      
      return <span className="text-gray-400">-</span>;
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const log = row.original;
      
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Log</DialogTitle>
            </DialogHeader>
            <LogDetails log={log} />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
