import { Atendimento } from './types';

export const APP_NAME = "Radar de Demandas";

// Colors for charts
export const COLORS = {
  primary: '#1E88E5',
  success: '#43A047',
  critical: '#E53935',
  neutral: '#757575',
  background: '#F5F5F5',
  muted: '#E0E0E0',
  charts: ['#1E88E5', '#43A047', '#FB8C00', '#8E24AA', '#E53935', '#00ACC1']
};

// Generate Mock Data
const bairros = ['Centro', 'Jardim das Flores', 'Vila Nova', 'São José', 'Boa Vista', 'Industrial', 'Alto da Glória'];
const temas = [
  { tema: 'Saúde', subtemas: ['Posto de Saúde', 'Falta de Médico', 'Remédios'] },
  { tema: 'Educação', subtemas: ['Vaga em Creche', 'Merenda', 'Reforma Escola'] },
  { tema: 'Transporte', subtemas: ['Ônibus Atrasado', 'Ponto de Ônibus', 'Buraco na Rua'] },
  { tema: 'Iluminação', subtemas: ['Lâmpada Queimada', 'Rua Escura'] },
  { tema: 'Segurança', subtemas: ['Policiamento', 'Assalto'] },
  { tema: 'Limpeza', subtemas: ['Coleta de Lixo', 'Capina', 'Entulho'] }
];
const sentimentos = ['Positivo', 'Neutro', 'Negativo'] as const;
const canais = ['WhatsApp', 'Instagram', 'Gabinete'] as const;
const statusList = ['Nova', 'Em andamento', 'Resolvida'] as const;
const tipos = ['Reclamação', 'Dúvida', 'Sugestão', 'Elogio'] as const;

// Helper to generate richer AI summaries
const generateAISummary = (tipo: string, tema: string, subtema: string, bairro: string) => {
  const templates = {
    'Reclamação': [
      `Morador relata insatisfação recorrente com ${subtema.toLowerCase()} no bairro ${bairro}. Informa que já abriu protocolo anterior sem resposta.`,
      `Cidadão denuncia problemas graves de ${subtema.toLowerCase()} na região do ${bairro}. Pede providências urgentes do gabinete.`,
      `Contato via WhatsApp informando que a situação de ${subtema.toLowerCase()} no ${bairro} está insustentável e afetando a rotina local.`
    ],
    'Elogio': [
      `Munícipe agradece a atuação do vereador na resolução de ${subtema.toLowerCase()} no ${bairro}. Diz que a comunidade ficou muito feliz.`,
      `Mensagem parabenizando a equipe pela rapidez no atendimento sobre ${subtema.toLowerCase()}. Reforça apoio ao mandato.`,
      `Morador do ${bairro} enviou feedback positivo sobre as melhorias recentes em ${tema.toLowerCase()}, especificamente na questão de ${subtema.toLowerCase()}.`
    ],
    'Dúvida': [
      `Cidadão questiona como funciona o processo para solicitar ${subtema.toLowerCase()} no ${bairro}. Precisa de orientação sobre documentos.`,
      `Pergunta sobre o cronograma de obras para ${tema.toLowerCase()} no ${bairro}, especificamente se haverá ${subtema.toLowerCase()} em breve.`,
      `Solicita informações sobre horário de atendimento para resolver pendência de ${subtema.toLowerCase()}.`
    ],
    'Sugestão': [
      `Ideia enviada para melhorar ${subtema.toLowerCase()} no ${bairro}. Sugere parceria com comércios locais para viabilizar.`,
      `Propõe um projeto de lei voltado para ${tema.toLowerCase()}, focando principalmente em ${subtema.toLowerCase()} nas escolas do bairro.`,
      `Morador sugere uma reunião comunitária no ${bairro} para discutir novas abordagens sobre ${subtema.toLowerCase()}.`
    ]
  };

  // @ts-ignore
  const list = templates[tipo] || templates['Reclamação'];
  return list[Math.floor(Math.random() * list.length)];
};

const generateData = (): Atendimento[] => {
  const data: Atendimento[] = [];
  const now = new Date();
  
  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    const temaObj = temas[Math.floor(Math.random() * temas.length)];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const subtema = temaObj.subtemas[Math.floor(Math.random() * temaObj.subtemas.length)];
    const bairro = bairros[Math.floor(Math.random() * bairros.length)];
    
    // Correlation: Reclamacao tends to be Negative
    let sentimentoIndex = Math.floor(Math.random() * 3);
    if (tipo === 'Reclamação') sentimentoIndex = Math.random() > 0.3 ? 2 : 1; // More likely negative
    if (tipo === 'Elogio') sentimentoIndex = 0; // Positive

    let nota = 3;
    if (sentimentos[sentimentoIndex] === 'Positivo') nota = 5;
    if (sentimentos[sentimentoIndex] === 'Negativo') nota = Math.floor(Math.random() * 2) + 1;

    data.push({
      id: `atd-${i}`,
      data_hora: date.toISOString(),
      data: date.toISOString().split('T')[0],
      canal: canais[Math.floor(Math.random() * canais.length)],
      tipo_interacao: tipo,
      tema: temaObj.tema,
      subtema: subtema,
      bairro: bairro,
      sentimento: sentimentos[sentimentoIndex],
      nota_satisfacao: nota,
      status_demanda: statusList[Math.floor(Math.random() * statusList.length)],
      resumo_demanda: generateAISummary(tipo, temaObj.tema, subtema, bairro)
    });
  }
  
  // Add some specifically for "Today"
  data.push({
    id: 'atd-new-1',
    data_hora: new Date().toISOString(),
    data: new Date().toISOString().split('T')[0],
    canal: 'WhatsApp',
    tipo_interacao: 'Reclamação',
    tema: 'Iluminação',
    subtema: 'Lâmpada Queimada',
    bairro: 'Centro',
    sentimento: 'Negativo',
    nota_satisfacao: 2,
    status_demanda: 'Nova',
    resumo_demanda: generateAISummary('Reclamação', 'Iluminação', 'Lâmpada Queimada', 'Centro')
  });

  return data.sort((a, b) => new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime());
};

export const MOCK_DATA = generateData();