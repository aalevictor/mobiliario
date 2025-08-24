'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Database,
  Shield,
  Globe,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface LogsStatsProps {
  stats?: {
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
  };
}

const COLORS = {
  DATABASE_OPERATION: '#3b82f6',
  ERROR: '#ef4444',
  AUTH: '#10b981',
  API_REQUEST: '#8b5cf6',
  SYSTEM: '#6b7280'
};

const NIVEL_COLORS = {
  INFO: '#3b82f6',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  CRITICAL: '#dc2626'
};

export function LogsStats({ stats }: LogsStatsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Preparar dados para gráficos
  const tipoData = Object.entries(
    stats.erroresPorTipo.reduce((acc, item) => {
      if (!acc[item.tipo]) acc[item.tipo] = 0;
      acc[item.tipo] += item._count.id;
      return acc;
    }, {} as Record<string, number>)
  ).map(([tipo, count]) => ({
    tipo: tipo.replace('_', ' '),
    count,
    color: COLORS[tipo as keyof typeof COLORS] || '#6b7280'
  }));

  const nivelData = Object.entries(
    stats.erroresPorTipo.reduce((acc, item) => {
      if (!acc[item.nivel]) acc[item.nivel] = 0;
      acc[item.nivel] += item._count.id;
      return acc;
    }, {} as Record<string, number>)
  ).map(([nivel, count]) => ({
    nivel,
    count,
    color: NIVEL_COLORS[nivel as keyof typeof NIVEL_COLORS] || '#6b7280'
  }));

  const tendenciaData = [
    { periodo: 'Ontem', logs: stats.logsOntem },
    { periodo: 'Hoje', logs: stats.logsHoje },
  ];

  const getSaude = () => {
    const taxaErro = stats.errosCriticos / Math.max(stats.totalLogs, 1);
    if (taxaErro < 0.01) return { status: 'Excelente', color: 'text-green-600', icon: CheckCircle };
    if (taxaErro < 0.05) return { status: 'Bom', color: 'text-blue-600', icon: Activity };
    if (taxaErro < 0.1) return { status: 'Atenção', color: 'text-yellow-600', icon: AlertTriangle };
    return { status: 'Crítico', color: 'text-red-600', icon: AlertCircle };
  };

  const saude = getSaude();
  const SaudeIcon = saude.icon;

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Logs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLogs.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">
              {stats.logsSemana} na última semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logs Hoje</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.logsHoje}</div>
            <p className="text-xs text-muted-foreground">
              {stats.logsHoje > stats.logsOntem ? '+' : ''}
              {((stats.logsHoje - stats.logsOntem) / Math.max(stats.logsOntem, 1) * 100).toFixed(1)}% vs ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erros Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.errosCriticos}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.errosCriticos / Math.max(stats.totalLogs, 1)) * 100).toFixed(2)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saúde do Sistema</CardTitle>
            <SaudeIcon className={`h-4 w-4 ${saude.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saude.color}`}>{saude.status}</div>
            <p className="text-xs text-muted-foreground">
              Baseado na taxa de erros críticos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tipoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {tipoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [value, 'Logs']}
                  labelFormatter={(label) => `Tipo: ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {tipoData.map((item, index) => (
                <Badge key={index} style={{ backgroundColor: item.color, color: 'white' }}>
                  {item.tipo}: {item.count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Nível</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={nivelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nivel" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="count" 
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tendência */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência Diária</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tendenciaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="logs" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Ícones explicativos */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-500" />
              <span className="text-sm">Database</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-sm">Erros</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-sm">Auth</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-purple-500" />
              <span className="text-sm">API</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-gray-500" />
              <span className="text-sm">Sistema</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
