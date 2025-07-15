const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'template', 'project.template.html');
const outputDir = path.join(__dirname, 'projects');
const projectsData = require('../dockhub/projects.json');

// Lire le template HTML
const template = fs.readFileSync(templatePath, 'utf8');

// Créer le dossier `projects/` s'il n'existe pas
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Pour chaque projet : créer une page HTML dédiée
projectsData.forEach(project => {
  const filled = template
    .replace(/{{title}}/g, project.title)
    .replace(/{{description}}/g, project.description)
    .replace(/{{image}}/g, project.image)
    .replace(/{{url}}/g, project.url)
    .replace(/{{tags}}/g, project.tags.map(tag =>
      `<span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">${tag}</span>`).join(' ')
    )
    .replace(/{{stack}}/g, project.stack.map(tech =>
      `<span class="bg-gray-100 text-gray-800 px-2 py-0.5 rounded">${tech}</span>`).join(' ')
    );

  const filePath = path.join(outputDir, `${project.id}.html`);
  fs.writeFileSync(filePath, filled, 'utf8');
  console.log(`✅ Page générée : ${filePath}`);
});
