const http = require('http');
const mongoose = require('mongoose');
const url = require('url');
const crypto = require('crypto');
const WebSocket = require('ws');
const Usuario = require('./models/Usuario');

// Configurações
const PORT = 3000;
const MONGO_URI = 'mongodb+srv://thiago:kiarakiara12051997@cluster0.u788how.mongodb.net/';

// Conecta ao MongoDB
mongoose.connect(MONGO_URI, { dbName: 'BancoDeDados' })
  .then(() => console.log('✅ MongoDB conectado ao banco BancoDeDados!'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Função para ler corpo da requisição
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

// Cria servidor HTTP
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);

  // --- POST /api/usuarios/register ---
  if (req.method === 'POST' && parsedUrl.pathname === '/api/usuarios/register') {
    try {
      const data = await getRequestBody(req);
      const { name, email, password, referralCode } = data;

      if (!name || !email || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Preencha todos os campos.' }));
      }

      const existing = await Usuario.findOne({ email });
      if (existing) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'E-mail já cadastrado.' }));
      }

      const newReferralCode = crypto.randomBytes(4).toString('hex');

      const novoUsuario = new Usuario({
        name,
        email,
        password,
        referralCode: newReferralCode,
        referredBy: referralCode || null
      });

      await novoUsuario.save();

      // Atualiza pontos de quem indicou
      if (referralCode) {
        const referrer = await Usuario.findOne({ referralCode });
        if (referrer) {
          referrer.points += 1;
          await referrer.save();
          notifyPointsUpdate(referrer.email); // ⚡ Notifica via WS
        }
      }

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'Usuário registrado com sucesso!',
        referralCode: newReferralCode
      }));

    } catch (err) {
      console.error('Erro POST /api/usuarios/register:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro ao registrar usuário.' }));
    }
    return;
  }

  // --- GET /api/usuarios ---
  if (req.method === 'GET' && parsedUrl.pathname === '/api/usuarios') {
    try {
      const usuarios = await Usuario.find();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(usuarios));
    } catch (err) {
      console.error('Erro GET /api/usuarios:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro ao buscar usuários.' }));
    }
    return;
  }

  // --- GET /api/usuarios/:email ---
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
      console.error('Erro GET /api/usuarios/:email:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro ao buscar usuário.' }));
    }
    return;
  }

  // Rota não encontrada
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Rota não encontrada.' }));
});

// --- WebSocket ---
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Cliente WS conectado');

  ws.on('close', () => {
    console.log('Cliente WS desconectado');
  });
});

// Função para enviar atualização de pontos via WS
async function notifyPointsUpdate(email) {
  const user = await Usuario.findOne({ email });
  if (!user) return;

  const payload = JSON.stringify({
    email: user.email,
    points: user.points
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// Inicia servidor
server.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
