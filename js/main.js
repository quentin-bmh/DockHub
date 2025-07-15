let allProjects = [];
let activeTags = new Set();

const searchInput = document.getElementById('searchInput');
const filtersContainer = document.getElementById('filters');
const projectsContainer = document.getElementById('projectsContainer');

fetch('projects.json')
  .then(res => res.json())
  .then(projects => {
    allProjects = projects;
    generateFilterButtons(projects);
    renderProjects(projects);
  });

function generateFilterButtons(projects) {
  const allTags = new Set(projects.flatMap(p => p.tags));
  filtersContainer.innerHTML = '';

  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.textContent = tag;
    btn.className = 'tag-btn px-3 py-1 rounded-full text-sm bg-gray-200 hover:bg-blue-200 text-gray-700';
    btn.dataset.tag = tag;

    btn.addEventListener('click', () => {
      if (activeTags.has(tag)) {
        activeTags.delete(tag);
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
      } else {
        activeTags.add(tag);
        btn.classList.remove('bg-gray-200', 'text-gray-700');
        btn.classList.add('bg-blue-600', 'text-white');
      }
      applyFilters();
    });

    filtersContainer.appendChild(btn);
  });
}

function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();

  const filtered = allProjects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm);
    const matchesTags = activeTags.size === 0 || p.tags.some(tag => activeTags.has(tag));
    return matchesSearch && matchesTags;
  });

  renderProjects(filtered);
}

function renderProjects(projects) {
  projectsContainer.innerHTML = '';
  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden group cursor-pointer';
    card.onclick = () => window.location.href = `project.html?id=${project.id}`;

    card.innerHTML = `
      <img src="${project.image}" alt="${project.title}" class="w-full h-40 object-cover group-hover:opacity-90 transition"/>
      <div class="p-4 relative">
        <h2 class="text-lg font-semibold mb-1">${project.title}</h2>
        <p class="text-sm text-gray-600 mb-3 line-clamp-3">${project.description}</p>

        <div class="flex flex-wrap gap-2 text-xs mb-2">
          ${project.tags.map(tag => `<span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">${tag}</span>`).join('')}
        </div>

        <div class="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
          ${project.stack.map(tech => `<span class="bg-gray-100 px-2 py-0.5 rounded">${tech}</span>`).join('')}
        </div>

        <button onclick="event.stopPropagation(); window.location.href='project.html?id=${project.id}'"
          class="absolute bottom-3 right-3 text-sm text-blue-600 hover:underline">
          En savoir plus →
        </button>
      </div>
    `;
    projectsContainer.appendChild(card);
  });
}

// Recherche
searchInput.addEventListener('input', applyFilters);
