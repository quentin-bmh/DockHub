document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const userMenu = document.getElementById('user-menu');
  const dropdown = document.getElementById('dropdown-profile');
  const profileBtn = document.getElementById('profile-button');

  if (token && userMenu && dropdown && profileBtn) {
    try {
      const res = await fetch('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();

      const data = await res.json();
      document.getElementById('profile-username').textContent = data.user.username;
      document.getElementById('profile-email').textContent = data.user.email;

      userMenu.classList.remove('hidden');

      profileBtn.addEventListener('click', () => {
        dropdown.classList.toggle('hidden');
      });

      document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        location.href = '/login.html';
      });

    } catch (err) {
      console.warn("Utilisateur non connecté.");
    }
  }
});
