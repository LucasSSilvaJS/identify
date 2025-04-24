# Sistema de Gerenciamento de Casos Forenses

## Sobre o Projeto
Sistema web desenvolvido para gerenciamento de casos forenses, permitindo o controle de evidências, laudos e pacientes relacionados a cada caso.

## Funcionalidades Principais

### Casos
- Visualização de casos em análise e concluídos
- Cadastro de novos casos com detalhes e localização
- Visualização de estatísticas através de gráficos

### Evidências
- Cadastro de novas evidências
- Acompanhamento do status (Em andamento, Finalizado, Arquivado)
- Visualização de estatísticas

### Pacientes
- Cadastro de pacientes vinculados aos casos
- Gerenciamento de informações pessoais (Nome, CPF, RG)
- Controle de status do paciente (Ativo, Inativo, Em Tratamento)

### Laudos
- Geração de laudos técnicos
- Vinculação com casos específicos

## Tecnologias Utilizadas
- React.js
- React Router para navegação
- Recharts para visualização de dados
- Tailwind CSS para estilização
- Leaflet para mapas interativos

## Rotas da Aplicação
- `/` - Login
- `/cadastro` - Registro de usuário
- `/home` - Dashboard principal
- `/casos/novo` - Cadastro de novo caso
- `/casos` - Visualização de casos
- `/evidencias/novo` - Cadastro de evidências
- `/laudos/novo` - Geração de laudos
- `/pacientes/novo` - Cadastro de pacientes


## Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (versão 14 ou superior)
- NPM (Node Package Manager) ou Yarn

### Passos para Execução

1. Clone o repositório
2. Instale as dependências
3. Configure as variáveis de ambiente
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione as variáveis necessárias seguindo o exemplo do `.env.example`

4. Execute o projeto em modo desenvolvimento
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. Acesse o projeto
   - Abra o navegador em `http://localhost:3000`
   - Faça login com suas credenciais

### Comandos Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Inicia o servidor em modo produção
- `npm run test` - Executa os testes
