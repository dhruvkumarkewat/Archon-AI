"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [mounted, setMounted] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => setResending(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-system-gray-100 p-6">
      <div className={`w-full max-w-md transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <div className="base-card p-10 text-center">
          {!verified ? (
            <>
              {/* Floating Mail Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-system-blue/10 flex items-center justify-center animate-float">
                  <svg className="w-12 h-12 text-system-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <h1 className="text-2xl font-serif font-bold text-system-blue mb-3">Verify Your Email</h1>
              <p className="text-system-gray-800/50 mb-2">We&apos;ve sent a verification link to</p>
              <p className="text-system-blue font-semibold mb-8">developer@example.com</p>

              <div className="space-y-3">
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="btn-outline w-full !rounded-xl flex items-center justify-center gap-2"
                >
                  {resending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-system-blue/30 border-t-system-blue rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </button>

                <button
                  onClick={() => setVerified(true)}
                  className="text-sm text-system-gray-800/40 hover:text-system-red transition-colors"
                >
                  I&apos;ve already verified (demo)
                </button>
              </div>

              <div className="mt-8 p-4 rounded-xl bg-system-gray-100/50 border border-system-gray-200">
                <p className="text-sm text-system-gray-800/50">
                  💡 Didn&apos;t receive the email? Check your spam folder or try a different email address.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-system-green/10 flex items-center justify-center animate-fade-in-up">
                  <svg className="w-12 h-12 text-system-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <h1 className="text-2xl font-serif font-bold text-system-green mb-3">Email Verified!</h1>
              <p className="text-system-gray-800/50 mb-8">Your email has been successfully verified. You can now access all features.</p>

              <Link href="/dashboard" className="btn-primary w-full !rounded-xl text-base block text-center">
                Continue to Dashboard →
              </Link>
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
