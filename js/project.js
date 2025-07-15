// Récupérer l'ID du projet depuis l'URL
const params = new URLSearchParams(window.location.search);
const projectId = params.get('id');

if (!projectId) {
  document.getElementById('projectDetails').innerHTML = "<p>Projet introuvable.</p>";
} else {
  fetch('projects.json')
    .then(res => res.json())
    .then(projects => {
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        document.getElementById('projectDetails').innerHTML = "<p>Projet non trouvé.</p>";
        return;
      }

      // Injecter le contenu
      document.getElementById('projectDetails').innerHTML = `
        <h1 class="text-3xl font-bold mb-4">${project.title}</h1>
        <img src="${project.image}" alt="${project.title}" class="rounded-lg mb-6 max-h-64 object-contain mx-auto"/>

        <p class="text-lg mb-4">${project.description}</p>

        <div class="mb-4">
          <h3 class="font-semibold">Technologies :</h3>
          <div class="flex flex-wrap gap-2 mt-1">
            ${project.stack.map(tech => `<span class="bg-gray-100 px-3 py-1 rounded text-sm">${tech}</span>`).join('')}
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-semibold">Catégories :</h3>
          <div class="flex flex-wrap gap-2 mt-1">
            ${project.tags.map(tag => `<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">${tag}</span>`).join('')}
          </div>
        </div>

        <a href="${project.url}" target="_blank" class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          🔗 Accéder au projet
        </a>
      `;
    });
}
