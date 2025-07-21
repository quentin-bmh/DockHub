document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (!token) {
    // console.warn('Aucun token trouvé, utilisateur non connecté.');
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
    console.log('User profile:', user);
    
    const usernameElem = document.getElementById('profile-username');
    if (usernameElem) usernameElem.innerText = user.username || 'Nom non disponible';

    const emailElem = document.getElementById('profile-email');
    if (emailElem) emailElem.innerText = user.email || 'Email non disponible';


    const createdElem = document.getElementById('profil-created');
    if (createdElem) createdElem.innerText = formatDate(user.created_at);

    const idElem = document.getElementById('profil-id');
    if (idElem) idElem.innerText = user.id;

    const sectionElem = document.getElementById('profil-section');
    if (sectionElem) sectionElem.classList.remove('hidden');
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
    if (!iso) return 'Date non disponible';
    const date = new Date(iso);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
});
