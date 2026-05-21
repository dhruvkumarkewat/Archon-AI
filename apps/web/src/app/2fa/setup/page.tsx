"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

function SystemIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <path d="M50 2 A48 48 0 0 1 50 98 A24 24 0 0 1 50 50 A24 24 0 0 0 50 2" fill="#C0392B" />
      <path d="M50 98 A48 48 0 0 1 50 2 A24 24 0 0 1 50 50 A24 24 0 0 0 50 98" fill="#1A3A5C" />
      <circle cx="50" cy="26" r="8" fill="#C0392B" />
      <circle cx="50" cy="74" r="8" fill="#1A3A5C" />
    </svg>
  );
}

const backupCodes = ["A7K2-M9P4", "B3N8-X5Q1", "C6J4-R2W7", "D1L9-T8V3", "E5H3-Y6S2", "F8G7-U4Z9", "G2D6-P1N5", "H9C1-W3K8"];

export default function TwoFaSetupPage() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [verifyDigits, setVerifyDigits] = useState(["", "", "", "", "", ""]);
  const [copied, setCopied] = useState(false);
  const [codesCopied, setCodesCopied] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const secretKey = "JBSW Y3DP EHPK 3PXP";

  useEffect(() => setMounted(true), []);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...verifyDigits];
    newDigits[index] = value.slice(-1);
    setVerifyDigits(newDigits);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verifyDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const copySecret = () => {
    navigator.clipboard?.writeText(secretKey.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAllCodes = () => {
    navigator.clipboard?.writeText(backupCodes.join("\n"));
    setCodesCopied(true);
    setTimeout(() => setCodesCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-system-gray-100 flex items-center justify-center p-6">
      <div className={`w-full max-w-lg transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                  step >= s ? "bg-system-blue text-white shadow-lg shadow-system-blue/20" : "bg-system-gray-200 text-system-gray-800/40"
                }`}>
                  {step > s ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : s}
                </div>
                {s < 3 && <div className={`w-16 sm:w-24 h-1 mx-2 rounded-full transition-all duration-500 ${step > s ? "bg-system-blue" : "bg-system-gray-200"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-system-gray-800/50 font-medium">
            <span>Install App</span>
            <span>Scan QR</span>
            <span>Verify</span>
          </div>
        </div>

        <div className="base-card p-8 sm:p-10 decorative-border-top">
          {/* Step 1: Install */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-system-blue/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-system-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-serif font-bold text-system-blue text-center mb-2">Install Authenticator App</h2>
              <p className="text-system-gray-800/50 text-center mb-8">Download one of these authenticator apps on your mobile device:</p>

              <div className="space-y-3">
                {[
                  { name: "Google Authenticator", desc: "By Google LLC", icon: "🔐" },
                  { name: "Authy", desc: "By Twilio", icon: "🛡️" },
                  { name: "Microsoft Authenticator", desc: "By Microsoft", icon: "🔒" },
                ].map((app, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border-2 border-system-gray-200 hover:border-system-blue/30 hover:bg-system-blue/5 transition-all cursor-pointer group">
                    <div className="text-3xl">{app.icon}</div>
                    <div>
                      <div className="font-semibold text-system-gray-800 group-hover:text-system-blue transition-colors">{app.name}</div>
                      <div className="text-sm text-system-gray-800/40">{app.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Scan QR */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-serif font-bold text-system-blue text-center mb-2">Scan QR Code</h2>
              <p className="text-system-gray-800/50 text-center mb-8">Scan this QR code with your authenticator app</p>

              {/* QR Placeholder */}
              <div className="flex justify-center mb-6">
                <div className="w-48 h-48 rounded-2xl bg-white border-2 border-system-gray-200 p-4 flex items-center justify-center">
                  <div className="w-full h-full relative">
                    {/* Simulated QR pattern */}
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-0.5">
                      {Array(64).fill(null).map((_, i) => (
                        <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? "bg-system-gray-900" : "bg-transparent"}`} />
                      ))}
                    </div>
                    {/* Center System */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white p-1 rounded">
                        <SystemIcon className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manual Key */}
              <div className="p-4 rounded-xl bg-system-gray-100 border border-system-gray-200">
                <p className="text-xs text-system-gray-800/40 mb-2 text-center font-medium uppercase tracking-wider">Or enter this key manually</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-lg font-mono font-bold text-system-blue tracking-widest">{secretKey}</code>
                  <button onClick={copySecret} className="p-2 rounded-lg hover:bg-system-gray-200 transition-colors" title="Copy">
                    {copied ? (
                      <svg className="w-5 h-5 text-system-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-5 h-5 text-system-gray-800/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Verify */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-serif font-bold text-system-blue text-center mb-2">Verify & Save Backup Codes</h2>
              <p className="text-system-gray-800/50 text-center mb-6">Enter the code from your authenticator to confirm setup</p>

              {/* 6-digit input */}
              <div className="flex justify-center gap-3 mb-8">
                {verifyDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-11 h-13 text-center text-xl font-bold rounded-xl border-2 transition-all outline-none
                      ${digit ? "border-system-blue bg-system-blue/5" : "border-system-gray-200 bg-white"}
                      focus:border-system-red focus:ring-4 focus:ring-system-red/10`}
                  />
                ))}
              </div>

              {/* Backup Codes */}
              <div className="p-5 rounded-xl bg-system-gray-100 border border-system-gray-200 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-system-blue text-sm">Backup Codes</h3>
                  <button onClick={copyAllCodes} className="text-xs font-medium text-system-red hover:underline flex items-center gap-1">
                    {codesCopied ? "✓ Copied!" : "Copy All"}
                  </button>
                </div>
                <p className="text-xs text-system-gray-800/40 mb-3">Save these codes in a safe place. Each code can only be used once.</p>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, i) => (
                    <div key={i} className="px-3 py-2 rounded-lg bg-white border border-system-gray-200 font-mono text-sm text-system-gray-800 text-center">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="btn-outline flex-1 !rounded-xl">
                Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} className="btn-primary flex-1 !rounded-xl">
                Continue
              </button>
            ) : (
              <Link href="/dashboard" className="btn-primary flex-1 !rounded-xl text-center block">
                Complete Setup
              </Link>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-system-gray-800/40 mt-6">
          <Link href="/dashboard" className="hover:text-system-red transition-colors">Skip for now →</Link>
        </p>
      </div>
    </div>
  );
}
