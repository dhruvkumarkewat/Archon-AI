"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ===== system SVG COMPONENT ===== */
function SystemIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

/* ===== SCROLL REVEAL HOOK ===== */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

/* ===== ANIMATED COUNTER ===== */
function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  const numericTarget = parseInt(target.replace(/[^0-9]/g, ""));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = numericTarget / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, numericTarget]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

/* ===== ICONS ===== */
const Icons = {
  Search: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
  Bug: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Doc: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  Arch: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" /></svg>,
  Security: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
  Metrics: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
};

/* ===== FEATURES DATA ===== */
const features = [
  { icon: <Icons.Search />, title: "Repository Analysis", desc: "Deep automated code analysis across your entire codebase. Identify patterns, anti-patterns, and optimization opportunities instantly." },
  { icon: <Icons.Bug />, title: "Bug Detection", desc: "Catch bugs before they reach production. Our engine scans for common pitfalls, logic errors, and edge cases with high precision." },
  { icon: <Icons.Doc />, title: "API Documentation", desc: "Auto-generate beautiful, comprehensive API docs from your code. Always in sync, always up to date." },
  { icon: <Icons.Arch />, title: "Architecture Viz", desc: "Interactive system diagrams that help you understand and communicate your architecture at a single glance." },
  { icon: <Icons.Security />, title: "Security Scanning", desc: "Identify vulnerabilities, exposed secrets, and compliance issues with real-time continuous security analysis." },
  { icon: <Icons.Metrics />, title: "Code Metrics", desc: "Track code quality, complexity, and technical debt over time with actionable, insightful dashboards." },
];

const steps = [
  { num: "01", title: "Connect Repository", desc: "Link your GitHub repositories in one click with secure, frictionless OAuth integration." },
  { num: "02", title: "Automated Scan", desc: "Our intelligent engine analyzes your codebase for insights, vulnerabilities, and potential issues." },
  { num: "03", title: "Get Insights", desc: "Receive detailed reports, visualizations, and actionable recommendations to ship faster." },
];

const testimonials = [
  { name: "Alex Chen", role: "CTO at TechVerse", text: "DevForge transformed how our team approaches code quality. The automated analysis caught critical bugs we completely missed in code review.", rating: 5, avatar: "AC" },
  { name: "Sarah Williams", role: "Lead Engineer at DataFlow", text: "The architecture visualization alone saved us weeks of documentation work. It's like having a senior architect on demand.", rating: 5, avatar: "SW" },
  { name: "David Miller", role: "Founder of CodeCraft", text: "As a startup, we can't afford dedicated DevOps. DevForge gives us enterprise-grade tools at a fraction of the cost and zero setup.", rating: 5, avatar: "DM" },
];

/* ===== MAIN COMPONENT ===== */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [demoLog, setDemoLog] = useState<string[]>([]);

  const heroReveal = useScrollReveal();
  const featuresReveal = useScrollReveal();
  const stepsReveal = useScrollReveal();
  const pricingReveal = useScrollReveal();
  const testimonialsReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!demoPlaying) {
      setDemoLog([]);
      return;
    }

    const logs = [
      "> Initializing DevForge engine...",
      "> Connecting to repository: github.com/user/project",
      "> Fetching source code... (45,210 lines)",
      "> Analyzing architecture...",
      "> [WARN] Circular dependency detected in /src/utils/auth.ts",
      "> Scanning for vulnerabilities...",
      "> [OK] No critical security issues found.",
      "> Running performance profiling...",
      "> [TIP] Optimization possible in React component <Dashboard />",
      "> Generating API documentation...",
      "> Analysis complete in 3.4 seconds.",
      "> Redirecting to dashboard..."
    ];

    let currentIndex = 0;
    let timeoutId: any = null;
    
    const interval = setInterval(() => {
      if (currentIndex < logs.length) {
        const nextLog = logs[currentIndex];
        if (nextLog !== undefined) {
          setDemoLog((prev) => [...prev, nextLog]);
        }
        currentIndex++;
      } else {
        clearInterval(interval);
        timeoutId = setTimeout(() => {
          setDemoPlaying(false);
          setShowVideoModal(false);
        }, 3000);
      }
    }, 800);

    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [demoPlaying]);

  return (
    <div className="flex flex-col min-h-screen bg-system-bg-light">
      {/* ===== NAVIGATION ===== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <SystemIcon className="w-9 h-9 transition-transform duration-500 group-hover:rotate-180" />
            <span className="text-xl font-serif font-bold text-system-blue">
              DevForge
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-system-gray-800/70 hover:text-system-blue transition-colors font-medium text-sm">Features</a>
            <a href="#how-it-works" className="text-system-gray-800/70 hover:text-system-blue transition-colors font-medium text-sm">How It Works</a>
            <a href="#testimonials" className="text-system-gray-800/70 hover:text-system-blue transition-colors font-medium text-sm">Testimonials</a>
            <a href="#pricing" className="text-system-gray-800/70 hover:text-system-blue transition-colors font-medium text-sm">Pricing</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-system-blue font-semibold text-sm hover:text-system-red transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="btn-primary text-sm !py-2.5 !px-6 rounded-full">
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-system-blue transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-6 h-0.5 bg-system-blue transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`w-6 h-0.5 bg-system-blue transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass mt-2 mx-4 rounded-2xl p-6 animate-fade-in-up shadow-xl">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-system-gray-800 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-system-gray-800 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#testimonials" className="text-system-gray-800 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
              <div className="decorative-divider-thin my-2" />
              <Link href="/login" className="text-system-blue font-semibold py-2">Sign In</Link>
              <Link href="/register" className="btn-primary text-center rounded-full">Get Started Free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section
        ref={heroReveal.ref}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        style={{
          background: "linear-gradient(135deg, #0F2440 0%, #1A3A5C 40%, #2C5A8C 70%, #1A3A5C 100%)",
        }}
      >
        {/* Floating System Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 opacity-10 animate-float" style={{ animationDelay: "0s" }}>
            <SystemIcon className="w-32 h-32" />
          </div>
          <div className="absolute top-40 right-20 opacity-5 animate-float" style={{ animationDelay: "1s" }}>
            <SystemIcon className="w-48 h-48" />
          </div>
          <div className="absolute bottom-20 left-1/4 opacity-5 animate-float" style={{ animationDelay: "2s" }}>
            <SystemIcon className="w-24 h-24" />
          </div>
          {/* Gradient orbs */}
          <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-system-red/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-system-amber/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pb-32 pt-16">
          <div className={`transition-all duration-1000 ${heroReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-system-green rounded-full animate-pulse" />
              <span className="text-white/80 text-sm font-medium">Now in Public Beta — 10,000+ developers and counting</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6">
              Ship Better Code,{" "}
              <span className="block mt-2" style={{
                background: "linear-gradient(135deg, #C0392B, #B8860B, #DAA520)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Ship It Faster
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Transform your development workflow with automated code analysis, instant API documentation, and real-time architecture visualizations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/register"
                className="btn-primary text-lg !py-4 !px-10 rounded-full animate-pulse-glow inline-flex items-center justify-center gap-2"
              >
                Start Free Trial
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button onClick={() => setShowVideoModal(true)} className="btn-outline !border-white/30 !text-white hover:!bg-white/10 hover:!border-white/50 text-lg !py-4 !px-10 rounded-full inline-flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                View Demo
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { value: "10000", suffix: "+", label: "Developers" },
                { value: "50", suffix: "M+", label: "Lines Analyzed" },
                { value: "99", suffix: ".9%", label: "Uptime" },
                { value: "5", suffix: "★", label: "Rating" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white font-serif">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-white/50 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z" fill="#FAF7F0" />
          </svg>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" ref={featuresReveal.ref} className="py-24 px-6 bg-system-bg-light">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${featuresReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-system-red font-semibold text-sm uppercase tracking-widest">Features</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-system-blue mt-3 mb-4">
              Everything You Need to Ship Better Code
            </h2>
            <p className="text-system-gray-800/60 max-w-2xl mx-auto text-lg">
              A complete suite of intelligent tools designed to elevate your development process from good to exceptional.
            </p>
            <div className="decorative-divider-thin max-w-xs mx-auto mt-8" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`base-card p-8 group cursor-pointer transition-all duration-500 ${
                  featuresReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-system-blue mb-5 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-serif font-bold text-system-blue mb-3 group-hover:text-system-red transition-colors">
                  {feature.title}
                </h3>
                <p className="text-system-gray-800/60 leading-relaxed">
                  {feature.desc}
                </p>
                <Link href="/register" className="mt-6 inline-flex items-center text-system-red font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" ref={stepsReveal.ref} className="py-24 px-6 bg-system-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${stepsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-system-red font-semibold text-sm uppercase tracking-widest">How It Works</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-system-blue mt-3 mb-4">
              Three Steps to Better Code
            </h2>
            <div className="decorative-divider-thin max-w-xs mx-auto mt-8" />
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-24 left-[16.5%] right-[16.5%] h-0.5 bg-gradient-to-r from-system-red via-system-amber to-system-green" />

            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`text-center relative transition-all duration-700 ${
                    stepsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${i * 200}ms` }}
                >
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-system-blue to-system-blue-dark text-white font-serif font-bold text-2xl mb-6 shadow-lg shadow-system-blue/20">
                    {step.num}
                    <div className="absolute inset-0 rounded-full border-2 border-system-amber/30 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-system-blue mb-3">{step.title}</h3>
                  <p className="text-system-gray-800/60 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section id="pricing" ref={pricingReveal.ref} className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${pricingReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-system-red font-semibold text-sm uppercase tracking-widest">Pricing</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-system-blue mt-3 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-system-gray-800/60 max-w-2xl mx-auto text-lg">
              Choose the right plan for you and your team. No hidden fees.
            </p>
            <div className="decorative-divider-thin max-w-xs mx-auto mt-8" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className={`base-card p-8 border border-system-gray-200 transition-all duration-700 ${pricingReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "100ms" }}>
              <h3 className="text-xl font-serif font-bold text-system-blue mb-2">Starter</h3>
              <div className="text-4xl font-bold text-system-blue mb-4">$0<span className="text-lg text-system-gray-800/50 font-normal">/mo</span></div>
              <p className="text-system-gray-800/60 mb-6 text-sm h-10">Perfect for individual developers and open source projects.</p>
              <Link href="/register" className="btn-outline w-full text-center mb-8 block">Get Started</Link>
              <ul className="space-y-4">
                {["Up to 5 Repositories", "Basic Code Analysis", "Community Support", "API Rate Limit: 100/day"].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-system-gray-800/80">
                    <svg className="w-5 h-5 text-system-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Plan */}
            <div className={`rounded-2xl p-8 bg-gradient-to-b from-system-blue to-system-blue-dark text-white relative transform md:-translate-y-4 shadow-[0_20px_50px_rgba(26,58,92,0.3)] border border-system-blue-light transition-all duration-700 ${pricingReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "200ms" }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-system-red to-system-amber text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg">Most Popular</div>
              <h3 className="text-xl font-serif font-bold text-white mb-2">Professional</h3>
              <div className="text-4xl font-bold text-white mb-4">$29<span className="text-lg text-white/50 font-normal">/mo</span></div>
              <p className="text-white/70 mb-6 text-sm h-10">Ideal for growing teams and professional developers.</p>
              <Link href="/register" className="btn-primary w-full text-center mb-8 block !bg-white !text-system-blue hover:!bg-system-gray-100 !border-transparent">Start Free Trial</Link>
              <ul className="space-y-4">
                {["Unlimited Repositories", "Advanced Security Scanning", "Architecture Visualization", "Priority Email Support", "API Rate Limit: 10,000/day"].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/90">
                    <svg className="w-5 h-5 text-system-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className={`base-card p-8 border border-system-gray-200 transition-all duration-700 ${pricingReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "300ms" }}>
              <h3 className="text-xl font-serif font-bold text-system-blue mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-system-blue mb-4">Custom</div>
              <p className="text-system-gray-800/60 mb-6 text-sm h-10">Dedicated infrastructure for large organizations.</p>
              <Link href="/contact" className="btn-outline w-full text-center mb-8 block">Contact Sales</Link>
              <ul className="space-y-4">
                {["Custom Integrations", "On-Premise Deployment", "Dedicated Account Manager", "Custom SLA", "Unlimited API Limits"].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-system-gray-800/80">
                    <svg className="w-5 h-5 text-system-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" ref={testimonialsReveal.ref} className="py-24 px-6 bg-system-bg-light">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${testimonialsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-system-red font-semibold text-sm uppercase tracking-widest">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-system-blue mt-3 mb-4">
              Loved by Developers
            </h2>
            <div className="decorative-divider-thin max-w-xs mx-auto mt-8" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`base-card p-8 transition-all duration-700 ${
                  testimonialsReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="flex text-system-amber text-lg mb-4">
                  {Array(t.rating).fill(null).map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <p className="text-system-gray-800/70 leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-system-blue to-system-red flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-system-blue">{t.name}</div>
                    <div className="text-sm text-system-gray-800/50">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section ref={ctaReveal.ref} className="py-24 px-6 relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #0F2440 0%, #1A3A5C 50%, #2C5A8C 100%)",
      }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 opacity-5">
            <SystemIcon className="w-40 h-40" />
          </div>
        </div>

        <div className={`relative z-10 max-w-3xl mx-auto text-center transition-all duration-700 ${
          ctaReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
            Ready to Transform Your Development?
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Join 10,000+ developers who are shipping better code with DevForge. Free to start, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="base-input flex-1 !bg-white/10 !border-white/20 !text-white placeholder:text-white/40 focus:!border-system-amber"
            />
            <Link href="/register" className="btn-primary !rounded-xl whitespace-nowrap">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-system-gray-900 text-white/60 pt-2 pb-12">
        <div className="decorative-divider mb-16" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <SystemIcon className="w-7 h-7" />
                <span className="text-white font-serif font-bold text-lg">DevForge</span>
              </div>
              <p className="text-sm leading-relaxed">
                Intelligent developer tools, built with modern engineering excellence and precision.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-system-amber transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-system-amber transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-system-amber transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-system-amber transition-colors">Roadmap</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-system-amber transition-colors">About</a></li>
                <li><a href="#" className="hover:text-system-amber transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-system-amber transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-system-amber transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-system-amber transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-system-amber transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-system-amber transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-system-amber transition-colors">Community</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-system-amber transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-system-amber transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-system-amber transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; 2026 DevForge. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-system-amber transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a href="#" className="hover:text-system-amber transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="hover:text-system-amber transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== VIDEO / DEMO MODAL ===== */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 animate-fade-in" onClick={() => { setShowVideoModal(false); setDemoPlaying(false); }}>
          <div className="relative w-full max-w-5xl aspect-video bg-system-blue-dark rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => { setShowVideoModal(false); setDemoPlaying(false); }}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-system-red transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {!demoPlaying ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-white relative">
                <div className="absolute inset-0 bg-gradient-to-br from-system-blue/50 to-system-red/30 mix-blend-overlay" />
                <div 
                  className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 cursor-pointer hover:bg-system-red hover:scale-110 transition-all duration-300 backdrop-blur-md z-10"
                  onClick={() => setDemoPlaying(true)}
                >
                  <svg className="w-10 h-10 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <h3 className="text-3xl font-serif font-bold mb-3 z-10">DevForge Live Demo</h3>
                <p className="text-white/60 text-lg z-10">Click play to watch the engine in action.</p>
              </div>
            ) : (
              <div className="w-full h-full bg-[#0a0a0a] font-mono p-6 overflow-hidden flex flex-col relative">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-system-red" />
                  <div className="w-3 h-3 rounded-full bg-system-amber" />
                  <div className="w-3 h-3 rounded-full bg-system-green" />
                  <span className="ml-4 text-white/40 text-sm">devforge-engine ~ npm run scan</span>
                </div>
                
                {/* Terminal Output */}
                <div className="flex-1 overflow-y-auto space-y-2">
                  {demoLog.map((log, idx) => (
                    <div key={idx} className={`text-sm md:text-base animate-fade-in ${
                      log && log.includes('[WARN]') ? 'text-system-amber' : 
                      log && log.includes('[OK]') ? 'text-system-green' : 
                      log && log.includes('[TIP]') ? 'text-system-blue-light text-blue-400' : 
                      'text-white/80'
                    }`}>
                      {log}
                    </div>
                  ))}
                  <div className="flex items-center text-white/80 text-sm md:text-base">
                    <span className="animate-pulse">_</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
