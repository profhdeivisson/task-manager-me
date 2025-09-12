import { createClient } from '@supabase/supabase-js';

export default async function handler(request, response) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    if (error) {
      console.log('Erro na consulta:', error);
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

export const config = {
  api: {
    bodyParser: false,
  },
};
