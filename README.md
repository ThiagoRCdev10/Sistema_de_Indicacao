# Sistema de Indicação (Referral System)

## Descrição
Aplicação web SPA para cadastro de usuários e sistema de pontos por indicação.

## Funcionalidades
- Cadastro de usuário com validação de e-mail e senha.
- Geração de link de indicação único.
- Atualização de pontuação ao indicar novos usuários.
- Página de cadastro e de perfil simples e responsivas.

## Estrutura
Sistema_de_Indicacao/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── models/
│   │   └── Usuario.js
│   └── routes/
│       └── userRoutes.js
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── imagens/
│   └── conexao.png
│
├── node_modules/
├── .gitattributes
├── package-lock.json
└── README.md

## Frontend

No Frontend foi utilizado HTML, CSS e JavaScript. A escolhas dessas teecnologias foi por questões de aprendizado mais aprofundado das tecnologias para melhor aprimorar os meus conhecimentos sobre elas antes usar um framework. Além de reduzir bem o uso de memória já terá menos arquivos se comparado com sites usado frameworks. Consequentemente com menos uso de memória o site carrega mais rápido também.

Se for utilizar o servidor remoto basta abrir o o link do site (que está hospedado no GitHub Pages) no navegador:

https://thiagorcdev10.github.io/Sistema_de_Indicacao/frontend/index.html

Se for utilizar o servidor local pode acessar pelo link do GitHub Pages também:

https://thiagorcdev10.github.io/Sistema_de_Indicacao/frontend/index.html 

Ou pode Abrir o arquivo que se encontra em:

Sistema_de_Indicacao/
├── frontend/
│ ├── index.html

O formulário de cadastro está disponível na página inicial.
O link de indicação será copiado clicando no botão "Copiar Link".

## Backend

Para o Backend foi utilizado o Node.js. Os motivos para essa excolha foram:

Node.js usa JavaScript tanto no Frontend Quanto no Backend. Isso permite o reaproveitamento de código, padronização da linguagem e facilitação da comunicação entre frontend e backend.
O Node.js tem um gerenciador de pacotes (NPM) com milhões de bibliotecas prontas. Isso economiza tempo, porque você não precisa reinventar certas funcionalidades

O Backend pode rodar tanto localmente quanto remotamente pois ele também foi hospedado na plataforma de hospedagem `Render`.

Caso o servidor remoto não esteja funcionando ou esteja desativado também funciona localmente.

Se for utilizar o servidor remoto basta abrir o link do site (que está hospedado no GitHub Pages) no navegador:
https://thiagorcdev10.github.io/Sistema_de_Indicacao/frontend/index.html

Caso contrario além de será necessário seguir o passo a passo a seguir:

1. Entre na pasta `backend/` por meio do comando cd no Terminal:
    cd backend
2. Inicie o servidor por meio do seguinte comando no terminal:  
    node server.js

Se der certo aparecerá as mensagens a seguir no terminal: 
🚀 Servidor rodando na porta 3000
✅ MongoDB conectado ao banco BancoDeDados!
Por fim abra o arquivo index.html no navegador ou coloque o link do GitHub Pages:
https://thiagorcdev10.github.io/Sistema_de_Indicacao/frontend/index.html 

## Banco de Dados
- O Banco de Dados foi o MongoDB Atlas
- O motivo da escolha foi:
    Funciona perfeitamente com Node.js (Mongoose)
    O Atlas oferece um plano gratuito que inclui 512 MB de armazenamento e Backup automático.
    Posso acessar remotamente o banco.

A estrutura basica do banco de dados no MongoDB é:

Um banco de dados chamado "BancoDeDados" e que possui dentro desse banco uma coleção chamada de "usuarios". Dentro de "usuarios" é onde são armazenados todos os usuarios que fazem o cadastro.

## Colaboração com IA
Para esse projeto foi Utilizado O ChatGPT como uma ferramenta auxiliar. Essa ferramenta foi aproveitada para gerar um template inicial que foi desenvolvido e alterado ao longo da implementação do site corrigindo incompatibilidades e adicionando funcionalidades que faltavam. 
A IA foi utilizada para dar uma ideia inicial do design do site, para criação de códigos, explicação de mensagens de erro, explicação de assuntos teóricos sobre CSS, HTML, JavaScritp, MongoDB, Node.js, plataformas de hospedagem, etc.
Neste projeto, por meio da IA, foi possiível aprender muitos conceitos teóricos utilizados na implementação do site, além de utilizar ela como meio de agilizar minhas tarefas, deixando serviços mais "braçais" para a IA e os que exigiam a parte de compreenssão e raciocínio para o desenvolvedor.

