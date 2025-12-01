# Configuração do Supabase

Este projeto está conectado ao projeto Supabase **N8N**.

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://nqubjiosnlaatxxamiut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xdWJqaW9zbmxhYXR4eGFtaXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjQyNjMsImV4cCI6MjA2Mzk0MDI2M30.P3q1w2s2qHrpJU9AxrxRj9_uaryMLD110yIO9sWxStI
```

## Uso

O cliente Supabase está configurado em `supabaseClient.ts`. Importe-o em seus componentes:

```typescript
import { supabase } from './supabaseClient';

// Exemplo: Buscar dados de uma tabela
const { data, error } = await supabase
  .from('sua_tabela')
  .select('*');
```

## Próximos Passos

1. **Criar tabelas** no Supabase para armazenar os dados do dashboard
2. **Migrar do MOCK_DATA** para dados reais do Supabase
3. **Configurar autenticação** (se necessário)

## Importante

⚠️ O arquivo `.env.local` não deve ser commitado no Git (já está no `.gitignore`).
