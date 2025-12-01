import { useState, useMemo, useEffect } from 'react';
import { AtendimentoComRelacoes } from '../types';
import { fetchAtendimentosWithRelations } from '../services/dataService';

export const useDashboardData = () => {
  const [periodo, setPeriodo] = useState('7'); // Default 7 days
  const [canal, setCanal] = useState('Todos');
  const [tema, setTema] = useState('Todos');
  const [bairro, setBairro] = useState('Todos');

  // Data from Supabase
  const [allData, setAllData] = useState<AtendimentoComRelacoes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchAtendimentosWithRelations();
        setAllData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err as Error);
        setAllData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Only load once on mount

  // Filter Data
  const filteredData = useMemo(() => {
    if (allData.length === 0) return [];

    const now = new Date();
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - parseInt(periodo));

    return allData.filter(item => {
      const itemDate = new Date(item.data_hora);
      const matchDate = itemDate >= cutoffDate;
      const matchCanal = canal === 'Todos' || item.canal === canal;
      const matchTema = tema === 'Todos' || (item.tema && item.tema.nome === tema);
      const matchBairro = bairro === 'Todos' || (item.bairro && item.bairro.nome === bairro);
      return matchDate && matchCanal && matchTema && matchBairro;
    });
  }, [allData, periodo, canal, tema, bairro]);

  // Calculate Previous Period Data for Growth Comparison
  const previousPeriodData = useMemo(() => {
    if (allData.length === 0) return [];

    const now = new Date();
    const days = parseInt(periodo);

    const currentPeriodStart = new Date();
    currentPeriodStart.setDate(now.getDate() - days);

    const previousPeriodStart = new Date();
    previousPeriodStart.setDate(currentPeriodStart.getDate() - days);

    return allData.filter(item => {
      const itemDate = new Date(item.data_hora);
      const matchCanal = canal === 'Todos' || item.canal === canal;
      const matchTema = tema === 'Todos' || (item.tema && item.tema.nome === tema);
      const matchBairro = bairro === 'Todos' || (item.bairro && item.bairro.nome === bairro);

      return itemDate >= previousPeriodStart && itemDate < currentPeriodStart && matchCanal && matchTema && matchBairro;
    });
  }, [allData, periodo, canal, tema, bairro]);

  // KPIs
  const totalAtendimentos = filteredData.length;
  const previousTotal = previousPeriodData.length;

  const growth = previousTotal > 0
    ? ((totalAtendimentos - previousTotal) / previousTotal) * 100
    : 0;

  const uniqueBairros = new Set(
    filteredData
      .filter(d => d.bairro)
      .map(d => d.bairro!.nome)
  ).size;

  const avgSatisfaction = filteredData.length > 0
    ? (filteredData.reduce((acc, curr) => acc + (curr.nota_satisfacao || 0), 0) / filteredData.length)
    : 0;

  // Most frequent theme
  const topTheme = useMemo(() => {
    if (filteredData.length === 0) return { name: 'N/A', count: 0 };

    const counts = filteredData.reduce((acc, curr) => {
      if (curr.tema) {
        acc[curr.tema.nome] = (acc[curr.tema.nome] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return { name: 'N/A', count: 0 };
    return { name: sorted[0][0], count: sorted[0][1] };
  }, [filteredData]);

  return {
    // State
    periodo, setPeriodo,
    canal, setCanal,
    tema, setTema,
    bairro, setBairro,

    // Data
    filteredData,
    loading,
    error,

    // KPIs
    kpis: {
      totalAtendimentos,
      growth: growth.toFixed(1),
      uniqueBairros,
      avgSatisfaction: avgSatisfaction.toFixed(1),
      topTheme
    }
  };
};
