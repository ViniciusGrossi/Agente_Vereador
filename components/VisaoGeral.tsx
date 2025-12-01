import React, { useState, useMemo } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { COLORS } from '../constants';
import { Card } from './ui/Card';
import { ArrowUpRight, ArrowDownRight, Users, MessageSquare, MapPin, TrendingUp, Calendar, MessageCircle, Filter, Download } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, AreaChart, Area
} from 'recharts';

export const VisaoGeral: React.FC = () => {
  const {
    periodo, setPeriodo,
    canal, setCanal,
    filteredData,
    kpis
  } = useDashboardData();

  // Export to CSV
  const handleExport = () => {
    const headers = ['ID', 'Data', 'Canal', 'Tipo', 'Tema', 'Subtema', 'Bairro', 'Sentimento', 'Nota'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => [
        row.id,
        row.data,
        row.canal,
        row.tipo_interacao,
        row.tema,
        row.subtema,
        row.bairro,
        row.sentimento,
        row.nota_satisfacao
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_demandas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Satisfaction Calculation for display
  const numSatisfaction = parseFloat(kpis.avgSatisfaction);

  // Line Chart Data (Daily) - smoothed
  const dailyData = useMemo(() => {
    const map = filteredData.reduce((acc, curr) => {
      // Just showing Day of week or short date
      const date = new Date(curr.data_hora);
      const key = date.toLocaleDateString('pt-BR', { weekday: 'narrow' });
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Order usually needs real dates, here simplified for mock
    const order = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    // This is a rough approximation for the demo
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Interaction Type Data
  const typeData = useMemo(() => {
    const map = filteredData.reduce((acc, curr) => {
      acc[curr.tipo_interacao] = (acc[curr.tipo_interacao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  return (
    <div className="space-y-6 animate-fade-in max-w-[1600px] mx-auto pb-10">

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-lg border border-border dark:border-slate-700 shadow-sm gap-4">
        <div className="flex gap-2">
          {[
            { label: 'Hoje', val: '1' },
            { label: '7 dias', val: '7' },
            { label: '30 dias', val: '30' },
          ].map((opt) => (
            <button
              key={opt.val}
              onClick={() => setPeriodo(opt.val)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${periodo === opt.val
                ? 'bg-blue-50 dark:bg-blue-900/30 text-primary ring-1 ring-primary'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <select
            value={canal}
            onChange={(e) => setCanal(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-border dark:border-slate-700 rounded-md text-gray-700 dark:text-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
          >
            <option value="Todos">Todos os canais</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Instagram">Instagram</option>
          </select>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
          >
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col justify-between h-36">
          <div className="flex flex-col">
            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">Atendimentos</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-bold text-gray-800 dark:text-white">{kpis.totalAtendimentos}</span>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
            <span className={`text-xs font-semibold px-2 py-1 rounded ${parseFloat(kpis.growth) >= 0 ? 'text-success bg-green-50' : 'text-critical bg-red-50'}`}>
              {parseFloat(kpis.growth) > 0 ? '+' : ''}{kpis.growth}%
            </span>
            <span className="text-xs text-gray-400">vs período anterior</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-36">
          <div className="flex flex-col">
            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">Bairros alcançados</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-bold text-gray-800 dark:text-white">{kpis.uniqueBairros}</span>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
            <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-700 rounded overflow-hidden">
              <div className="h-full bg-purple-500 w-3/4"></div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-36">
          <div className="flex flex-col">
            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">Tema mais falado</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-800 dark:text-white truncate" title={kpis.topTheme.name}>{kpis.topTheme.name}</span>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">{kpis.topTheme.count} ocorrências</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-36">
          <div className="flex flex-col">
            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">Satisfação média</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-4xl font-bold text-gray-800 dark:text-white">{kpis.avgSatisfaction}</span>
              <span className="text-3xl">{numSatisfaction >= 4 ? '😊' : numSatisfaction >= 3 ? '😐' : '☹️'}</span>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700">
            <div className="flex gap-1 h-1.5">
              <div className="flex-1 bg-red-400 rounded-l opacity-20"></div>
              <div className="flex-1 bg-yellow-400 opacity-20"></div>
              <div className="flex-1 bg-green-500 rounded-r"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Atendimentos por dia</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Últimos {periodo} dias</p>
            </div>
            <div className={`font-bold text-lg ${parseFloat(kpis.growth) >= 0 ? 'text-success' : 'text-critical'}`}>
              {parseFloat(kpis.growth) > 0 ? '+' : ''}{kpis.growth}%
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200 dark:stroke-slate-700" />
                <XAxis dataKey="name" className="stroke-gray-400 dark:stroke-gray-500" tick={{ fontSize: 12, fill: 'currentColor' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis className="stroke-gray-400 dark:stroke-gray-500" tick={{ fontSize: 12, fill: 'currentColor' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'var(--tooltip-bg)', color: 'var(--tooltip-text)' }}
                  itemStyle={{ color: COLORS.primary, fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="h-[400px] flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Tipo de interação</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-800 dark:text-white">580</span>
              <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600 font-medium">-1.8%</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Comparado à média anterior</p>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200 dark:stroke-slate-700" />
                <XAxis dataKey="name" className="stroke-gray-400 dark:stroke-gray-500" tick={{ fontSize: 11, fill: 'currentColor' }} axisLine={false} tickLine={false} dy={10} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'var(--tooltip-bg)', color: 'var(--tooltip-text)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 1 ? COLORS.primary : '#93C5FD'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="text-center pt-8 border-t border-border dark:border-slate-700">
        <p className="text-gray-400 text-sm">
          Esta página mostra um resumo geral das mensagens que o gabinete recebeu no período escolhido.
        </p>
      </div>
    </div>
  );
};