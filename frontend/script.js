const registerForm = document.getElementById('registerForm');
const profileSection = document.getElementById('profile-section');
const registerSection = document.getElementById('register-section');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const referralCodeInput = document.getElementById('referralCode');

const profileName = document.getElementById('profile-name');
const profilePoints = document.getElementById('profile-points');
const profileLink = document.getElementById('profile-link');
const copyBtn = document.getElementById('copyBtn');

// Detecta automaticamente a URL do backend
const BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://sistema-de-indicacao-yqpi.onrender.com';

// Captura código de referência da URL corretamente
const urlParams = new URLSearchParams(window.location.search);
const refFromUrl = urlParams.get('ref') || '';
referralCodeInput.value = refFromUrl; // só o código, sem URL

registerForm.addEventListener('submit', async e => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const referralCode = referralCodeInput.value.trim(); // só o código

  if (!name || !email || !password) return alert('Preencha todos os campos');
  if (!/\S+@\S+\.\S+/.test(email)) return alert('E-mail inválido');
  if (!/(?=.*[0-9])(?=.*[a-zA-Z]).{8,}/.test(password))
    return alert('Senha deve ter no mínimo 8 caracteres, letras e números');

  try {
    const res = await fetch(`${BACKEND_URL}/api/usuarios/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, referralCode })
    });

    const data = await res.json();

    if (res.ok) {
      showProfile(name, email, data.referralCode);
    } else {
      alert(data.error || 'Erro ao cadastrar');
    }
  } catch (err) {
    console.error(err);
    alert('Erro na conexão com o servidor');
  }
});

async function showProfile(name, email, referralCode) {
  registerSection.classList.add('hidden');
  profileSection.classList.remove('hidden');

  profileName.textContent = name;

  async function atualizarPontos() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/usuarios/${email}`);
      const user = await res.json();

      if (res.ok) {
        profilePoints.textContent = user.points;
      } else {
        console.error('Erro ao atualizar pontos:', user.error);
      }
    } catch (err) {
      console.error('Erro na conexão com o servidor:', err);
    }
  }

  await atualizarPontos();
  setInterval(atualizarPontos, 1000);

  // Gera link de indicação apenas com o código, sem parâmetros extras
  const currentUrl = window.location.href.split('?')[0];
  const link = `${currentUrl}?ref=${referralCode}`;
  profileLink.textContent = link;

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(link);
    alert('Link copiado!');
  };
}
