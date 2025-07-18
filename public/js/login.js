document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      document.getElementById('loginError').textContent = data.message || "Erreur lors de la connexion";
      document.getElementById('loginError').classList.remove('hidden');
    } else {
      localStorage.setItem('token', data.token); // tu peux aussi le stocker en cookie si tu préfères
      window.location.href = '/'; // redirige vers l’accueil ou dashboard
    }
  } catch (err) {
    document.getElementById('loginError').textContent = "Erreur réseau";
    document.getElementById('loginError').classList.remove('hidden');
  }
});
