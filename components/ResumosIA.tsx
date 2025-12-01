import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { MOCK_DATA } from '../constants';
import { Bot, MessageSquare, ThumbsUp, HelpCircle, AlertTriangle, Lightbulb, Search, Calendar, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ResumosIA: React.FC = () => {
  const [selectedType, setSelectedType] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Define types and their visual properties
  const interactionTypes = [
    { label: 'Todos', icon: <Bot size={18} />, color: 'bg-gray-100 text-gray-700 border-gray-200' },
    { label: 'Reclamação', icon: <AlertTriangle size={18} />, color: 'bg-red-50 text-red-700 border-red-200' },
    { label: 'Elogio', icon: <ThumbsUp size={18} />, color: 'bg-green-50 text-green-700 border-green-200' },
    { label: 'Dúvida', icon: <HelpCircle size={18} />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Sugestão', icon: <Lightbulb size={18} />, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  ];

  const filteredData = useMemo(() => {
    return MOCK_DATA.filter(item => {
      const matchType = selectedType === 'Todos' || item.tipo_interacao === selectedType;
      const matchSearch = item.resumo_demanda.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.bairro.toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchSearch;
    });
  }, [selectedType, searchTerm]);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header Info */}
      <div className="flex flex-col gap-2">
         <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="text-primary" />
            Resumos Inteligentes
         </h2>
         <p className="text-gray-500 max-w-2xl">
            O Agente de IA analisou as conversas e gerou estes resumos. Selecione um tipo de interação abaixo para focar sua leitura.
         </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Sidebar: Filters */}
        {/* Adjusted CSS: Removed sticky for mobile, added lg:sticky and self-start to prevent overlap issues */}
        <Card className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-24 self-start z-10" noPadding>
           <div className="p-4 border-b border-border bg-gray-50">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Filtrar Interações</h3>
           </div>
           <div className="p-2 space-y-1">
              {interactionTypes.map((type) => (
                 <button
                   key={type.label}
                   onClick={() => setSelectedType(type.label)}
                   className={`
                     w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all
                     ${selectedType === type.label 
                       ? 'bg-blue-50 text-primary ring-1 ring-primary shadow-sm' 
                       : 'text-gray-600 hover:bg-gray-50'
                     }
                   `}
                 >
                    {type.icon}
                    <span>{type.label}</span>
                    {selectedType !== type.label && type.label !== 'Todos' && (
                       <span className="ml-auto text-xs bg-gray-100 text-gray-500 py-0.5 px-2 rounded-full">
                         {MOCK_DATA.filter(d => d.tipo_interacao === type.label).length}
                       </span>
                    )}
                 </button>
              ))}
           </div>
        </Card>

        {/* Right Content: Feed */}
        <div className="flex-1 w-full space-y-4">
           
           {/* Search Bar */}
           <div className="relative">
             <input 
               type="text"
               placeholder="Pesquisar nos resumos..."
               className="w-full pl-10 pr-4 py-3 rounded-lg border border-border shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-700"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
           </div>

           {/* Cards Feed */}
           <div className="grid grid-cols-1 gap-4">
             <AnimatePresence>
               {filteredData.map((item) => (
                 <motion.div
                   key={item.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0 }}
                   layout
                 >
                   <Card className="flex flex-col gap-3 group hover:border-blue-300 transition-colors">
                      {/* Card Header */}
                      <div className="flex justify-between items-start">
                         <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold border ${
                               interactionTypes.find(t => t.label === item.tipo_interacao)?.color
                            }`}>
                               {item.tipo_interacao}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                               <Calendar size={12} />
                               {new Date(item.data_hora).toLocaleDateString('pt-BR')}
                            </span>
                         </div>
                         <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            <MapPin size={12} />
                            {item.bairro}
                         </div>
                      </div>
                      
                      {/* AI Summary Body */}
                      <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 relative">
                         <Sparkles className="absolute top-3 left-3 text-primary opacity-20" size={24} />
                         <p className="text-gray-800 text-sm leading-relaxed pl-8">
                            "{item.resumo_demanda}"
                         </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between mt-1 pt-3 border-t border-gray-100">
                         <div className="flex items-center gap-4">
                            <span className="text-xs font-medium text-gray-500">
                               Tema: <span className="text-gray-800">{item.tema}</span>
                            </span>
                            <span className="text-xs font-medium text-gray-500">
                               Canal: <span className="text-gray-800">{item.canal}</span>
                            </span>
                         </div>
                         
                         {/* Sentiment Indicator */}
                         <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${
                               item.sentimento === 'Positivo' ? 'bg-green-500' : 
                               item.sentimento === 'Negativo' ? 'bg-red-500' : 'bg-gray-400'
                            }`} />
                            <span className="text-xs text-gray-500">{item.sentimento}</span>
                         </div>
                      </div>
                   </Card>
                 </motion.div>
               ))}
             </AnimatePresence>
             
             {filteredData.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                   <Bot size={48} className="mx-auto mb-2 opacity-20" />
                   <p>Nenhum resumo encontrado para os filtros atuais.</p>
                </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};