"use client";

import { useState, useEffect } from "react";

interface AnalysisResult {
  summary: string;
  score: number;
  findings: Finding[];
  recommendations: string[];
  metrics: {
    complexity: number;
    maintainability: number;
    reliability: number;
    security: number;
    performance: number;
  };
}

interface Finding {
  id: string;
  severity: string;
  category: string;
  title: string;
  description: string;
  file: string;
  line: number;
  suggestion: string;
}

const SAMPLE_CODE = `// Example: Paste your code here or use this sample
import express from 'express';
const app = express();

app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const query = \`SELECT * FROM users WHERE id = '\${userId}'\`;
  const result = await db.query(query);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const user = result.rows[0];
  res.json({
    id: user.id,
    name: user.name,
    password: user.password,
    email: user.email,
    ssn: user.ssn
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username == 'admin' && password == 'admin123') {
    const token = username + ':' + Date.now();
    res.json({ token: Buffer.from(token).toString('base64') });
  }
});

app.listen(3000);`;

const LANGUAGES = [
  "TypeScript", "JavaScript", "Python", "Go", "Rust", "Java", 
  "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin"
];

const severityColors: Record<string, string> = {
  critical: "#C0392B",
  high: "#E67E22",
  medium: "#B8860B",
  low: "#4A8B6F",
  info: "#1A3A5C",
};

const severityBg: Record<string, string> = {
  critical: "#C0392B15",
  high: "#E67E2215",
  medium: "#B8860B15",
  low: "#4A8B6F15",
  info: "#1A3A5C15",
};

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-system-gray-800/70 font-medium">{label}</span>
        <span className="font-bold" style={{ color }}>{value}/100</span>
      </div>
      <div className="h-2.5 bg-system-gray-200/50 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [language, setLanguage] = useState("JavaScript");
  const [filename, setFilename] = useState("server.js");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, filename }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filteredFindings = result?.findings.filter(
    (f) => activeFilter === "all" || f.severity === activeFilter
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#4A8B6F";
    if (score >= 60) return "#B8860B";
    if (score >= 40) return "#E67E22";
    return "#C0392B";
  };

  return (
    <div className={`space-y-6 transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-system-blue">System Code Analysis</h1>
          <p className="text-sm text-system-gray-800/50 mt-1">Powered by System Engine — paste code and get instant insights</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-system-green animate-pulse" />
          <span className="text-xs text-system-gray-800/50">System Engine Online</span>
        </div>
      </div>

      {/* Input Section */}
      <div className="base-card p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="text-sm font-semibold text-system-gray-800/70 mb-1 block">Filename</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-system-gray-200 focus:border-system-blue/50 bg-white text-system-gray-800 outline-none transition-colors text-sm"
              placeholder="e.g. server.js"
            />
          </div>
          <div className="w-full sm:w-48">
            <label className="text-sm font-semibold text-system-gray-800/70 mb-1 block">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-system-gray-200 focus:border-system-blue/50 bg-white text-system-gray-800 outline-none transition-colors text-sm appearance-none cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 px-4 py-3 rounded-xl border-2 border-system-gray-200 focus:border-system-blue/50 bg-system-gray-900 text-green-400 font-mono text-sm outline-none transition-colors resize-none"
            placeholder="Paste your code here..."
            spellCheck={false}
          />
          <div className="absolute bottom-3 right-3 text-xs text-system-gray-800/30">
            {code.split("\n").length} lines
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-xs text-system-gray-800/40">
            🔒 Your code is analyzed server-side and never stored
          </p>
          <button
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
            className="px-8 py-3 bg-system-red text-white font-bold rounded-xl hover:bg-system-red/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>🔍 Analyze Code</>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="base-card p-4 border-l-4 border-system-red bg-system-red/5">
          <p className="text-sm text-system-red font-semibold">⚠️ {error}</p>
        </div>
      )}

      {/* Loading Animation */}
      {loading && (
        <div className="base-card p-12 flex flex-col items-center justify-center gap-4">
          <div className="loading-spinner w-16 h-16" />
          <p className="text-sm text-system-gray-800/50 font-medium animate-pulse">
            System Engine is analyzing your code...
          </p>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-system-blue animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <>
          {/* Score + Summary */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Score Ring */}
            <div className="base-card p-6 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 mb-4">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#E8E4DC" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke={getScoreColor(result.score)}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.score / 100) * 327} 327`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-serif font-bold" style={{ color: getScoreColor(result.score) }}>
                    {result.score}
                  </span>
                  <span className="text-xs text-system-gray-800/50">/100</span>
                </div>
              </div>
              <h3 className="text-lg font-serif font-bold text-system-blue">Quality Score</h3>
              <p className="text-xs text-system-gray-800/50 text-center mt-1">
                {result.score >= 80 ? "Excellent" : result.score >= 60 ? "Good" : result.score >= 40 ? "Needs Work" : "Critical"}
              </p>
            </div>

            {/* Summary + Recommendations */}
            <div className="lg:col-span-2 base-card p-6">
              <h3 className="text-lg font-serif font-bold text-system-blue mb-3">Summary</h3>
              <p className="text-sm text-system-gray-800/70 leading-relaxed mb-4">{result.summary}</p>
              
              <h4 className="text-sm font-bold text-system-gray-800/70 mb-2">💡 Recommendations</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-system-gray-800/60">
                    <span className="text-system-red mt-0.5">▸</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Metrics */}
          <div className="base-card p-6">
            <h3 className="text-lg font-serif font-bold text-system-blue mb-6">Code Metrics</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <MetricBar label="Complexity" value={result.metrics.complexity} color="#1A3A5C" />
              <MetricBar label="Maintainability" value={result.metrics.maintainability} color="#4A8B6F" />
              <MetricBar label="Reliability" value={result.metrics.reliability} color="#B8860B" />
              <MetricBar label="Security" value={result.metrics.security} color="#C0392B" />
              <MetricBar label="Performance" value={result.metrics.performance} color="#2C5A8C" />
            </div>
          </div>

          {/* Findings */}
          <div className="base-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-serif font-bold text-system-blue">
                Findings ({result.findings.length})
              </h3>
              <div className="flex gap-2 flex-wrap">
                {["all", "critical", "high", "medium", "low", "info"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      activeFilter === filter
                        ? "bg-system-blue text-white"
                        : "bg-system-gray-200/50 text-system-gray-800/60 hover:bg-system-gray-200"
                    }`}
                  >
                    {filter}
                    {filter !== "all" && (
                      <span className="ml-1">
                        ({result.findings.filter((f) => f.severity === filter).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredFindings?.map((finding) => (
                <div
                  key={finding.id}
                  className="border-2 border-system-gray-200/50 rounded-xl overflow-hidden hover:border-system-blue/20 transition-colors cursor-pointer"
                  onClick={() => setExpandedFinding(expandedFinding === finding.id ? null : finding.id)}
                >
                  <div className="flex items-center gap-4 p-4">
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase"
                      style={{
                        background: severityBg[finding.severity],
                        color: severityColors[finding.severity],
                      }}
                    >
                      {finding.severity}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-system-gray-800 truncate">{finding.title}</p>
                      <p className="text-xs text-system-gray-800/40 mt-0.5">
                        {finding.file}:{finding.line} • {finding.category}
                      </p>
                    </div>
                    <span className="text-system-gray-800/30 text-lg transition-transform" style={{
                      transform: expandedFinding === finding.id ? "rotate(180deg)" : "rotate(0deg)",
                    }}>
                      ▾
                    </span>
                  </div>

                  {expandedFinding === finding.id && (
                    <div className="px-4 pb-4 pt-0 border-t border-system-gray-200/50 bg-system-gray-100/30">
                      <p className="text-sm text-system-gray-800/70 mt-3 mb-3">{finding.description}</p>
                      <div className="bg-system-gray-900 rounded-lg p-3">
                        <p className="text-xs text-green-400 font-mono">💡 {finding.suggestion}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {filteredFindings?.length === 0 && (
                <div className="text-center py-8 text-system-gray-800/40">
                  <p className="text-4xl mb-2">✨</p>
                  <p className="text-sm">No findings in this category</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
