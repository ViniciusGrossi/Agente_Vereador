import React from 'react';
import { Database } from './database.types';

// Database table types
export type Atendimento = Database['public']['Tables']['atendimentos']['Row'];
export type AtendimentoInsert = Database['public']['Tables']['atendimentos']['Insert'];
export type Bairro = Database['public']['Tables']['bairros']['Row'];
export type Tema = Database['public']['Tables']['temas']['Row'];
export type Subtema = Database['public']['Tables']['subtemas']['Row'];
export type Cidadao = Database['public']['Tables']['cidadaos']['Row'];
export type Gabinete = Database['public']['Tables']['gabinetes']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

// Legacy types for compatibility with existing code
export type StatusDemanda = 'Nova' | 'Em andamento' | 'Resolvida' | 'Cancelada';
export type Sentimento = 'Positivo' | 'Neutro' | 'Negativo';
export type Canal = 'WhatsApp' | 'Instagram' | 'Email' | 'Gabinete';
export type TipoInteracao = 'Reclamação' | 'Elogio' | 'Sugestão' | 'Dúvida';

// Extended types with relationships for frontend display
export interface AtendimentoComRelacoes extends Atendimento {
  bairro?: Bairro;
  tema?: Tema;
  subtema?: Subtema;
  cidadao?: Cidadao;
  // Computed field for legacy compatibility
  data?: string; // YYYY-MM-DD extracted from data_hora
}

export interface FiltroPeriodo {
  label: string;
  value: string; // 'hoje', '7dias', '30dias', 'mes', '3meses'
}

export interface KPI {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'positive' | 'critical' | 'neutral';
}
