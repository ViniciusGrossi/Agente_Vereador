import { supabase } from './supabaseClient';
import { MOCK_DATA } from './constants';

/**
 * Script para migrar MOCK_DATA para o Supabase
 * Executa uma vez para popular o banco com dados de teste
 */
async function migrateMockDataToSupabase() {
    try {
        console.log('🚀 Iniciando migração de MOCK_DATA para Supabase...');

        // 1. Buscar mapeamento de bairros (nome -> id)
        console.log('📍 Buscando bairros...');
        const { data: bairros, error: bairrosError } = await supabase
            .from('bairros')
            .select('id, nome');

        if (bairrosError) throw bairrosError;
        const bairroMap = new Map(bairros?.map(b => [b.nome, b.id]) || []);
        console.log(`   ✓ ${bairroMap.size} bairros encontrados`);

        // 2. Buscar mapeamento de temas (nome -> id)
        console.log('📚 Buscando temas...');
        const { data: temas, error: temasError } = await supabase
            .from('temas')
            .select('id, nome');

        if (temasError) throw temasError;
        const temaMap = new Map(temas?.map(t => [t.nome, t.id]) || []);
        console.log(`   ✓ ${temaMap.size} temas encontrados`);

        // 3. Buscar mapeamento de subtemas (nome -> id, com tema)
        console.log('📋 Buscando subtemas...');
        const { data: subtemas, error: subtemasError } = await supabase
            .from('subtemas')
            .select('id, nome, tema_id');

        if (subtemasError) throw subtemasError;
        // Map: "tema_nome|subtema_nome" -> id
        const subtemaMap = new Map<string, string>();
        subtemas?.forEach(s => {
            const tema = temas?.find(t => t.id === s.tema_id);
            if (tema) {
                subtemaMap.set(`${tema.nome}|${s.nome}`, s.id);
            }
        });
        console.log(`   ✓ ${subtemaMap.size} subtemas encontrados`);

        // 4. Buscar ou criar gabinete padrão
        console.log('🏛️  Configurando gabinete...');
        let { data: gabinete, error: gabineteError } = await supabase
            .from('gabinetes')
            .select('id')
            .eq('nome', 'Gabinete Vinicius Grossi')
            .single();

        if (gabineteError || !gabinete) {
            // Criar gabinete se não existir
            const { data: newGabinete, error: createError } = await supabase
                .from('gabinetes')
                .insert([{
                    nome: 'Gabinete Vinicius Grossi',
                    numero_gabinete: '#102',
                    partido: 'Partido Exemplo',
                    ativo: true
                }])
                .select()
                .single();

            if (createError) throw createError;
            gabinete = newGabinete;
        }
        console.log(`   ✓ Gabinete configurado: ${gabinete.id}`);

        // 5. Transformar e inserir atendimentos
        console.log('📝 Migrando atendimentos...');
        const atendimentosToInsert = MOCK_DATA.map((item) => {
            const bairroId = bairroMap.get(item.bairro);
            const temaId = temaMap.get(item.tema);
            const subtemaKey = `${item.tema}|${item.subtema}`;
            const subtemaId = subtemaMap.get(subtemaKey);

            return {
                protocolo: `AT-${item.id}`,
                gabinete_id: gabinete.id,
                data_hora: item.data_hora,
                canal: item.canal,
                tipo_interacao: item.tipo_interacao,
                tema_id: temaId || null,
                subtema_id: subtemaId || null,
                bairro_id: bairroId || null,
                resumo_demanda: item.resumo_demanda,
                status: item.status_demanda === 'Resolvida' ? 'Resolvida' :
                    item.status_demanda === 'Em andamento' ? 'Em andamento' : 'Nova',
                sentimento: item.sentimento,
                nota_satisfacao: item.nota_satisfacao
            };
        });

        // Inserir em lotes de 100
        const BATCH_SIZE = 100;
        let inserted = 0;

        for (let i = 0; i < atendimentosToInsert.length; i += BATCH_SIZE) {
            const batch = atendimentosToInsert.slice(i, i + BATCH_SIZE);
            const { error: insertError } = await supabase
                .from('atendimentos')
                .insert(batch);

            if (insertError) {
                console.error(`❌ Erro ao inserir lote ${i / BATCH_SIZE + 1}:`, insertError);
                throw insertError;
            }

            inserted += batch.length;
            console.log(`   ✓ ${inserted}/${MOCK_DATA.length} atendimentos inseridos`);
        }

        console.log('');
        console.log('✅ Migração concluída com sucesso!');
        console.log(`   📊 Total de atendimentos migrados: ${inserted}`);
        console.log('');

        return { success: true, inserted };
    } catch (error) {
        console.error('❌ Erro durante a migração:', error);
        throw error;
    }
}

// Executar se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    migrateMockDataToSupabase()
        .then(() => {
            console.log('Script finalizado.');
            process.exit(0);
        })
        .catch((err) => {
            console.error('Script falhou:', err);
            process.exit(1);
        });
}

export { migrateMockDataToSupabase };
