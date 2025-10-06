const Usuario = require('../models/Usuario');
const crypto = require('crypto');

// Função para registrar um novo usuário
async function registerUsuario(req, res) {
  try {
    const { name, email, password, referralCode } = req.body;

    // Validação básica
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos.' });
    }

    // Verifica se o usuário já existe
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já registrado.' });
    }

    // Gera um código de referência único
    const newReferralCode = crypto.randomBytes(4).toString('hex');

    // Cria o novo usuário
    const usuario = new Usuario({
      name,
      email,
      password,
      referralCode: newReferralCode,
      referredBy: referralCode || null
    });

    await usuario.save();

    // Atualiza pontos do usuário que indicou
    if (referralCode) {
      const referrer = await Usuario.findOne({ referralCode });
      if (referrer) {
        referrer.points += 1;
        await referrer.save();
      }
    }

    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      referralCode: newReferralCode
    });

  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}

// Função para buscar usuário pelo e-mail
async function getUsuarioByEmail(req, res) {
  try {
    const { email } = req.params;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json(usuario);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}

module.exports = {
  registerUsuario,
  getUsuarioByEmail
};
