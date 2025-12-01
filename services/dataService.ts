import { supabase } from '../supabaseClient';
import type { Atendimento, AtendimentoComRelacoes, Bairro, Tema, Subtema } from '../types';

/**
 * Busca todos os atendimentos com suas relações (bairro, tema, subtema)
 */
export async function fetchAtendimentosWithRelations(): Promise<AtendimentoComRelacoes[]> {
    const { data, error } = await supabase
        .from('atendimentos')
        .select(`
      *,
      bairro:bairros(*),
      tema:temas(*),
      subtema:subtemas(*),
      cidadao:cidadaos(*)
    `)
        .order('data_hora', { ascending: false });

    if (error) {
        console.error('Error fetching atendimentos:', error);
        throw error;
    }

    // Add computed 'data' field for legacy compatibility
    return (data || []).map(atendimento => ({
        ...atendimento,
        data: atendimento.data_hora.split('T')[0] // Extract YYYY-MM-DD
    }));
}

/**
 * Busca todos os bairros
 */
export async function fetchBairros(): Promise<Bairro[]> {
    const { data, error } = await supabase
        .from('bairros')
        .select('*')
        .order('nome');

    if (error) {
        console.error('Error fetching bairros:', error);
        throw error;
    }

    return data || [];
}

/**
 * Busca todos os temas
 */
export async function fetchTemas(): Promise<Tema[]> {
    const { data, error } = await supabase
        .from('temas')
        .select('*')
        .eq('ativo', true)
        .order('nome');

    if (error) {
        console.error('Error fetching temas:', error);
        throw error;
    }

    return data || [];
}

/**
 * Busca todos os subtemas com seus temas relacionados
 */
export async function fetchSubtemasWithTemas(): Promise<Array<Subtema & { tema?: Tema }>> {
    const { data, error } = await supabase
        .from('subtemas')
        .select(`
      *,
      tema:temas(*)
    `)
        .eq('ativo', true)
        .order('nome');

    if (error) {
        console.error('Error fetching subtemas:', error);
        throw error;
    }

    return data || [];
}

/**
 * Cria um novo atendimento
 */
export async function createAtendimento(atendimento: {
    cidadao_id?: string;
    gabinete_id: string;
    canal: string;
    tipo_interacao: string;
    tema_id: string;
    subtema_id?: string;
    bairro_id?: string;
    resumo_demanda: string;
    sentimento?: string;
    nota_satisfacao?: number;
}) {
    const { data, error } = await supabase
        .from('atendimentos')
        .insert([{
            ...atendimento,
            protocolo: `AT-${Date.now()}`, // Simple protocol generation
            status: 'Nova'
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating atendimento:', error);
        throw error;
    }

    return data;
}

/**
 * Atualiza o status de um atendimento
 */
export async function updateAtendimentoStatus(
    id: string,
    status: string
) {
    const { data, error } = await supabase
        .from('atendimentos')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating atendimento:', error);
        throw error;
    }

    return data;
}
