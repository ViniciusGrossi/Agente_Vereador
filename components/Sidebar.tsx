import React from 'react';
import { LayoutDashboard, Map, Heart, ListTodo, LogOut, Bot, Sparkles, MessageSquareText } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, isOpen, onCloseMobile, darkMode, toggleDarkMode, onLogout }) => {
  const menuItems = [
    { id: 'visao-geral', label: 'Visão Geral', icon: <LayoutDashboard size={24} /> },
    { id: 'temas-bairros', label: 'Temas e Bairros', icon: <Map size={24} /> },
    { id: 'sentimento', label: 'Sentimento e Satisfação', icon: <Heart size={24} /> },
    { id: 'resumos-ia', label: 'Resumos Inteligentes', icon: <Sparkles size={24} /> },
    { id: 'agente-ia', label: 'Agente IA', icon: <Bot size={24} /> },
    { id: 'fila', label: 'Fila de Demandas', icon: <ListTodo size={24} /> },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full w-72 bg-white dark:bg-slate-900 border-r border-border dark:border-slate-800 z-40
        transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Logo / Header */}
        <div className="h-24 flex flex-col justify-center px-6 border-b border-border dark:border-slate-800 bg-blue-50 dark:bg-slate-900">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Gabinete Digital</span>
          <h1 className="font-bold text-2xl text-gray-800 dark:text-white leading-tight">Radar de<br />Demandas</h1>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`
                  w-full flex items-center gap-4 px-6 py-4 text-left transition-all duration-200
                  ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-primary border-r-4 border-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                <div className={`${isActive ? 'text-primary' : 'text-gray-400'}`}>
                  {item.icon}
                </div>
                <span className={`text-lg ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={20} />
            Sair do Sistema
          </button>
          <p className="text-xs text-center text-gray-400 mt-4">v1.0.2 • 2024</p>
        </div>
      </div>
    </aside>
  );
};