"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const mockRepos = [
  { id: 1, name: "korean-ai-platform/web-frontend", desc: "Next.js application for the platform", lang: "TypeScript", langColor: "#3178C6", stars: 124, lastCommit: "2 hours ago", status: "Healthy", findings: 2 },
  { id: 2, name: "korean-ai-platform/api-gateway", desc: "NestJS backend and API gateway", lang: "TypeScript", langColor: "#3178C6", stars: 89, lastCommit: "5 hours ago", status: "Needs Review", findings: 15 },
  { id: 3, name: "korean-ai-platform/analysis-engine", desc: "Python-based code analysis worker", lang: "Python", langColor: "#3776AB", stars: 210, lastCommit: "1 day ago", status: "Critical", findings: 42 },
  { id: 4, name: "korean-ai-platform/docs-generator", desc: "Go service for Swagger generation", lang: "Go", langColor: "#00ADD8", stars: 45, lastCommit: "3 days ago", status: "Healthy", findings: 0 },
  { id: 5, name: "korean-ai-platform/auth-service", desc: "Authentication and SSO service", lang: "Rust", langColor: "#DEA584", stars: 156, lastCommit: "1 week ago", status: "Needs Review", findings: 8 },
  { id: 6, name: "korean-ai-platform/infra", desc: "Terraform configurations", lang: "HCL", langColor: "#844FBA", stars: 32, lastCommit: "2 weeks ago", status: "Healthy", findings: 1 },
];

export default function RepositoriesPage() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => setMounted(true), []);

  const filteredRepos = mockRepos.filter(repo => 
    repo.name.toLowerCase().includes(search.toLowerCase()) || 
    repo.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`space-y-6 transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-system-blue mb-1">Repositories</h1>
          <p className="text-system-gray-800/50 text-sm">Manage and analyze your connected codebases</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Connect Repository
        </button>
      </div>

      {/* Filters */}
      <div className="base-card p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-system-gray-800/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Search repositories..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="base-input !pl-10 !py-2" 
          />
        </div>
        <div className="flex gap-4">
          <select className="base-input !py-2 bg-transparent text-system-gray-800/70">
            <option>All Languages</option>
            <option>TypeScript</option>
            <option>Python</option>
            <option>Go</option>
          </select>
          <select className="base-input !py-2 bg-transparent text-system-gray-800/70">
            <option>Any Status</option>
            <option>Healthy</option>
            <option>Needs Review</option>
            <option>Critical</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRepos.map((repo, i) => (
          <div key={repo.id} className="base-card p-6 flex flex-col" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-system-gray-200 flex items-center justify-center text-xl">
                  {repo.lang === "Python" ? "🐍" : repo.lang === "TypeScript" ? "📘" : repo.lang === "Go" ? "🐹" : "📦"}
                </div>
                <div>
                  <h3 className="font-semibold text-system-blue truncate w-48" title={repo.name}>{repo.name.split("/")[1]}</h3>
                  <p className="text-xs text-system-gray-800/50 truncate w-48">{repo.name.split("/")[0]}</p>
                </div>
              </div>
              <span className={`w-3 h-3 rounded-full ${
                repo.status === "Healthy" ? "bg-system-green" : 
                repo.status === "Needs Review" ? "bg-system-amber" : "bg-system-red"
              }`} title={repo.status} />
            </div>

            <p className="text-sm text-system-gray-800/70 mb-6 flex-1 line-clamp-2">{repo.desc}</p>

            <div className="flex items-center gap-4 text-xs text-system-gray-800/50 mb-6">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: repo.langColor }} />
                {repo.lang}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {repo.stars}
              </span>
              <span>Updated {repo.lastCommit}</span>
            </div>

            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-system-gray-200">
              <Link href="/dashboard/analysis" className="btn-outline flex-1 !py-2 !px-4 text-sm text-center">Analyze</Link>
              <Link href={`/dashboard/analysis?repo=${repo.id}`} className="text-sm font-semibold text-system-blue hover:text-system-red transition-colors whitespace-nowrap">
                {repo.findings > 0 ? `${repo.findings} Issues` : 'Report'} →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="base-card w-full max-w-lg p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-system-blue">Connect Repository</h2>
              <button onClick={() => setShowModal(false)} className="text-system-gray-800/40 hover:text-system-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <button className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-system-gray-200 hover:border-system-gray-800/30 bg-white transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                <span className="font-semibold text-system-gray-800">Import from GitHub</span>
              </button>
              
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-system-gray-200" />
                <span className="text-xs text-system-gray-800/40 font-medium">OR</span>
                <div className="flex-1 h-px bg-system-gray-200" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-system-gray-800 mb-1.5">Repository URL</label>
                <input type="text" className="base-input" placeholder="https://github.com/org/repo" />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="btn-outline !py-2">Cancel</button>
              <button onClick={() => setShowModal(false)} className="btn-primary !py-2">Connect</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
