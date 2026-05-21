"use client";

import { useState, useEffect } from "react";

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  createdAt: string;
  lastUsed: string | null;
  expiresAt: string | null;
  status: string;
  usage: number[];
  rawKey?: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(["read"]);
  const [newKeyExpiry, setNewKeyExpiry] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [revokeConfirm, setRevokeConfirm] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/api-keys");
      const data = await res.json();
      if (data.success) setKeys(data.data);
    } catch (err) {
      console.error("Failed to fetch keys:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newKeyName,
          scopes: newKeyScopes,
          expiresIn: newKeyExpiry || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCreatedKey(data.data.rawKey);
        setNewKeyName("");
        setNewKeyScopes(["read"]);
        setNewKeyExpiry("");
        fetchKeys();
      }
    } catch (err) {
      console.error("Failed to create key:", err);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      const res = await fetch(`/api/api-keys?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchKeys();
        setRevokeConfirm(null);
      }
    } catch (err) {
      console.error("Failed to revoke key:", err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const toggleScope = (scope: string) => {
    setNewKeyScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  return (
    <div className={`space-y-6 transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-system-blue">API Keys</h1>
          <p className="text-sm text-system-gray-800/50 mt-1">Manage your API keys for programmatic access</p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreatedKey(null); }}
          className="px-6 py-3 bg-system-red text-white font-bold rounded-xl hover:bg-system-red/90 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <span className="text-lg">+</span> Create New Key
        </button>
      </div>

      {/* Created Key Alert */}
      {createdKey && (
        <div className="base-card p-6 border-2 border-system-green bg-system-green/5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔑</span>
            <div className="flex-1">
              <h3 className="font-bold text-system-green mb-1">API Key Created Successfully!</h3>
              <p className="text-xs text-system-gray-800/50 mb-3">
                ⚠️ Copy this key now. You won&apos;t be able to see it again.
              </p>
              <div className="flex items-center gap-2 bg-system-gray-900 rounded-lg p-3">
                <code className="flex-1 text-green-400 font-mono text-sm break-all">{createdKey}</code>
                <button
                  onClick={() => copyToClipboard(createdKey)}
                  className="px-3 py-1.5 bg-system-blue text-white text-xs font-bold rounded-lg hover:bg-system-blue/80 transition-colors flex-shrink-0"
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <button onClick={() => setCreatedKey(null)} className="text-system-gray-800/30 hover:text-system-gray-800">✕</button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && !createdKey && (
        <div className="base-card p-6 border-2 border-system-blue/20">
          <h3 className="text-lg font-serif font-bold text-system-blue mb-4">Create New API Key</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-system-gray-800/70 mb-1 block">Key Name</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-system-gray-200 focus:border-system-blue/50 bg-white text-system-gray-800 outline-none transition-colors text-sm"
                placeholder="e.g. Production API Key"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-system-gray-800/70 mb-1 block">Scopes</label>
              <div className="flex gap-3">
                {["read", "write", "admin"].map((scope) => (
                  <label key={scope} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newKeyScopes.includes(scope)}
                      onChange={() => toggleScope(scope)}
                      className="w-4 h-4 accent-system-blue"
                    />
                    <span className="text-sm text-system-gray-800/70 capitalize">{scope}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-system-gray-800/70 mb-1 block">Expires In (days)</label>
              <select
                value={newKeyExpiry}
                onChange={(e) => setNewKeyExpiry(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-system-gray-200 focus:border-system-blue/50 bg-white text-system-gray-800 outline-none transition-colors text-sm appearance-none"
              >
                <option value="">Never</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">1 year</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCreate}
                disabled={!newKeyName.trim()}
                className="px-6 py-2.5 bg-system-blue text-white font-bold rounded-xl hover:bg-system-blue/90 transition-all disabled:opacity-50"
              >
                Generate Key
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-6 py-2.5 border-2 border-system-gray-200 text-system-gray-800/60 font-bold rounded-xl hover:bg-system-gray-200/30 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keys List */}
      {loading ? (
        <div className="base-card p-12 flex flex-col items-center gap-4">
          <div className="loading-spinner w-12 h-12" />
          <p className="text-sm text-system-gray-800/50">Loading API keys...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {keys.map((key) => (
            <div
              key={key.id}
              className={`base-card p-6 transition-all ${key.status === "revoked" ? "opacity-50" : ""}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-system-blue/10 flex items-center justify-center text-2xl flex-shrink-0">
                    🔑
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-system-blue">{key.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          key.status === "active"
                            ? "bg-system-green/15 text-system-green"
                            : "bg-system-red/15 text-system-red"
                        }`}
                      >
                        {key.status}
                      </span>
                    </div>
                    <p className="text-sm font-mono text-system-gray-800/40">{key.keyPrefix}••••••••••••</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-system-gray-800/50">
                      <span>Created: {formatDate(key.createdAt)}</span>
                      {key.lastUsed && <span>Last used: {formatDate(key.lastUsed)}</span>}
                      {key.expiresAt && <span>Expires: {formatDate(key.expiresAt)}</span>}
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      {key.scopes.map((scope) => (
                        <span
                          key={scope}
                          className="px-2 py-0.5 bg-system-blue/10 text-system-blue text-xs font-bold rounded capitalize"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Usage sparkline */}
                  <div className="hidden sm:flex items-end gap-0.5 h-8">
                    {key.usage.map((val, i) => (
                      <div
                        key={i}
                        className="w-2 rounded-t-sm bg-system-blue/30 transition-all hover:bg-system-blue"
                        style={{ height: `${(val / Math.max(...key.usage, 1)) * 100}%` }}
                        title={`${val} requests`}
                      />
                    ))}
                  </div>

                  {key.status === "active" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(key.keyPrefix + "...")}
                        className="px-3 py-1.5 text-xs font-bold border-2 border-system-gray-200 text-system-gray-800/60 rounded-lg hover:bg-system-gray-200/30 transition-all"
                      >
                        Copy
                      </button>
                      {revokeConfirm === key.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleRevoke(key.id)}
                            className="px-3 py-1.5 text-xs font-bold bg-system-red text-white rounded-lg"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setRevokeConfirm(null)}
                            className="px-3 py-1.5 text-xs font-bold border-2 border-system-gray-200 text-system-gray-800/60 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setRevokeConfirm(key.id)}
                          className="px-3 py-1.5 text-xs font-bold border-2 border-system-red/30 text-system-red rounded-lg hover:bg-system-red/5 transition-all"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {keys.length === 0 && (
            <div className="base-card p-12 text-center">
              <p className="text-4xl mb-3">🔑</p>
              <p className="text-lg font-serif font-bold text-system-blue mb-1">No API Keys Yet</p>
              <p className="text-sm text-system-gray-800/50">Create your first API key to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
