import { NextRequest, NextResponse } from 'next/server';
import { generateDocumentation, generateRepoDocumentation } from '@/lib/gemini/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode } = body;

    // ====== REPO MODE: Full GitHub Repository Analysis ======
    if (mode === 'repo') {
      const { repoUrl } = body;

      if (!repoUrl || !repoUrl.includes('github.com')) {
        return NextResponse.json(
          { error: 'A valid GitHub repository URL is required' },
          { status: 400 }
        );
      }

      // Extract owner/repo from URL
      const urlParts = repoUrl.replace(/\.git$/, '').replace(/\/$/, '').replace('https://github.com/', '').split('/');
      const owner = urlParts[0];
      const repo = urlParts[1];

      if (!owner || !repo) {
        return NextResponse.json(
          { error: 'Could not parse GitHub owner/repo from the URL. Expected format: https://github.com/owner/repo' },
          { status: 400 }
        );
      }

      // Fetch real data from GitHub API
      let repoData: any = null;
      let readmeContent = '';
      let languages: any = {};
      let repoTree: any[] = [];
      let packageJson: any = null;

      const githubHeaders: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Archon-Platform',
      };
      if (process.env.GITHUB_TOKEN) {
        githubHeaders['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      }

      try {
        // 1. Fetch repo metadata
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: githubHeaders });
        if (!repoRes.ok) {
          const errData = await repoRes.json().catch(() => ({}));
          if (repoRes.status === 404) {
            return NextResponse.json({ error: 'Repository not found. It may be private or the URL is incorrect.' }, { status: 404 });
          }
          return NextResponse.json({ error: errData.message || 'Failed to fetch repository from GitHub' }, { status: repoRes.status });
        }
        repoData = await repoRes.json();

        // 2. Fetch README
        const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers: githubHeaders });
        if (readmeRes.ok) {
          const readmeData = await readmeRes.json();
          readmeContent = Buffer.from(readmeData.content || '', 'base64').toString('utf-8');
        }

        // 3. Fetch languages breakdown
        const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers: githubHeaders });
        if (langRes.ok) {
          languages = await langRes.json();
        }

        // 4. Fetch file tree (first level + some depth)
        const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`, { headers: githubHeaders });
        if (treeRes.ok) {
          const treeData = await treeRes.json();
          repoTree = (treeData.tree || []).slice(0, 200); // Limit to 200 entries
        }

        // 5. Try to fetch package.json for dependencies
        const pkgRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, { headers: githubHeaders });
        if (pkgRes.ok) {
          const pkgData = await pkgRes.json();
          try {
            packageJson = JSON.parse(Buffer.from(pkgData.content || '', 'base64').toString('utf-8'));
          } catch { /* ignore parse errors */ }
        }
      } catch (fetchError) {
        console.error('GitHub API fetch error:', fetchError);
        // Fall back to AI-only analysis if GitHub API fails
      }

      // Build a rich context for the AI
      const totalBytes = Object.values(languages).reduce((sum: number, val: any) => sum + (val as number), 0) as number;
      const languageBreakdown = Object.entries(languages)
        .map(([lang, bytes]) => `- ${lang}: ${((bytes as number / totalBytes) * 100).toFixed(1)}%`)
        .join('\n');

      const fileList = repoTree
        .filter((item: any) => item.type === 'blob')
        .map((item: any) => item.path)
        .slice(0, 100)
        .join('\n');

      const dirList = repoTree
        .filter((item: any) => item.type === 'tree')
        .map((item: any) => item.path)
        .join('\n');

      const deps = packageJson ? {
        dependencies: Object.keys(packageJson.dependencies || {}),
        devDependencies: Object.keys(packageJson.devDependencies || {}),
      } : null;

      // If we have Gemini configured, use AI for comprehensive analysis
      if (process.env.GEMINI_API_KEY) {
        try {
          const { geminiModel } = await import('@/lib/gemini/client');

          const prompt = `You are an expert software documentation analyst. Generate a COMPREHENSIVE analysis document for this GitHub repository.

REPOSITORY DATA:
- Name: ${repoData?.full_name || `${owner}/${repo}`}
- Description: ${repoData?.description || 'No description'}
- Primary Language: ${repoData?.language || 'Unknown'}
- Stars: ${repoData?.stargazers_count || 0} | Forks: ${repoData?.forks_count || 0} | Open Issues: ${repoData?.open_issues_count || 0}
- Created: ${repoData?.created_at || 'Unknown'} | Last Updated: ${repoData?.updated_at || 'Unknown'}
- License: ${repoData?.license?.name || 'Not specified'}
- Default Branch: ${repoData?.default_branch || 'main'}
- Topics: ${(repoData?.topics || []).join(', ') || 'None'}

LANGUAGE BREAKDOWN:
${languageBreakdown || 'Not available'}

DIRECTORY STRUCTURE:
${dirList || 'Not available'}

KEY FILES:
${fileList || 'Not available'}

${deps ? `DEPENDENCIES:
Production: ${deps.dependencies.join(', ')}
Development: ${deps.devDependencies.join(', ')}` : ''}

README CONTENT:
${readmeContent.substring(0, 4000) || 'No README found'}

---

Generate a DETAILED markdown document with ALL of the following sections:

# 📋 Repository Overview
Comprehensive overview of what this repository is, its purpose, and key highlights.

## 🚀 Installation Instructions
Step-by-step installation guide based on the README and detected technologies. Include prerequisites, environment setup, and commands.

## 📖 Usage Guidelines
How to use the project — CLI commands, API endpoints, configuration options, etc.

## 🏗️ Repository Structure
Visual tree of the directory structure with explanations of what each major directory/file contains.

## ⚙️ Technologies & Stack
Detailed breakdown of all technologies, frameworks, libraries used with version info if available. Include a table format.

## 🎨 Design Patterns
Identify and explain the software design patterns used (MVC, Repository Pattern, Factory, Observer, etc.) with specific examples from the codebase.

## 📊 Code Quality Metrics
Assessment of code quality, test coverage potential, documentation quality, and maintenance status.

## 🔄 Comparative Analysis
Compare this repository with 3-4 similar/alternative repositories. Include a detailed comparison table with columns for: Name, Stars, Language, Key Features, Pros, Cons.

## 📝 Key Takeaways
Summary of strengths, weaknesses, and recommendations for potential users or contributors.

Format everything in clean, professional Markdown. Use tables, code blocks, and bullet points where appropriate. Be thorough and specific — do NOT use generic placeholders.`;

          const result = await geminiModel.generateContent(prompt);
          const documentation = result.response.text();

          return NextResponse.json({
            success: true,
            data: {
              documentation,
              repoInfo: {
                name: repoData?.full_name,
                description: repoData?.description,
                language: repoData?.language,
                stars: repoData?.stargazers_count,
                forks: repoData?.forks_count,
                issues: repoData?.open_issues_count,
                license: repoData?.license?.name,
                downloadUrl: `https://github.com/${owner}/${repo}/archive/refs/heads/${repoData?.default_branch || 'main'}.zip`,
              }
            }
          });
        } catch (aiError) {
          console.error('AI analysis error:', aiError);
          // Fall through to fallback
        }
      }

      // ====== FALLBACK: Generate documentation without AI ======
      const documentation = generateFallbackDocs(owner, repo, repoData, readmeContent, languages, totalBytes, dirList, fileList, deps);

      return NextResponse.json({
        success: true,
        data: {
          documentation,
          repoInfo: {
            name: repoData?.full_name || `${owner}/${repo}`,
            description: repoData?.description,
            language: repoData?.language,
            stars: repoData?.stargazers_count,
            forks: repoData?.forks_count,
            issues: repoData?.open_issues_count,
            license: repoData?.license?.name,
            downloadUrl: `https://github.com/${owner}/${repo}/archive/refs/heads/${repoData?.default_branch || 'main'}.zip`,
          }
        }
      });
    }

    // ====== SNIPPET MODE: Code Documentation ======
    const { code, language } = body;

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: code, language' },
        { status: 400 }
      );
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        const documentation = await generateDocumentation(code, language);
        return NextResponse.json({ success: true, data: { documentation } });
      } catch (aiError) {
        console.error('AI snippet error:', aiError);
        // Fall through
      }
    }

    // Fallback snippet docs
    return NextResponse.json({
      success: true,
      data: {
        documentation: generateFallbackSnippetDocs(code, language),
      }
    });
  } catch (error) {
    console.error('Documentation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ====== FALLBACK GENERATORS ======

function generateFallbackDocs(
  owner: string, repo: string, repoData: any,
  readmeContent: string, languages: any, totalBytes: number,
  dirList: string, fileList: string, deps: any
): string {
  const langBreakdown = Object.entries(languages)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .map(([lang, bytes]) => `| **${lang}** | ${((bytes as number / totalBytes) * 100).toFixed(1)}% | \`${(bytes as number).toLocaleString()} bytes\` |`)
    .join('\\n');

  const primaryLang = Object.keys(languages)[0] || repoData?.language || 'Unknown';

  const techStack = [];
  let hasTests = false;
  let hasLint = false;
  let hasDocker = fileList.includes('Dockerfile') || fileList.includes('docker-compose');
  let hasCI = fileList.includes('.github/workflows') || fileList.includes('.gitlab-ci.yml') || fileList.includes('travis.yml');

  if (deps) {
    const allDeps = [...(deps.dependencies || []), ...(deps.devDependencies || [])];
    if (allDeps.includes('react')) techStack.push({ name: 'React', category: 'Frontend', icon: '⚛️' });
    if (allDeps.includes('next')) techStack.push({ name: 'Next.js', category: 'Framework', icon: '▲' });
    if (allDeps.includes('vue')) techStack.push({ name: 'Vue.js', category: 'Frontend', icon: '🟢' });
    if (allDeps.includes('svelte')) techStack.push({ name: 'Svelte', category: 'Frontend', icon: '🔥' });
    if (allDeps.includes('tailwindcss')) techStack.push({ name: 'Tailwind CSS', category: 'Styling', icon: '🌊' });
    if (allDeps.includes('styled-components')) techStack.push({ name: 'Styled Components', category: 'Styling', icon: '💅' });
    if (allDeps.includes('sass')) techStack.push({ name: 'Sass', category: 'Styling', icon: '🩷' });
    if (allDeps.includes('express')) techStack.push({ name: 'Express.js', category: 'Backend', icon: '🚂' });
    if (allDeps.includes('@nestjs/core')) techStack.push({ name: 'NestJS', category: 'Backend', icon: '🐈' });
    if (allDeps.includes('fastify')) techStack.push({ name: 'Fastify', category: 'Backend', icon: '⚡' });
    if (allDeps.includes('prisma') || allDeps.includes('@prisma/client')) techStack.push({ name: 'Prisma ORM', category: 'Database', icon: '💎' });
    if (allDeps.includes('mongoose')) techStack.push({ name: 'Mongoose (MongoDB)', category: 'Database', icon: '🍃' });
    if (allDeps.includes('pg') || allDeps.includes('sequelize')) techStack.push({ name: 'PostgreSQL/SQL', category: 'Database', icon: '🐘' });
    if (allDeps.includes('typescript') || allDeps.includes('ts-node')) techStack.push({ name: 'TypeScript', category: 'Language', icon: '📘' });
    if (allDeps.includes('firebase') || allDeps.includes('firebase-admin')) techStack.push({ name: 'Firebase', category: 'BaaS', icon: '🔥' });
    if (allDeps.includes('jest') || allDeps.includes('vitest') || allDeps.includes('mocha') || allDeps.includes('cypress')) hasTests = true;
    if (allDeps.includes('eslint') || allDeps.includes('prettier')) hasLint = true;
  }

  const techStackMarkdown = techStack.length > 0 
    ? `| Technology | Category | Icon |\n|------------|----------|------|\n${techStack.map(t => `| **${t.name}** | ${t.category} | ${t.icon} |`).join('\n')}`
    : '> No specific framework dependencies detected automatically.';

  const topLevelDirs = dirList.split('\n')
    .filter(d => d.trim() && !d.includes('/'))
    .map(d => `- 📁 **\`${d}/\`**`);
  
  const importantFiles = fileList.split('\n')
    .filter(f => f.trim() && !f.includes('/'))
    .map(f => `- 📄 \`${f}\``);

  let score = 50;
  if (hasTests) score += 15;
  if (hasLint) score += 10;
  if (hasCI) score += 15;
  if (hasDocker) score += 5;
  if (readmeContent && readmeContent.length > 1000) score += 5;

  const runCommand = deps && deps.dependencies && deps.dependencies.next ? 'npm run dev' :
                     deps && deps.dependencies && deps.dependencies.react ? 'npm start' :
                     '# See README for start commands';

  const readmeExcerpt = readmeContent 
    ? readmeContent.split('\n').slice(0, 15).map(l => '> ' + l).join('\n') + '\n> ... *(truncated)*'
    : '> No README file was found in this repository.';

  return [
    `# 📋 Comprehensive Analysis: ${repoData?.full_name || `${owner}/${repo}`}`,
    '',
    `> **Note:** This detailed report was generated via direct repository analysis.`,
    '',
    repoData?.description ? `> "${repoData.description}"` : '> No repository description provided.',
    '',
    '---',
    '',
    '## 📊 1. Key Metrics & Health',
    '',
    '| Metric | Value | Status Indicator |',
    '|--------|-------|------------------|',
    `| ⭐ **Stars** | \`${(repoData?.stargazers_count || 0).toLocaleString()}\` | ${repoData?.stargazers_count > 500 ? '🔥 Highly Popular' : '🌱 Growing'} |`,
    `| 🍴 **Forks** | \`${(repoData?.forks_count || 0).toLocaleString()}\` | ${repoData?.forks_count > 100 ? '👥 Active Community' : 'Standard'} |`,
    `| 🐛 **Open Issues** | \`${(repoData?.open_issues_count || 0).toLocaleString()}\` | ${repoData?.open_issues_count > 50 ? '⚠️ High Backlog' : '✅ Manageable'} |`,
    `| 📜 **License** | \`${repoData?.license?.name ?? 'Not specified'}\` | ${repoData?.license ? '✅ Open Source' : '⚠️ Unlicensed'} |`,
    `| 📅 **Created** | \`${repoData?.created_at ? new Date(repoData.created_at).toLocaleDateString() : 'N/A'}\` | |`,
    `| 🔄 **Last Updated**| \`${repoData?.updated_at ? new Date(repoData.updated_at).toLocaleDateString() : 'N/A'}\` | |`,
    '',
    '---',
    '',
    '## 🚀 2. Getting Started',
    '',
    '### Prerequisites',
    `Make sure you have the necessary runtime environment installed for **${primaryLang}**.`,
    deps ? '- Node.js (v16+ recommended)\n- npm, yarn, or pnpm' : '',
    hasDocker ? '- Docker and Docker Compose' : '',
    '',
    '### Installation Steps',
    '',
    '```bash',
    '# 1. Clone the repository',
    `git clone https://github.com/${owner}/${repo}.git`,
    '',
    '# 2. Navigate into the project directory',
    `cd ${repo}`,
    '',
    '# 3. Install dependencies',
    deps ? 'npm install' : '# Language-specific installation command',
    '```',
    '',
    '### Running the Project',
    '',
    '```bash',
    runCommand,
    '```',
    '',
    '---',
    '',
    '## ⚙️ 3. Technology Stack & Languages',
    '',
    '### Language Distribution',
    '| Language | Percentage | Size |',
    '|----------|-----------|------|',
    langBreakdown || '| N/A | N/A | N/A |',
    '',
    '### Detected Frameworks & Libraries',
    techStackMarkdown,
    '',
    '---',
    '',
    '## 🏗️ 4. Architecture & Repository Structure',
    '',
    '### Root Directory Overview',
    '**Directories:**',
    topLevelDirs.length > 0 ? topLevelDirs.join('\n') : '> No directories found at root.',
    '',
    '**Key Files:**',
    importantFiles.length > 0 ? importantFiles.join('\n') : '> No key files found at root.',
    '',
    '### Detected Architectural Patterns',
    `- **Continuous Integration (CI):** ${hasCI ? '✅ Yes' : '❌ No'}`,
    `- **Containerization:** ${hasDocker ? '✅ Yes' : '❌ No'}`,
    `- **Testing:** ${hasTests ? '✅ Yes' : '⚠️ No'}`,
    `- **Code Quality:** ${hasLint ? '✅ Yes' : '⚠️ No'}`,
    '',
    `### Estimated Quality Score: ${score}/100`,
    '',
    '---',
    '',
    '## 📖 5. Extracted README Content',
    '',
    readmeExcerpt,
    '',
    '---',
    '*Comprehensive Analysis automatically generated by Archon Platform.*'
  ].join('\n');
}

function generateFallbackSnippetDocs(code: string, language: string): string {
  const lines = code.split('\n');
  const functions = lines.filter(l => l.match(/(?:function|async|def|func|fn|pub fn)\s+\w+/));
  const classes = lines.filter(l => l.match(/(?:class|struct|interface|type|enum)\s+\w+/));
  const imports = lines.filter(l => l.match(/^\s*(?:import|from|require|include|using)\s+/));
  const variables = lines.filter(l => l.match(/^\s*(?:const|let|var)\s+\w+\s*=|^\s*\w+\s*=/));

  return [
    '# API & Code Documentation',
    '',
    '## Overview',
    `Documentation for **${language}** snippet (${lines.length} lines of code).`,
    '',
    '## 🔍 Code Structure Analysis',
    '',
    `### 📦 Imports & Dependencies (${imports.length} found)`,
    imports.map(i => `- \`${i.trim()}\``).join('\n') || '- No external dependencies imported.',
    '',
    `### 🧩 Classes/Types (${classes.length} found)`,
    classes.map(c => `- \`${c.trim().replace(/\{.*$/, '')}\``).join('\n') || '- No class or type definitions detected.',
    '',
    `### ⚙️ Functions/Methods (${functions.length} found)`,
    functions.map(f => `- \`${f.trim().replace(/\{.*$/, '')}\``).join('\n') || '- No function definitions detected. (May be a sequential script)',
    '',
    `### 📋 Key Variables & Assignments (${Math.min(variables.length, 10)}${variables.length > 10 ? '+' : ''} found)`,
    variables.slice(0, 10).map(v => `- \`${v.trim().split('=')[0].trim()}\``).join('\n') || '- No major variables detected at root level.',
    '',
    '## 💻 Source Code',
    '```' + language.toLowerCase(),
    code,
    '```',
    '',
    '---',
    '> *Note: This documentation was generated using the structural fallback engine because the AI limit was reached. For AI-powered deep semantic analysis, configure a valid Gemini API key.*'
  ].join('\n');
}
