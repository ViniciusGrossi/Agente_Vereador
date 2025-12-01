import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Smile, Meh, Frown, TrendingUp } from 'lucide-react';
import { Card } from './ui/Card';
import { COLORS } from '../constants';
import { useDashboardData } from '../hooks/useDashboardData';

export const SentimentoSatisfacao: React.FC = () => {
  const { periodo, setPeriodo, filteredData } = useDashboardData();

  // Avg Satisfaction
  const avgScore = filteredData.length
    ? (filteredData.reduce((acc, curr) => acc + curr.nota_satisfacao, 0) / filteredData.length)
    : 0;

  let scoreLabel = "Sem dados";
  let scoreColor = "text-gray-400";
  if (filteredData.length > 0) {
    if (avgScore >= 4) { scoreLabel = "Bom"; scoreColor = "text-success"; }
    else if (avgScore >= 3) { scoreLabel = "Regular"; scoreColor = "text-yellow-600"; }
    else { scoreLabel = "Precisa de Atenção"; scoreColor = "text-critical"; }
  }

  // Sentiment Pie Data
  const sentimentData = useMemo(() => {
    const counts = { Positivo: 0, Neutro: 0, Negativo: 0 };
    filteredData.forEach(d => counts[d.sentimento]++);
    return [
      { name: 'Positivo', value: counts.Positivo, color: COLORS.success },
      { name: 'Neutro', value: counts.Neutro, color: '#9E9E9E' }, // Gray for neutral
      { name: 'Negativo', value: counts.Negativo, color: COLORS.critical },
    ].filter(d => d.value > 0);
  }, [filteredData]);

  // Sentiment by Theme (Stacked Bar)
  const sentimentByTheme = useMemo(() => {
    // Top 5 themes
    const topTemas = Object.entries(filteredData.reduce((acc, curr) => {
      acc[curr.tema] = (acc[curr.tema] || 0) + 1;
      return acc;
    }, {} as Record<string, number>))
      .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
      .slice(0, 5)
      .map(t => t[0]);

    return topTemas.map(tema => {
      const subset = filteredData.filter(d => d.tema === tema);
      return {
        name: tema,
        Positivo: subset.filter(d => d.sentimento === 'Positivo').length,
        Neutro: subset.filter(d => d.sentimento === 'Neutro').length,
        Negativo: subset.filter(d => d.sentimento === 'Negativo').length,
      };
    });
  }, [filteredData]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Control Bar */}
      <Card className="flex flex-wrap gap-4 items-center bg-white dark:bg-slate-800 sticky top-20 z-10">
        <div className="flex gap-2">
          {[
            { label: '7 Dias', val: '7' },
            { label: '15 Dias', val: '15' },
            { label: '30 Dias', val: '30' }
          ].map(opt => (
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
      </Card>

      {/* Header Section */}
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Sentimento e Satisfação</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Análise qualitativa das interações e nível de satisfação dos munícipes.
        </p>
      </div>

      {/* Big Score Card */}
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl text-center py-10 border-t-8 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Satisfação Média</h2>
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="text-6xl font-black text-gray-800 dark:text-white">{avgScore.toFixed(1)}</span>
            <span className="text-4xl text-gray-300 dark:text-gray-600">/ 5.0</span>
          </div>
          <div className={`text-3xl font-bold ${scoreColor} mb-6`}>{scoreLabel}</div>
          <p className="text-gray-400 dark:text-gray-500">Baseado em {filteredData.length} interações no período</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Pie */}
        <Card className="flex flex-col items-center">
          <h3 className="text-xl font-bold text-gray-700 w-full text-left mb-6">Sentimento das Mensagens</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      {/* Bottom Row: Sentiment by Theme */}
      <div className="mt-6">
        <Card className="h-[400px] flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Sentimento por Tema</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Como cada tema está sendo percebido</p>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sentimentByTheme}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar dataKey="Positivo" stackId="a" fill="#4ade80" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Neutro" stackId="a" fill="#facc15" />
                <Bar dataKey="Negativo" stackId="a" fill="#f87171" radius={[4, 0, 0, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};