import { migrateMockDataToSupabase } from './scripts/migrateMockData';

// Componente de utilidade para executar a migração via UI
export function MigrationButton() {
    const [status, setStatus] = React.useState<'idle' | 'running' | 'success' | 'error'>('idle');
    const [message, setMessage] = React.useState('');

    const runMigration = async () => {
        setStatus('running');
        setMessage('Migrando dados...');

        try {
            const result = await migrateMockDataToSupabase();
            setStatus('success');
            setMessage(`✅ Migração concluída! ${result.inserted} atendimentos inseridos.`);
        } catch (error) {
            setStatus('error');
            setMessage(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '20px' }}>
            <h3>Migração de Dados MOCK_DATA → Supabase</h3>
            <button
                onClick={runMigration}
                disabled={status === 'running'}
                style={{
                    padding: '10px 20px',
                    backgroundColor: status === 'success' ? '#4CAF50' : '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: status === 'running' ? 'wait' : 'pointer',
                    opacity: status === 'running' ? 0.6 : 1
                }}
            >
                {status === 'running' ? 'Migrando...' : 'Migrar MOCK_DATA para Supabase'}
            </button>
            {message && (
                <p style={{
                    marginTop: '10px',
                    color: status === 'error' ? 'red' : status === 'success' ? 'green' : 'black'
                }}>
                    {message}
                </p>
            )}
        </div>
    );
}
