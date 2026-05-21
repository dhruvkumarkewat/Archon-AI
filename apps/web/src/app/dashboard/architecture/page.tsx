"use client";

import { useState, useEffect } from "react";

export default function ArchitecturePage() {
  const [description, setDescription] = useState(
    "An e-commerce platform with user authentication, product catalog, shopping cart, payment processing via Stripe, order management, email notifications, and an admin dashboard. It should handle 10K concurrent users and support real-time inventory updates."
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/architecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.data.architecture);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Simple markdown renderer for the System output
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let codeLang = "";

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
          codeLang = line.replace("```", "").trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-lg font-serif font-bold text-system-blue mt-6 mb-2">
            {line.replace("### ", "")}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="text-xl font-serif font-bold text-system-blue mt-8 mb-3">
            {line.replace("## ", "")}
          </h2>
        );
      } else if (line.startsWith("# ")) {
        elements.push(
          <h1 key={i} className="text-2xl font-serif font-bold text-system-blue mt-6 mb-4">
            {line.replace("# ", "")}
          </h1>
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li key={i} className="text-sm text-system-gray-800/70 ml-4 mb-1 list-disc">
            {line.replace(/^[-*] /, "")}
          </li>
        );
      } else if (line.match(/^\d+\. /)) {
        elements.push(
          <li key={i} className="text-sm text-system-gray-800/70 ml-4 mb-1 list-decimal">
            {line.replace(/^\d+\. /, "")}
          </li>
        );
      } else if (line.startsWith("**") && line.endsWith("**")) {
        elements.push(
          <p key={i} className="text-sm font-bold text-system-gray-800 mt-3 mb-1">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      } else if (line.trim()) {
        elements.push(
          <p key={i} className="text-sm text-system-gray-800/70 leading-relaxed mb-2">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className={`space-y-6 transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-system-blue">Architecture Visualizer</h1>
        <p className="text-sm text-system-gray-800/50 mt-1">
          Describe your project and let System Engine generate an architecture blueprint
        </p>
      </div>

      {/* Input */}
      <div className="base-card p-6">
        <label className="text-sm font-semibold text-system-gray-800/70 mb-2 block">
          🏗️ Project Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-32 px-4 py-3 rounded-xl border-2 border-system-gray-200 focus:border-system-blue/50 bg-white text-system-gray-800 text-sm outline-none transition-colors resize-none"
          placeholder="Describe your project requirements, scale, and key features..."
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
            className="px-8 py-3 bg-system-blue text-white font-bold rounded-xl hover:bg-system-blue/90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>🏗️ Generate Architecture</>
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
            System Engine is designing your architecture...
          </p>
        </div>
      )}

      {result && !loading && (
        <div className="base-card p-8">
          <div className="prose max-w-none">{renderMarkdown(result)}</div>
        </div>
      )}
    </div>
  );
}
