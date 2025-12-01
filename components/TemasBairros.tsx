import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { MOCK_DATA, COLORS } from '../constants';
import { MapInteractive } from './MapInteractive';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MapPin, Filter } from 'lucide-react';

import { useDashboardData } from '../hooks/useDashboardData';

export const TemasBairros: React.FC = () => {
  const {
    tema: selectedTema, setTema: setSelectedTema,
    bairro: selectedBairro, setBairro: setSelectedBairro,
    filteredData
  } = useDashboardData();

  // Unique lists for filters
  const allTemas = Array.from(new Set(MOCK_DATA.map(d => d.tema))).sort();
  const allBairros = Array.from(new Set(MOCK_DATA.map(d => d.bairro))).sort();

  // Chart Data: Themes
  const temaChartData = useMemo(() => {
    const counts = filteredData.reduce((acc, curr) => {
      acc[curr.tema] = (acc[curr.tema] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => (b.value as number) - (a.value as number))
      .slice(0, 5); // Top 5 for cleaner looker style
  }, [filteredData]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in pb-10">

      {/* Header Section */}
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Temas e Bairros</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Aqui você visualiza a distribuição geográfica das demandas da população por tema e bairro.
        </p>
      </div>

      {/* Control Bar */}
      <Card className="flex flex-wrap gap-4 items-center bg-white dark:bg-slate-800 sticky top-20 z-10">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Filtrar por Tema</label>
          <select
            className="w-full p-2.5 bg-gray-50 dark:bg-slate-900 rounded border border-border dark:border-slate-700 text-gray-700 dark:text-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            value={selectedTema}
            onChange={(e) => setSelectedTema(e.target.value)}
          >
            <option value="Todos">Todos os temas</option>
            {allTemas.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Filtrar por Bairro</label>
          <select
            className="w-full p-2.5 bg-gray-50 dark:bg-slate-900 rounded border border-border dark:border-slate-700 text-gray-700 dark:text-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            value={selectedBairro}
            onChange={(e) => setSelectedBairro(e.target.value)}
          >
            <option value="Todos">Todos os bairros</option>
            {allBairros.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-auto xl:h-[600px]">

        {/* Left Column: Charts */}
        <div className="xl:col-span-1 flex flex-col gap-6 h-full">
          <Card className="flex-1 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Demandas por Tema</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">{filteredData.length}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">registros encontrados</span>
              </div>
              <div className="text-xs font-medium text-success mt-1">↑ +5.2% vs mês anterior</div>
            </div>

            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={temaChartData} margin={{ left: 0, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} className="stroke-gray-200 dark:stroke-slate-700" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={90} className="stroke-gray-500 dark:stroke-gray-400" tick={{ fontSize: 12, fontWeight: 500, fill: 'currentColor' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ borderRadius: '4px', border: '1px solid #DADCE0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: 'var(--tooltip-bg)', color: 'var(--tooltip-text)' }}
                  />
                  <Bar dataKey="value" fill={COLORS.primary} radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Column: Map */}
        <div className="xl:col-span-2 h-[500px] xl:h-full">
          <Card className="h-full flex flex-col relative overflow-hidden" noPadding>
            <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-4 py-2 rounded shadow-sm border border-border dark:border-slate-700">
              <h3 className="font-bold text-gray-800 dark:text-white">Mapa de Demandas</h3>
              <p className="text-xs text-gray-500 dark:text-gray-300">Distribuição geográfica em Valparaíso</p>
            </div>
            <div className="flex-1 w-full h-full bg-slate-900">
              <MapInteractive data={filteredData} selectedBairro={selectedBairro} />
            </div>
          </Card>
        </div>
      </div>

      {/* Detailed Table (Below fold) */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Resumo Detalhado</h3>
        <Card noPadding className="overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-border dark:border-slate-700">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bairro</th>
                <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tema</th>
                <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Quantidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-700">
              {/* Aggregate for table */}
              {Object.entries(filteredData.reduce((acc, curr) => {
                const key = `${curr.bairro}|${curr.tema}`;
                acc[key] = (acc[key] || 0) + 1;
                return acc;
              }, {} as Record<string, number>))
                .sort((a, b) => (b[1] as number) - (a[1] as number))
                .slice(0, 10)
                .map(([key, count], idx) => {
                  const [bairro, tema] = key.split('|');
                  return (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200">{bairro}</td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{tema}</td>
                      <td className="p-4 text-sm font-bold text-gray-800 dark:text-gray-200 text-right">{count}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};