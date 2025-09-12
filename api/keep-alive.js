// api/keep-alive.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(request, response) {
  // 1. Obter variáveis de ambiente (configure na Vercel depois)
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  // 2. Criar cliente Supabase
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 3. Fazer uma consulta simples para "acordar" o DB
    const { data, error } = await supabase
      .from('projects') // Use qualquer tabela que exista no seu projeto
      .select('id')
      .limit(1);

    if (error) {
      console.log('Erro na consulta:', error);
      // Mesmo com erro, retornamos sucesso para o serviço de cron
      return response.status(200).json({
        message: 'Requisição recebida, mas com erro no DB',
        error: error.message,
      });
    }

    console.log('Supabase acordado com sucesso!');
    response.status(200).json({
      message: 'Projeto mantido vivo!',
      data: data,
    });
  } catch (error) {
    console.log('Erro na função:', error);
    response.status(200).json({
      message: 'Requisição recebida com erro geral',
    });
  }
}

// Configuração importante para a Vercel
export const config = {
  api: {
    bodyParser: false,
  },
};
