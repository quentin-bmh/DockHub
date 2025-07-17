let allProjects = [];
let activeTags = new Set();

const searchInput = document.getElementById('searchInput');
const filtersContainer = document.getElementById('filters');
const projectsContainer = document.getElementById('projectsContainer');

fetch('projects.json')
  .then(response => response.json())
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

function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden group cursor-pointer';
  card.onclick = () => window.open(project.url, '_blank');

  const image = document.createElement('img');
  image.src = `${project.image}`;
  image.alt = project.name;
  image.className = 'w-full h-40 object-cover group-hover:opacity-90 transition';

  const content = document.createElement('div');
  content.className = 'p-4 relative';

  const title = document.createElement('h2');
  title.className = 'text-lg font-semibold mb-1';
  title.textContent = project.title;

  const description = document.createElement('p');
  description.className = 'text-sm text-gray-600 mb-3 line-clamp-3';
  description.textContent = project.description;

  const tags = document.createElement('div');
  tags.className = 'flex flex-wrap gap-2 text-xs mb-2';
  project.tags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full';
    span.textContent = tag;
    tags.appendChild(span);
  });

  const stack = document.createElement('div');
  stack.className = 'flex flex-wrap gap-2 text-xs text-gray-500 mb-3';
  project.stack.forEach(tech => {
    const span = document.createElement('span');
    span.className = 'bg-gray-100 px-2 py-0.5 rounded';
    span.textContent = tech;
    stack.appendChild(span);
  });

  const moreBtn = document.createElement('button');
  moreBtn.className = 'absolute bottom-3 right-3 text-sm text-blue-600 hover:underline';
  moreBtn.textContent = 'En savoir plus →';
  moreBtn.onclick = (e) => {
    e.stopPropagation();
    window.location.href = `project.html?id=${project.id}`;
  };

  content.append(title, description, tags, stack, moreBtn);
  card.append(image, content);

  return card;
}

function renderProjects(projects) {
  projectsContainer.innerHTML = '';
  projects.forEach(project => {
    const card = createProjectCard(project);
    projectsContainer.appendChild(card);
  });
}

searchInput.addEventListener('input', applyFilters);
