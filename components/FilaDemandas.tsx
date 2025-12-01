import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { MOCK_DATA, COLORS } from '../constants';
import { Search, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const FilaDemandas: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    return MOCK_DATA.filter(item => {
      const matchStatus = statusFilter === 'Todas' || item.status_demanda === statusFilter;
      const matchSearch = item.resumo_demanda.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.tema.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [statusFilter, searchTerm]);

  // Counts
  const countNova = MOCK_DATA.filter(d => d.status_demanda === 'Nova').length;
  const countAndamento = MOCK_DATA.filter(d => d.status_demanda === 'Em andamento').length;
  const countResolvida = MOCK_DATA.filter(d => d.status_demanda === 'Resolvida').length;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Nova': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Em andamento': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolvida': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Filters & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Fila de Demandas</h2>
        <div className="flex gap-2">
           <select 
             className="bg-white border border-border rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
           >
             <option value="Todas">Todas as situações</option>
             <option value="Nova">Novas</option>
             <option value="Em andamento">Em andamento</option>
             <option value="Resolvida">Resolvidas</option>
           </select>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setStatusFilter('Nova')}
          className={`cursor-pointer rounded-xl p-6 border transition-all hover:shadow-md ${statusFilter === 'Nova' ? 'ring-2 ring-yellow-400 bg-yellow-50 border-yellow-200' : 'bg-yellow-50 border-yellow-100 opacity-90'}`}
        >
           <div className="flex items-center gap-3 mb-2">
             <AlertCircle className="text-yellow-600" size={24} />
             <span className="text-lg font-bold text-yellow-800">Novas</span>
           </div>
           <span className="text-4xl font-black text-yellow-900">{countNova}</span>
           <p className="text-yellow-700 text-sm mt-1">Aguardando atenção</p>
        </div>

        <div 
          onClick={() => setStatusFilter('Em andamento')}
          className={`cursor-pointer rounded-xl p-6 border transition-all hover:shadow-md ${statusFilter === 'Em andamento' ? 'ring-2 ring-blue-400 bg-blue-50 border-blue-200' : 'bg-blue-50 border-blue-100 opacity-90'}`}
        >
           <div className="flex items-center gap-3 mb-2">
             <Clock className="text-blue-600" size={24} />
             <span className="text-lg font-bold text-blue-800">Em andamento</span>
           </div>
           <span className="text-4xl font-black text-blue-900">{countAndamento}</span>
           <p className="text-blue-700 text-sm mt-1">Sendo trabalhadas</p>
        </div>

        <div 
          onClick={() => setStatusFilter('Resolvida')}
          className={`cursor-pointer rounded-xl p-6 border transition-all hover:shadow-md ${statusFilter === 'Resolvida' ? 'ring-2 ring-green-400 bg-green-50 border-green-200' : 'bg-green-50 border-green-100 opacity-90'}`}
        >
           <div className="flex items-center gap-3 mb-2">
             <CheckCircle className="text-green-600" size={24} />
             <span className="text-lg font-bold text-green-800">Resolvidas</span>
           </div>
           <span className="text-4xl font-black text-green-900">{countResolvida}</span>
           <p className="text-green-700 text-sm mt-1">Concluídas com sucesso</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input 
          type="text"
          placeholder="Busque por bairro, tema ou palavras-chave..."
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-border shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4 font-bold border-b border-border">Data</th>
                <th className="p-4 font-bold border-b border-border">Canal</th>
                <th className="p-4 font-bold border-b border-border">Bairro</th>
                <th className="p-4 font-bold border-b border-border">Tema</th>
                <th className="p-4 font-bold border-b border-border">Resumo</th>
                <th className="p-4 font-bold border-b border-border text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(item.data_hora).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-700">{item.canal}</td>
                  <td className="p-4 text-sm text-gray-700">{item.bairro}</td>
                  <td className="p-4 text-sm text-gray-700">
                    <span className="block font-semibold">{item.tema}</span>
                    <span className="text-xs text-gray-500">{item.tipo_interacao}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={item.resumo_demanda}>
                    {item.resumo_demanda}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status_demanda)}`}>
                      {item.status_demanda}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                 <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                     Nenhuma demanda encontrada com estes filtros.
                  </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 p-4 border-t border-border text-center text-gray-500 text-sm">
           Use esta lista para acompanhar as demandas da população e atualizar o status conforme forem resolvidas.
        </div>
      </div>
    </div>
  );
};
