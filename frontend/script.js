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

// Captura código de referência da URL
const urlParams = new URLSearchParams(window.location.search);
const refFromUrl = urlParams.get('ref') || '';
referralCodeInput.value = refFromUrl;

let ws; // variável global do WebSocket

registerForm.addEventListener('submit', async e => {
  e.preventDefault();

  // Validação simples
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const referralCode = referralCodeInput.value.trim();

  if (!name || !email || !password) return alert('Preencha todos os campos');
  if (!/\S+@\S+\.\S+/.test(email)) return alert('E-mail inválido');
  if (!/(?=.*[0-9])(?=.*[a-zA-Z]).{8,}/.test(password))
    return alert('Senha deve ter no mínimo 8 caracteres, letras e números');

  try {
    const res = await fetch('http://localhost:3000/api/usuarios/register', {
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

  try {
    const res = await fetch(`http://localhost:3000/api/usuarios/${email}`);
    const user = await res.json();

    if (res.ok) {
      profilePoints.textContent = user.points;

      const link = `${window.location.href.split('?')[0]}?ref=${referralCode}`;
      profileLink.textContent = link;

      copyBtn.onclick = () => {
        navigator.clipboard.writeText(link);
        alert('Link copiado!');
      };

      // Conecta ao WebSocket para atualizações em tempo real
      connectWebSocket(email);

    } else {
      alert(user.error || 'Erro ao carregar perfil');
    }
  } catch (err) {
    console.error(err);
    alert('Erro na conexão com o servidor');
  }
}

function connectWebSocket(email) {
  // Cria conexão WS
  ws = new WebSocket('ws://localhost:3000');

  ws.onopen = () => {
    console.log('Conectado ao servidor WebSocket');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Atualiza pontos apenas se for o usuário correto
    if (data.email === email) {
      profilePoints.textContent = data.points;
    }
  };

  ws.onclose = () => {
    console.log('WebSocket fechado, tentando reconectar em 3s...');
    setTimeout(() => connectWebSocket(email), 3000); // reconexão automática
  };

  ws.onerror = (err) => {
    console.error('Erro no WebSocket', err);
  };
}
