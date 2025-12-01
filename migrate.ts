import { supabase } from '../supabaseClient.ts';
import { MOCK_DATA } from '../constants.tsx';

/**
 * Script para migrar MOCK_DATA para o Supabase
 */
async function migrateMockDataToSupabase() {
    try {
        console.log('🚀 Iniciando migração de MOCK_DATA para Supabase...');

        // 1. Buscar mapeamento de bairros
        console.log('📍 Buscando bairros...');
        const { data: bairros } = await supabase
            .from('bairros')
            .select('id, nome');

        const bairroMap = new Map(bairros?.map(b => [b.nome, b.id]) || []);
        console.log(`   ✓ ${bairroMap.size} bairros encontrados`);

        // 2. Buscar mapeamento de temas
        console.log('📚 Buscando temas...');
        const { data: temas } = await supabase
            .from('temas')
            .select('id, nome');

        const temaMap = new Map(temas?.map(t => [t.nome, t.id]) || []);
        console.log(`   ✓ ${temaMap.size} temas encontrados`);

        // 3. Buscar mapeamento de subtemas
        console.log('📋 Buscando subtemas...');
        const { data: subtemas } = await supabase
            .from('subtemas')
            .select('id, nome, tema_id');

        const subtemaMap = new Map();
        subtemas?.forEach(s => {
            const tema = temas?.find(t => t.id === s.tema_id);
            if (tema) {
                subtemaMap.set(`${tema.nome}|${s.nome}`, s.id);
            }
        });
        console.log(`   ✓ ${subtemaMap.size} subtemas encontrados`);

        // 4. Buscar ou criar gabinete
        console.log('🏛️  Configurando gabinete...');
        let { data: gabinete } = await supabase
            .from('gabinetes')
            .select('id')
            .eq('nome', 'Gabinete Vinicius Grossi')
            .maybeSingle();

        if (!gabinete) {
            const { data: newGabinete } = await supabase
                .from('gabinetes')
                .insert([{
                    nome: 'Gabinete Vinicius Grossi',
                    numero_gabinete: '#102',
                    ativo: true
                }])
                .select()
                .single();

            gabinete = newGabinete;
        }
        console.log(`   ✓ Gabinete configurado`);

        // 5. Transformar e inserir atendimentos
        console.log('📝 Migrando atendimentos...');
        const atendimentosToInsert = MOCK_DATA.map((item) => {
            const bairroId = bairroMap.get(item.bairro);
            const temaId = temaMap.get(item.tema);
            const subtemaKey = `${item.tema}|${item.subtema}`;
            const subtemaId = subtemaMap.get(subtemaKey);

            return {
                protocolo: `AT-${item.id}`,
                gabinete_id: gabinete!.id,
                data_hora: item.data_hora,
                canal: item.canal,
                tipo_interacao: item.tipo_interacao,
                tema_id: temaId || null,
                subtema_id: subtemaId || null,
                bairro_id: bairroId || null,
                resumo_demanda: item.resumo_demanda,
                status: item.status_demanda,
                sentimento: item.sentimento,
                nota_satisfacao: item.nota_satisfacao
            };
        });

        // Inserir em lotes
        const BATCH_SIZE = 100;
        let inserted = 0;

        for (let i = 0; i < atendimentosToInsert.length; i += BATCH_SIZE) {
            const batch = atendimentosToInsert.slice(i, i + BATCH_SIZE);
            const { error } = await supabase
                .from('atendimentos')
                .insert(batch);

            if (error) {
                console.error(`❌ Erro ao inserir lote:`, error);
                throw error;
            }

            inserted += batch.length;
            console.log(`   ✓ ${inserted}/${MOCK_DATA.length} atendimentos inseridos`);
        }

        console.log('');
        console.log('✅ Migração concluída com sucesso!');
        console.log(`   📊 Total de atendimentos migrados: ${inserted}`);

        return { success: true, inserted };
    } catch (error) {
        console.error('❌ Erro durante a migração:', error);
        throw error;
    }
}

// Executar
migrateMockDataToSupabase()
    .then(() => {
        console.log('Script finalizado.');
    })
    .catch((err) => {
        console.error('Script falhou:', err);
    });
