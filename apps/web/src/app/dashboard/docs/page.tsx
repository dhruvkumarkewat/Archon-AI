"use client";

import { useState, useEffect } from "react";

export default function DocsPage() {
  const [code, setCode] = useState(`export class UserService {
  private users: Map<string, User> = new Map();

  /**
   * Create a new user with validation
   */
  async createUser(data: CreateUserInput): Promise<User> {
    if (!data.email || !data.name) {
      throw new Error('Email and name are required');
    }

    const user: User = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email.toLowerCase(),
      role: data.role || 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(user.id, user);
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    
    const updated = { ...user, ...data, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async listUsers(filter?: { role?: string }): Promise<User[]> {
    let users = Array.from(this.users.values());
    if (filter?.role) {
      users = users.filter(u => u.role === filter.role);
    }
    return users;
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateUserInput {
  name: string;
  email: string;
  role?: string;
}`);
  const [language, setLanguage] = useState("TypeScript");
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleGenerate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setDocs(null);

    try {
      const res = await fetch("/api/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setDocs(data.data.documentation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];

    lines.forEach((line, i) => {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${i}`} className="bg-system-gray-900 text-green-400 rounded-xl p-4 overflow-x-auto text-sm font-mono my-4">
              <code>{codeLines.join("\n")}</code>
            </pre>
          );
          codeLines = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      if (line.startsWith("#### ")) {
        elements.push(<h4 key={i} className="text-base font-bold text-system-gray-800 mt-4 mb-1">{line.replace("#### ", "")}</h4>);
      } else if (line.startsWith("### ")) {
        elements.push(<h3 key={i} className="text-lg font-serif font-bold text-system-blue mt-6 mb-2">{line.replace("### ", "")}</h3>);
      } else if (line.startsWith("## ")) {
        elements.push(<h2 key={i} className="text-xl font-serif font-bold text-system-blue mt-8 mb-3 pb-2 border-b border-system-gray-200">{line.replace("## ", "")}</h2>);
      } else if (line.startsWith("# ")) {
        elements.push(<h1 key={i} className="text-2xl font-serif font-bold text-system-blue mt-6 mb-4">{line.replace("# ", "")}</h1>);
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(<li key={i} className="text-sm text-system-gray-800/70 ml-4 mb-1 list-disc">{line.replace(/^[-*] /, "")}</li>);
      } else if (line.startsWith("| ")) {
        // Simple table row rendering
        const cells = line.split("|").filter(c => c.trim()).map(c => c.trim());
        if (!line.includes("---")) {
          elements.push(
            <div key={i} className="flex border-b border-system-gray-200/50">
              {cells.map((cell, ci) => (
                <div key={ci} className="flex-1 px-3 py-2 text-sm text-system-gray-800/70">{cell}</div>
              ))}
            </div>
          );
        }
      } else if (line.trim()) {
        elements.push(<p key={i} className="text-sm text-system-gray-800/70 leading-relaxed mb-2">{line}</p>);
      }
    });

    return elements;
  };

  const copyDocs = () => {
    if (docs) navigator.clipboard.writeText(docs);
  };

  return (
    <div className={`space-y-6 transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
      <div>
        <h1 className="text-2xl font-serif font-bold text-system-blue">API Documentation Generator</h1>
        <p className="text-sm text-system-gray-800/50 mt-1">
          Paste your code and let System Engine generate comprehensive documentation
        </p>
      </div>

      {/* Input */}
      <div className="base-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="text-sm font-semibold text-system-gray-800/70 mb-1 block">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 rounded-xl border-2 border-system-gray-200 focus:border-system-blue/50 bg-white text-system-gray-800 outline-none text-sm appearance-none"
            >
              {["TypeScript", "JavaScript", "Python", "Go", "Rust", "Java", "C#", "Ruby"].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-56 px-4 py-3 rounded-xl border-2 border-system-gray-200 focus:border-system-blue/50 bg-system-gray-900 text-green-400 font-mono text-sm outline-none resize-none"
          placeholder="Paste your code here..."
          spellCheck={false}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleGenerate}
            disabled={loading || !code.trim()}
            className="px-8 py-3 bg-system-red text-white font-bold rounded-xl hover:bg-system-red/90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>📄 Generate Documentation</>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="base-card p-4 border-l-4 border-system-red bg-system-red/5">
          <p className="text-sm text-system-red font-semibold">⚠️ {error}</p>
        </div>
      )}

      {loading && (
        <div className="base-card p-12 flex flex-col items-center gap-4">
          <div className="loading-spinner w-16 h-16" />
          <p className="text-sm text-system-gray-800/50 font-medium animate-pulse">
            System Engine is writing documentation...
          </p>
        </div>
      )}

      {docs && !loading && (
        <div className="base-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-serif font-bold text-system-blue">Generated Documentation</h2>
            <button
              onClick={copyDocs}
              className="px-4 py-2 text-xs font-bold border-2 border-system-gray-200 text-system-gray-800/60 rounded-lg hover:bg-system-gray-200/30 transition-all"
            >
              📋 Copy Markdown
            </button>
          </div>
          <div className="prose max-w-none">{renderMarkdown(docs)}</div>
        </div>
      )}
    </div>
  );
}
