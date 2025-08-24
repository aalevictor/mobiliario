'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, Filter } from 'lucide-react';

interface LogsFiltersProps {
  filters: {
    tipo: string;
    nivel: string;
    usuario: string;
    tabela: string;
    dataInicio: string;
    dataFim: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  hideNivelFilter?: boolean;
}

export function LogsFilters({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  hideNivelFilter = false 
}: LogsFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Tipo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select value={filters.tipo} onValueChange={(value) => onFilterChange('tipo', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os tipos</SelectItem>
                <SelectItem value="DATABASE_OPERATION">Banco de Dados</SelectItem>
                <SelectItem value="ERROR">Erros</SelectItem>
                <SelectItem value="AUTH">Autenticação</SelectItem>
                <SelectItem value="API_REQUEST">Requisições API</SelectItem>
                <SelectItem value="SYSTEM">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nível */}
          {!hideNivelFilter && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Nível</label>
              <Select value={filters.nivel} onValueChange={(value) => onFilterChange('nivel', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os níveis</SelectItem>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="ERROR">Error</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Usuário */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Usuário</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar usuário..."
                value={filters.usuario}
                onChange={(e) => onFilterChange('usuario', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Tabela */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tabela/Endpoint</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar tabela..."
                value={filters.tabela}
                onChange={(e) => onFilterChange('tabela', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Data Início */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Início</label>
            <Input
              type="datetime-local"
              value={filters.dataInicio}
              onChange={(e) => onFilterChange('dataInicio', e.target.value)}
            />
          </div>

          {/* Data Fim */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Fim</label>
            <Input
              type="datetime-local"
              value={filters.dataFim}
              onChange={(e) => onFilterChange('dataFim', e.target.value)}
            />
          </div>
        </div>

        {/* Botão de limpar filtros */}
        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* Filtros rápidos */}
        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium">Filtros Rápidos</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onFilterChange('nivel', 'CRITICAL');
                onFilterChange('dataInicio', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
              }}
            >
              Erros Críticos (24h)
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onFilterChange('tipo', 'ERROR');
                onFilterChange('dataInicio', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
              }}
            >
              Erros (24h)
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onFilterChange('tipo', 'DATABASE_OPERATION');
                onFilterChange('dataInicio', new Date(Date.now() - 60 * 60 * 1000).toISOString().slice(0, 16));
              }}
            >
              BD Ops (1h)
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onFilterChange('tipo', 'AUTH');
                onFilterChange('dataInicio', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
              }}
            >
              Auth (24h)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
