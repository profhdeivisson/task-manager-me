# Gerenciador de Tarefas

## Deploy
O projeto está disponível em: [https://task-manager-me.vercel.app/](https://task-manager-me.vercel.app/)

## Resumo do Projeto
Este projeto é um gerenciador de tarefas desenvolvido com React, TypeScript e Vite. Ele permite criar, organizar e gerenciar projetos e suas etapas, com uma interface responsiva que funciona bem tanto em desktop quanto em dispositivos móveis. O projeto utiliza Supabase como backend para armazenamento e persistência dos dados.

## Tecnologias Usadas
- React 18 com TypeScript
- Vite como bundler
- Tailwind CSS para estilização
- Supabase para backend e banco de dados
- @dnd-kit para funcionalidades de drag and drop
- SweetAlert2 para feedback visual e confirmações
- React Icons para ícones

## Principais Funcionalidades
- Criação, edição e exclusão de projetos
- Organização de tarefas em etapas (Planejamento, A iniciar, Em execução, Validação, Finalizados)
- Drag and drop para mover tarefas entre etapas
- Interface responsiva com menu lateral para desktop e menu hambúrguer para mobile
- Persistência dos dados no Supabase
- Validação e feedback visual para ações do usuário

## Como Rodar o Projeto

### Requisitos
- Node.js (versão recomendada: 18.x ou superior)
- npm (versão recomendada: 9.x ou superior) ou yarn

### Passos para rodar localmente
1. Clone este repositório:
   ```bash
   git clone https://github.com/profhdeivisson/task-manager-me.git
   cd task-manager-me
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Crie uma conta no [Supabase](https://supabase.com/) e configure um novo projeto de banco de dados.

4. Copie o arquivo de ambiente de exemplo para criar seu arquivo `.env`:
   ```bash
   cp .env.example .env
   ```

5. No arquivo `.env`, configure as variáveis de ambiente com a URL e a chave pública do seu projeto Supabase:
   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_ANON_KEY=sua-chave-anonima
   ```

6. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

7. Abra o navegador e acesse `http://localhost:5173` para usar o gerenciador de tarefas.

## Observações
- O projeto depende do Supabase para armazenar e recuperar os dados dos projetos e tarefas.
- Para usar o projeto localmente, é necessário ter uma conta no Supabase e configurar o banco de dados conforme descrito.
- O arquivo `.env` não deve ser compartilhado publicamente, pois contém chaves sensíveis.

---

Se precisar de ajuda para configurar o Supabase ou qualquer outra dúvida, fique à vontade para perguntar!

## ⚙️ Manutenção do banco de dados

Para evitar que o banco de dados no Supabase entre em modo de "pausa" (sleep mode) devido à inatividade, usamos um **cron job**. Um endpoint específico é acessado diariamente pelo serviço [**Uptime Robot**](https://uptimerobot.com/) para garantir que o banco permaneça sempre ativo e responsivo.
