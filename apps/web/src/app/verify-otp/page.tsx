"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

function SystemIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

export default function VerifyOtpPage() {
  const [mounted, setMounted] = useState(false);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [useBackup, setUseBackup] = useState(false);
  const [backupCode, setBackupCode] = useState("");
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && value) {
      setIsVerifying(true);
      setTimeout(() => setIsVerifying(false), 2000);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setDigits(newDigits);
    if (pasted.length === 6) {
      inputRefs.current[5]?.focus();
      setIsVerifying(true);
      setTimeout(() => setIsVerifying(false), 2000);
    } else {
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-system-gray-100 p-6">
      <div className={`w-full max-w-md transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <div className="base-card p-8 sm:p-10 text-center decorative-border-top">
          {/* System Icon */}
          <div className="flex justify-center mb-6">
            <div className={`${isVerifying ? "animate-spin" : "animate-float"} transition-all`} style={{ animationDuration: isVerifying ? "0.8s" : "3s" }}>
              <SystemIcon className="w-16 h-16" />
            </div>
          </div>

          <h1 className="text-2xl font-serif font-bold text-system-blue mb-2">Two-Factor Authentication</h1>
          
          {!useBackup ? (
            <>
              <p className="text-system-gray-800/50 mb-8">Enter the 6-digit code from your authenticator app</p>

              {/* OTP Input */}
              <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-300 outline-none font-serif
                      ${digit ? "border-system-blue bg-system-blue/5 text-system-blue" : "border-system-gray-200 bg-white text-system-gray-800"}
                      focus:border-system-red focus:ring-4 focus:ring-system-red/10`}
                    disabled={isVerifying}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  setIsVerifying(true);
                  setTimeout(() => setIsVerifying(false), 2000);
                }}
                disabled={digits.some((d) => !d) || isVerifying}
                className="btn-primary w-full !rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </button>

              <div className="mt-6 space-y-3">
                <button onClick={() => setUseBackup(true)} className="text-sm text-system-blue hover:text-system-red transition-colors font-medium">
                  Use a backup code instead
                </button>
                <div>
                  {countdown > 0 ? (
                    <p className="text-sm text-system-gray-800/40">
                      Resend code in <span className="font-semibold text-system-blue">{countdown}s</span>
                    </p>
                  ) : (
                    <button onClick={() => setCountdown(30)} className="text-sm text-system-red hover:underline font-medium">
                      Resend code
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-system-gray-800/50 mb-8">Enter one of your backup codes</p>
              <input
                type="text"
                className="base-input text-center text-lg font-mono tracking-widest mb-6"
                placeholder="XXXX-XXXX"
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                maxLength={9}
              />
              <button className="btn-primary w-full !rounded-xl text-base" disabled={backupCode.length < 8}>
                Verify Backup Code
              </button>
              <button onClick={() => setUseBackup(false)} className="mt-4 text-sm text-system-blue hover:text-system-red transition-colors font-medium block mx-auto">
                Use authenticator app instead
              </button>
            </>
          )}
        </div>

        <p className="text-center text-sm text-system-gray-800/40 mt-6">
          <Link href="/login" className="hover:text-system-red transition-colors">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}
