document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.warn('Aucun token trouvé, utilisateur non connecté.');
    afficherMessage('Non connecté');
    return;
  }

  fetch('/auth/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du profil.");
    }
    return response.json();
  })
  .then(data => {
    if (!data.success || !data.user) {
      afficherMessage('Profil non disponible');
      return;
    }

    const user = data.user;

    // Remplir les éléments du DOM
    document.getElementById('profil-email').innerText = user.email || 'Email non disponible';
    document.getElementById('profil-created').innerText = formatDate(user.created_at);
    document.getElementById('profil-id').innerText = user.id;

    // Optionnel : afficher une section uniquement si connectée
    document.getElementById('profil-section')?.classList.remove('hidden');

  })
  .catch(err => {
    console.error('Erreur lors de la récupération du profil :', err);
    afficherMessage('Erreur de connexion');
  });

  function afficherMessage(message) {
    const el = document.getElementById('profil-message');
    if (el) {
      el.innerText = message;
      el.classList.remove('hidden');
    }
  }

  function formatDate(iso) {
    const date = new Date(iso);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
});
