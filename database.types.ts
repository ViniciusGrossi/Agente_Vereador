export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            anexos_atendimento: {
                Row: {
                    arquivo_url: string
                    atendimento_id: string | null
                    created_at: string | null
                    id: string
                    nome_original: string | null
                    tamanho_bytes: number | null
                    tipo_arquivo: string | null
                    uploaded_by_id: string | null
                }
                Insert: {
                    arquivo_url: string
                    atendimento_id?: string | null
                    created_at?: string | null
                    id?: string
                    nome_original?: string | null
                    tamanho_bytes?: number | null
                    tipo_arquivo?: string | null
                    uploaded_by_id?: string | null
                }
                Update: {
                    arquivo_url?: string
                    atendimento_id?: string | null
                    created_at?: string | null
                    id?: string
                    nome_original?: string | null
                    tamanho_bytes?: number | null
                    tipo_arquivo?: string | null
                    uploaded_by_id?: string | null
                }
            }
            atendimentos: {
                Row: {
                    bairro_id: string | null
                    canal: string
                    cidadao_id: string | null
                    created_at: string | null
                    data_hora: string
                    gabinete_id: string | null
                    id: string
                    nota_satisfacao: number | null
                    protocolo: string | null
                    resumo_demanda: string | null
                    sentimento: string | null
                    status: string | null
                    subtema_id: string | null
                    tema_id: string | null
                    tipo_interacao: string
                    updated_at: string | null
                }
                Insert: {
                    bairro_id?: string | null
                    canal: string
                    cidadao_id?: string | null
                    created_at?: string | null
                    data_hora?: string
                    gabinete_id?: string | null
                    id?: string
                    nota_satisfacao?: number | null
                    protocolo?: string | null
                    resumo_demanda?: string | null
                    sentimento?: string | null
                    status?: string | null
                    subtema_id?: string | null
                    tema_id?: string | null
                    tipo_interacao: string
                    updated_at?: string | null
                }
                Update: {
                    bairro_id?: string | null
                    canal?: string
                    cidadao_id?: string | null
                    created_at?: string | null
                    data_hora?: string
                    gabinete_id?: string | null
                    id?: string
                    nota_satisfacao?: number | null
                    protocolo?: string | null
                    resumo_demanda?: string | null
                    sentimento?: string | null
                    status?: string | null
                    subtema_id?: string | null
                    tema_id?: string | null
                    tipo_interacao?: string
                    updated_at?: string | null
                }
            }
            bairros: {
                Row: {
                    codigo_postal: string | null
                    created_at: string | null
                    id: string
                    latitude: number | null
                    longitude: number | null
                    nome: string
                    populacao_estimada: number | null
                    regiao: string | null
                }
                Insert: {
                    codigo_postal?: string | null
                    created_at?: string | null
                    id?: string
                    latitude?: number | null
                    longitude?: number | null
                    nome: string
                    populacao_estimada?: number | null
                    regiao?: string | null
                }
                Update: {
                    codigo_postal?: string | null
                    created_at?: string | null
                    id?: string
                    latitude?: number | null
                    longitude?: number | null
                    nome?: string
                    populacao_estimada?: number | null
                    regiao?: string | null
                }
            }
            cidadaos: {
                Row: {
                    bairro_id: string | null
                    codigo_postal: string | null
                    created_at: string | null
                    data_nascimento: string | null
                    email: string | null
                    id: string
                    nome: string
                    telefone: string | null
                    updated_at: string | null
                }
                Insert: {
                    bairro_id?: string | null
                    codigo_postal?: string | null
                    created_at?: string | null
                    data_nascimento?: string | null
                    email?: string | null
                    id?: string
                    nome: string
                    telefone?: string | null
                    updated_at?: string | null
                }
                Update: {
                    bairro_id?: string | null
                    codigo_postal?: string | null
                    created_at?: string | null
                    data_nascimento?: string | null
                    email?: string | null
                    id?: string
                    nome?: string
                    telefone?: string | null
                    updated_at?: string | null
                }
            }
            conversas_ia: {
                Row: {
                    created_at: string | null
                    gabinete_id: string | null
                    id: string
                    modo: string
                    titulo: string | null
                    updated_at: string | null
                    usuario_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    gabinete_id?: string | null
                    id?: string
                    modo: string
                    titulo?: string | null
                    updated_at?: string | null
                    usuario_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    gabinete_id?: string | null
                    id?: string
                    modo?: string
                    titulo?: string | null
                    updated_at?: string | null
                    usuario_id?: string | null
                }
            }
            gabinetes: {
                Row: {
                    ativo: boolean | null
                    created_at: string | null
                    email: string | null
                    id: string
                    nome: string
                    numero_gabinete: string | null
                    partido: string | null
                    telefone: string | null
                }
                Insert: {
                    ativo?: boolean | null
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    nome: string
                    numero_gabinete?: string | null
                    partido?: string | null
                    telefone?: string | null
                }
                Update: {
                    ativo?: boolean | null
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    nome?: string
                    numero_gabinete?: string | null
                    partido?: string | null
                    telefone?: string | null
                }
            }
            historico_atendimentos: {
                Row: {
                    atendimento_id: string | null
                    created_at: string | null
                    descricao: string | null
                    id: string
                    status_anterior: string | null
                    status_novo: string | null
                    tipo_acao: string
                    usuario_id: string | null
                }
                Insert: {
                    atendimento_id?: string | null
                    created_at?: string | null
                    descricao?: string | null
                    id?: string
                    status_anterior?: string | null
                    status_novo?: string | null
                    tipo_acao: string
                    usuario_id?: string | null
                }
                Update: {
                    atendimento_id?: string | null
                    created_at?: string | null
                    descricao?: string | null
                    id?: string
                    status_anterior?: string | null
                    status_novo?: string | null
                    tipo_acao?: string
                    usuario_id?: string | null
                }
            }
            mensagens_ia: {
                Row: {
                    conteudo: string
                    conversa_id: string | null
                    created_at: string | null
                    id: string
                    metadata: Json | null
                    role: string
                }
                Insert: {
                    conteudo: string
                    conversa_id?: string | null
                    created_at?: string | null
                    id?: string
                    metadata?: Json | null
                    role: string
                }
                Update: {
                    conteudo?: string
                    conversa_id?: string | null
                    created_at?: string | null
                    id?: string
                    metadata?: Json | null
                    role?: string
                }
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    cargo: string | null
                    created_at: string | null
                    gabinete_id: string | null
                    id: string
                    nome_completo: string
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    cargo?: string | null
                    created_at?: string | null
                    gabinete_id?: string | null
                    id: string
                    nome_completo: string
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    cargo?: string | null
                    created_at?: string | null
                    gabinete_id?: string | null
                    id?: string
                    nome_completo?: string
                    updated_at?: string | null
                }
            }
            subtemas: {
                Row: {
                    ativo: boolean | null
                    id: string
                    nome: string
                    tema_id: string | null
                }
                Insert: {
                    ativo?: boolean | null
                    id?: string
                    nome: string
                    tema_id?: string | null
                }
                Update: {
                    ativo?: boolean | null
                    id?: string
                    nome?: string
                    tema_id?: string | null
                }
            }
            temas: {
                Row: {
                    ativo: boolean | null
                    cor: string | null
                    id: string
                    nome: string
                }
                Insert: {
                    ativo?: boolean | null
                    cor?: string | null
                    id?: string
                    nome: string
                }
                Update: {
                    ativo?: boolean | null
                    cor?: string | null
                    id?: string
                    nome?: string
                }
            }
        }
    }
}
