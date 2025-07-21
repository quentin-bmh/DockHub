// index.js
document.addEventListener('DOMContentLoaded', () => {
  const authButtons = document.getElementById('auth-buttons');
  const userMenu = document.getElementById('user-menu');
  const profileBtn = document.getElementById('profile-button');
  const dropdown = document.getElementById('dropdown-profile');
  const logoutBtn = document.getElementById('logout-btn');

  const token = localStorage.getItem('token');

  if (token) {
    fetch('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      console.log('Profile data:', data);
      if (data.success && data.user) {
        authButtons.classList.add('hidden');
        userMenu.classList.remove('hidden');

        document.getElementById('profile-username').innerText = data.user.username || 'N/A';
        document.getElementById('profile-email').innerText = data.user.email || 'N/A';
      } else {
        authButtons.classList.remove('hidden');
        userMenu.classList.add('hidden');
      }
    })
    .catch(() => {
      authButtons.classList.remove('hidden');
      userMenu.classList.add('hidden');
    });
  } else {
    authButtons.classList.remove('hidden');
    userMenu.classList.add('hidden');
  }

  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      dropdown.classList.toggle('hidden');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.reload();
    });
  }

  if (userMenu && dropdown) {
    document.addEventListener('click', (e) => {
      if (!userMenu.contains(e.target) && !dropdown.classList.contains('hidden')) {
        dropdown.classList.add('hidden');
      }
    });
  }

});
