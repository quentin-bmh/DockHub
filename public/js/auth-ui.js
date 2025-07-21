document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (!token) {
    afficherNonConnecté();
    return;
  }

  fetch('/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Échec récupération profil');
      return res.json();
    })
    .then(data => {
      if (data?.user) afficherConnecté(data.user);
      else afficherNonConnecté();
    })
    .catch(err => {
      console.error("Erreur lors de la récupération du profil :", err);
      afficherNonConnecté();
    });
});

function afficherConnecté(user) {
  const container = document.getElementById('auth-container');
  if (container) {
    container.innerHTML = `
      <p>Bienvenue, ${user.username}</p>
      <!-- autres éléments selon contexte -->
    `;
  }

  const userMenu = document.getElementById('user-menu');
  const profileUsername = document.getElementById('profile-username');
  const profileEmail = document.getElementById('profile-email');

  if (userMenu) userMenu.classList.remove('hidden');
  if (profileUsername) profileUsername.textContent = user.username || '...';
  if (profileEmail) profileEmail.textContent = user.email || '...';
}

function afficherNonConnecté() {
  const menu = document.getElementById('user-menu');
  if (menu) {
    menu.innerHTML = `
      <a href="/login.html">Connexion</a> /
      <a href="/signup.html">Inscription</a>
    `;
  }
}
