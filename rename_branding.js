const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css') || file.endsWith('.json')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('c:/Users/dhruv/OneDrive/Desktop/git.new/files/files/korean-ai-platform/apps/web/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const replacements = [
    [/korean-ai-platform/gi, 'archon-platform'],
    [/DevForge System/g, 'Archon Platform'],
    [/DevForge Korea/g, 'Archon Platform'],
    [/DevForge/g, 'Archon'],
    [/devforge/g, 'archon'],
  ];

  replacements.forEach(([regex, replacement]) => {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
