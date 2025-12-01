import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, FileText, Scale, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/Card';

type Mode = 'vereador' | 'legislativo';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AgenteIA: React.FC = () => {
  const [mode, setMode] = useState<Mode>('vereador');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! Sou seu assistente virtual. No modo "Gabinete", posso responder sobre seus projetos de lei, emendas e agenda. No modo "Legislativo", ajudo com o Regimento Interno e questões jurídicas. Como posso ajudar hoje?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = mode === 'vereador' ? [
    "Quais são meus projetos de lei?",
    "Status da emenda da saúde",
    "Agenda de hoje"
  ] : [
    "Prazo para vistas",
    "Quorum para Lei Complementar",
    "Parecer da CCJ"
  ];

  const handleClear = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! Sou seu assistente virtual. Histórico limpo. Como posso ajudar agora?',
      timestamp: new Date()
    }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulação de resposta da IA (Fake Backend)
    setTimeout(() => {
      const responseContent = generateFakeResponse(userMsg.content, mode);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simula a inteligência baseada em palavras-chave
  const generateFakeResponse = (question: string, currentMode: Mode): string => {
    const q = question.toLowerCase();

    if (currentMode === 'vereador') {
      if (q.includes('saúde') || q.includes('posto'))
        return "Sobre a área da Saúde, o vereador protocolou a **Emenda Impositiva nº 42/2024** que destina R$ 150.000 para a reforma do posto de saúde do Jardim das Flores. Além disso, temos o **Projeto de Lei 'Fila Zero'**, que visa dar transparência às filas de exames.";

      if (q.includes('iluminação') || q.includes('luz'))
        return "Temos um requerimento ativo cobrando a troca de lâmpadas de LED em toda a extensão da Avenida Principal do Valparaíso II. O gabinete já recebeu resposta do Executivo prometendo execução até o fim do mês.";

      if (q.includes('escola') || q.includes('educação'))
        return "O Projeto 'Escola Segura', de autoria do vereador, foi aprovado em primeira votação. Ele prevê a instalação de botões de pânico nas escolas municipais. Estamos acompanhando a sanção do prefeito.";

      return "Entendido. No contexto do mandato, estamos focados em Saúde, Educação e Infraestrutura. Pode ser mais específico sobre qual projeto ou emenda deseja informações?";
    } else {
      // Modo Legislativo
      if (q.includes('prazo') || q.includes('tempo'))
        return "De acordo com o **Art. 132 do Regimento Interno**, o prazo para vistas de projetos em regime de urgência é de 24 horas. Para projetos em tramitação ordinária, o prazo é de 7 dias úteis.";

      if (q.includes('quorum') || q.includes('votação'))
        return "Para aprovação de Leis Complementares, é necessário **maioria absoluta** (metade mais um de todos os membros), conforme o Art. 45 da Lei Orgânica do Município. Já para requerimentos simples, basta maioria simples dos presentes.";

      if (q.includes('comissão') || q.includes('ccj'))
        return "A Comissão de Constituição e Justiça (CCJ) deve emitir parecer sobre a constitucionalidade. Se o parecer for contrário, o projeto é arquivado, salvo se o plenário derrubar o parecer por maioria qualificada (2/3), conforme Regimento.";

      return "Com base na Lei Orgânica e no Regimento Interno de Valparaíso, essa questão depende de interpretação específica da mesa diretora. Poderia reformular a dúvida com base em algum artigo específico?";
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-5xl mx-auto animate-fade-in">

      {/* Mode Switcher */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-border dark:border-slate-700 shadow-sm flex items-center gap-2">
          <button
            onClick={() => setMode('vereador')}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200
              ${mode === 'vereador'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}
            `}
          >
            <FileText size={18} />
            Especialista Gabinete
          </button>
          <button
            onClick={() => setMode('legislativo')}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200
              ${mode === 'legislativo'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}
            `}
          >
            <Scale size={18} />
            Especialista Legislativo
          </button>
        </div>

        <button
          onClick={handleClear}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors underline"
        >
          Limpar conversa
        </button>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col overflow-hidden border-0 shadow-lg" noPadding>

        {/* Header Visual Cue */}
        <div className={`h-1.5 w-full ${mode === 'vereador' ? 'bg-blue-600' : 'bg-purple-600'}`}></div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-900/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm
                  ${isUser ? 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300' : (mode === 'vereador' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400')}
                `}>
                  {isUser ? <User size={20} /> : <Bot size={20} />}
                </div>

                {/* Bubble */}
                <div className={`
                  max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed
                  ${isUser
                    ? 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-gray-100 rounded-tr-none'
                    : `${mode === 'vereador' ? 'bg-blue-600' : 'bg-purple-600'} text-white rounded-tl-none shadow-md`}
                `}>
                  {/* Markdown-ish bold handling for simplicity */}
                  {msg.content.split('**').map((part, i) =>
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
                  <div className={`text-[10px] mt-2 opacity-70 ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {isTyping && (
            <div className="flex gap-4">
              <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                  ${mode === 'vereador' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}
                `}>
                <Bot size={20} />
              </div>
              <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                <motion.div
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="px-6 py-2 bg-slate-50 dark:bg-slate-900/50 flex gap-2 overflow-x-auto">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setInput(s)}
              className="whitespace-nowrap px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full text-xs text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-border dark:border-slate-700">
          <div className="relative flex items-center gap-2">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {mode === 'vereador' ? <Sparkles size={20} /> : <BookOpen size={20} />}
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={mode === 'vereador' ? "Pergunte sobre projetos, emendas ou agenda..." : "Pergunte sobre leis, prazos ou regimento..."}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-border dark:border-slate-700 text-gray-800 dark:text-white rounded-xl pl-12 pr-14 py-4 focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all shadow-inner focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`
                absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-lg text-white transition-all
                ${!input.trim()
                  ? 'bg-gray-300 dark:bg-slate-600 cursor-not-allowed'
                  : (mode === 'vereador' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg')}
              `}
            >
              <Send size={20} />
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="text-xs text-gray-400">A IA pode cometer erros. Verifique informações importantes no documento oficial.</span>
          </div>
        </div>

      </Card>
    </div>
  );
};