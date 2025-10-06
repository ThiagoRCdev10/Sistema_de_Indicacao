# Sistema de Indicação (Referral System)

## Descrição
Aplicação web SPA para cadastro de usuários e sistema de pontos por indicação.

## Estrutura
referral-system/
├── backend/
│ ├── server.js
│ ├── package.json
│ ├── models/
│ └── routes/
├── frontend/
│ ├── index.html
│ ├── style.css
│ └── script.js
└── README.md

## Backend
1. Entre na pasta `backend/`
2. Instale dependências:  
npm install
3. Inicie o servidor:  
npm start
Servidor rodando em `http://localhost:3000`

## Frontend
1. Abra o arquivo `frontend/index.html` no navegador.
2. O formulário de cadastro está disponível na página inicial.
3. O link de indicação será copiado clicando no botão "Copiar Link".

## Banco de Dados
- MongoDB Atlas
- Conexão já configurada em `server.js`:
mongoose.connect('mongodb+srv://usuario:123456789@cluster0.u788how.mongodb.net
/BancoDeDados?retryWrites=true&w=majority');

## Funcionalidades
- Cadastro de usuário com validação de e-mail e senha.
- Geração de link de indicação único.
- Atualização de pontuação ao indicar novos usuários.
- Página de perfil simples e responsiva.
