import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repoUrl = searchParams.get('url');

  if (!repoUrl) {
    return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 });
  }

  try {
    // Extract owner and repo name from GitHub URL
    const urlParts = repoUrl.replace('https://github.com/', '').split('/');
    const owner = urlParts[0];
    const repo = urlParts[1];

    if (!owner || !repo) {
      return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
    }

    // Call GitHub API
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}` // Optional: Add token if rate limited
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Repository not found or is private' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch repository data from GitHub' }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      name: data.full_name,
      description: data.description || "No description provided.",
      language: data.language || "Unknown",
      stars: data.stargazers_count,
      forks: data.forks_count,
      defaultBranch: data.default_branch,
      updatedAt: data.updated_at,
      downloadUrl: `https://github.com/${data.full_name}/archive/refs/heads/${data.default_branch}.zip`,
    });

  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
