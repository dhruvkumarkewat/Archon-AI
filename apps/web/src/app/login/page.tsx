"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

function SystemIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, oauthLogin, isDemo } = useAuth();

  useEffect(() => setMounted(true), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError(null);
    try {
      await oauthLogin(provider);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.code === 'auth/account-exists-with-different-credential' || (err.message && err.message.includes('auth/account-exists-with-different-credential'))) {
        setError("An account already exists with the same email address. Please sign in using the provider you originally used (e.g., Google or Email/Password).");
      } else {
        setError(err.message || `Failed to sign in with ${provider}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Decorative Panel */}
      <div
        className={`hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-12 transition-all duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background: "linear-gradient(160deg, #1A3A5C 0%, #0F2440 40%, #1a1a1a 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-16 opacity-10 animate-float" style={{ animationDelay: "0.5s" }}><SystemIcon className="w-36 h-36" /></div>
          <div className="absolute bottom-20 right-12 opacity-5 animate-float" style={{ animationDelay: "2s" }}><SystemIcon className="w-24 h-24" /></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-system-amber/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 left-1/6 w-56 h-56 bg-system-green/8 rounded-full blur-[80px]" />
          {/* Decorative Mountain SVG */}
          <svg className="absolute bottom-0 left-0 right-0 opacity-10" viewBox="0 0 400 200" fill="none">
            <path d="M0 200 L80 60 L120 100 L200 20 L280 80 L320 50 L400 120 L400 200 Z" fill="white" fillOpacity="0.1" />
            <path d="M0 200 L60 120 L140 70 L180 110 L260 40 L340 90 L400 60 L400 200 Z" fill="white" fillOpacity="0.05" />
          </svg>
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <SystemIcon className="w-10 h-10 transition-transform duration-500 group-hover:rotate-180" />
            <span className="text-2xl font-serif font-bold text-white">Archon<span className="text-system-red-light"> System</span></span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-serif font-bold text-white leading-tight">
            Welcome back,<br />
            <span className="text-system-amber-light">developer.</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed max-w-sm">
            Your System-powered workspace is waiting. Sign in to continue building amazing software.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2">
              {["KM", "LS", "PJ", "YH"].map((initials, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-system-blue-dark flex items-center justify-center text-white text-xs font-bold" style={{
                  background: ["linear-gradient(135deg, #C0392B, #96281B)", "linear-gradient(135deg, #1A3A5C, #2C5A8C)", "linear-gradient(135deg, #4A8B6F, #367058)", "linear-gradient(135deg, #B8860B, #DAA520)"][i],
                }}>
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-white/40 text-sm">Join 10,000+ developers</span>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/30 text-sm">&copy; 2026 Archon Platform</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className={`w-full max-w-md transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <SystemIcon className="w-8 h-8" />
            <span className="text-xl font-serif font-bold text-system-blue">Archon Platform</span>
          </div>

          <h1 className="text-3xl font-serif font-bold text-system-blue mb-2">Sign in to your account</h1>
          <p className="text-system-gray-800/50 mb-4">Welcome back! Enter your credentials to continue.</p>

          {isDemo && (
            <div className="mb-6 p-4 bg-system-amber/10 border-l-4 border-system-amber rounded-r-lg text-sm text-system-amber-dark">
              <strong>Demo Mode Active:</strong> Firebase is not configured properly. You can sign in with any email and password combination you previously registered in this session, or use GitHub/Google for instant access.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-system-red/10 border border-system-red/20 text-system-red rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-system-gray-800 mb-1.5">Email</label>
              <input type="email" className="base-input" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-system-gray-800">Password</label>
                <a href="#" className="text-sm text-system-red hover:underline font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} className="base-input !pr-12" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-system-gray-800/40 hover:text-system-gray-800 transition-colors">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.5 6.5m3.378 3.378l4.242 4.242M6.5 6.5L3 3m3.5 3.5l4.378 4.378m0 0L17.5 17.5m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setRememberMe(!rememberMe)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${rememberMe ? "bg-system-blue border-system-blue" : "border-system-gray-200 hover:border-system-gray-800/40"}`}>
                {rememberMe && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </button>
              <span className="text-sm text-system-gray-800/60">Remember me for 30 days</span>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !rounded-xl text-base block text-center disabled:opacity-70">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-system-gray-200" />
            <span className="text-sm text-system-gray-800/40 font-medium">Or continue with</span>
            <div className="flex-1 h-px bg-system-gray-200" />
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleOAuth('github')} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-system-gray-200 bg-white hover:border-system-gray-800/30 hover:bg-system-gray-100 transition-all text-sm font-semibold text-system-gray-800">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" fill="currentColor" /></svg>
              GitHub
            </button>
            <button onClick={() => handleOAuth('google')} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-system-gray-200 bg-white hover:border-system-gray-800/30 hover:bg-system-gray-100 transition-all text-sm font-semibold text-system-gray-800">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              Google
            </button>
          </div>

          <p className="text-center text-sm text-system-gray-800/50 mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-system-red font-semibold hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
