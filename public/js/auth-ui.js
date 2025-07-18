document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (!token) {
    // console.log('Aucun token trouvé');
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
      // console.log("Profil reçu :", data);
      afficherConnecté(data.user);
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
      <!-- etc -->
    `;
  }
}


function afficherNonConnecté() {
  const menu = document.getElementById('user-menu');
  menu.innerHTML = `
    <a href="/login.html">Connexion</a> /
    <a href="/signup.html">Inscription</a>
  `;
}

function logout() {
  localStorage.removeItem('token');
  location.reload();
}
