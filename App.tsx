import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { VisaoGeral } from './components/VisaoGeral';
import { TemasBairros } from './components/TemasBairros';
import { SentimentoSatisfacao } from './components/SentimentoSatisfacao';
import { FilaDemandas } from './components/FilaDemandas';
import { ResumosIA } from './components/ResumosIA';
import { AgenteIA } from './components/AgenteIA';
import { Menu, Sun, Moon } from 'lucide-react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('visao-geral');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const renderContent = () => {
    switch (activePage) {
      case 'visao-geral':
        return <VisaoGeral />;
      case 'temas-bairros':
        return <TemasBairros />;
      case 'sentimento':
        return <SentimentoSatisfacao />;
      case 'resumos-ia':
        return <ResumosIA />;
      case 'agente-ia':
        return <AgenteIA />;
      case 'fila':
        return <FilaDemandas />;
      default:
        return <VisaoGeral />;
    }
  };

  const getTitle = () => {
    switch (activePage) {
      case 'visao-geral': return 'Visão Geral';
      case 'temas-bairros': return 'Temas e Bairros';
      case 'sentimento': return 'Sentimento e Satisfação';
      case 'resumos-ia': return 'Resumos Inteligentes';
      case 'agente-ia': return 'Agente IA';
      case 'fila': return 'Fila de Demandas';
      default: return 'Gabinete';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return authMode === 'login'
      ? <Login onRegisterClick={() => setAuthMode('register')} />
      : <Register onLoginClick={() => setAuthMode('login')} />;
  }

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${darkMode ? 'dark bg-slate-900' : 'bg-background'}`}>

      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
      />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <main
        className={`
          flex-1 flex flex-col min-h-screen transition-all duration-300
          ${sidebarOpen ? 'lg:pl-72' : 'lg:pl-72'} 
        `}
      >
        {/* Topbar */}
        <header className="bg-white dark:bg-slate-800 border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg lg:hidden"
            >
              <Menu size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              {activePage === 'visao-geral' && 'Visão Geral'}
              {activePage === 'temas-bairros' && 'Temas e Bairros'}
              {activePage === 'sentimento' && 'Sentimento e Satisfação'}
              {activePage === 'agente-ia' && 'Agente IA'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle in Header */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              title={darkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-slate-600" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                VG
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">Vinicius Grossi</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        < div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full" >
          {renderContent()}
        </div >
      </main >
    </div >
  );
};

export default App;