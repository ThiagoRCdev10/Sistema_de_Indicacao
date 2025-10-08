const http = require('http');
const mongoose = require('mongoose');
const url = require('url');
const crypto = require('crypto');
const Usuario = require('./models/Usuario');

// Configurações
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://thiago:kiarakiara12051997@cluster0.u788how.mongodb.net/';

// Conecta ao MongoDB (especificando o banco de dados BancoDeDados)
mongoose.connect(MONGO_URI, { dbName: 'BancoDeDados' })
  .then(() => console.log('✅ MongoDB conectado ao banco BancoDeDados!'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Função para ler o corpo da requisição com segurança
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (err) {
        reject(new Error('JSON inválido no corpo da requisição.'));
      }
    });
    req.on('error', reject);
  });
}

// Servidor HTTP
const server = http.createServer(async (req, res) => {
  // Cabeçalhos CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);

  // Rota POST /api/usuarios/register
  if (req.method === 'POST' && parsedUrl.pathname === '/api/usuarios/register') {
    try {
      const data = await getRequestBody(req);
      const { name, email, password, referralCode } = data;

      // Verifica campos obrigatórios
      if (!name || !email || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Preencha todos os campos.' }));
      }

      // Verifica se já existe usuário com esse e-mail
      const existing = await Usuario.findOne({ email });
      if (existing) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'E-mail já cadastrado.' }));
      }

      // Gera código de referência único
      const newReferralCode = crypto.randomBytes(4).toString('hex');

      // Cria novo usuário
      const novoUsuario = new Usuario({
        name,
        email,
        password,
        referralCode: newReferralCode,
        referredBy: referralCode || null
      });

      await novoUsuario.save();

      // Se foi indicado, soma ponto para quem indicou
      if (referralCode) {
        const referrer = await Usuario.findOne({ referralCode });
        if (referrer) {
          referrer.points += 1;
          await referrer.save();
        }
      }

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'Usuário registrado com sucesso!',
        referralCode: newReferralCode
      }));

    } catch (err) {
      console.error('Erro na rota POST /api/usuarios/register:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro ao registrar usuário.' }));
    }
    return;
  }

  // Rota GET /api/usuarios
  if (req.method === 'GET' && parsedUrl.pathname === '/api/usuarios') {
    try {
      const usuarios = await Usuario.find();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(usuarios));
    } catch (err) {
      console.error('Erro na rota GET /api/usuarios:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro ao buscar usuários.' }));
    }
    return;
  }

  // Rota GET /api/usuarios/:email (busca por e-mail)
  if (req.method === 'GET' && parsedUrl.pathname.startsWith('/api/usuarios/')) {
    try {
      const email = decodeURIComponent(parsedUrl.pathname.split('/').pop());
      const usuario = await Usuario.findOne({ email });

      if (!usuario) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Usuário não encontrado.' }));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(usuario));

    } catch (err) {
      console.error('Erro na rota GET /api/usuarios/:email:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro ao buscar usuário.' }));
    }
    return;
  }

  // Rota não encontrada
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Rota não encontrada.' }));
});

// Inicia o servidor
server.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
