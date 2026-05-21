"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const stats = [
  { icon: "📁", label: "Repositories", value: 12, trend: "+3", trendUp: true, color: "#1A3A5C" },
  { icon: "🔍", label: "Analyses Run", value: 47, trend: "+12%", trendUp: true, color: "#C0392B" },
  { icon: "🔑", label: "API Keys", value: 3, trend: "0", trendUp: true, color: "#B8860B" },
  { icon: "👥", label: "Team Members", value: 8, trend: "+2", trendUp: true, color: "#4A8B6F" },
];

const recentActivity = [
  { type: "analysis", icon: "🔍", text: "Analysis completed on frontend-app", time: "2 minutes ago", color: "#C0392B" },
  { type: "commit", icon: "📝", text: "New commit pushed to api-service", time: "15 minutes ago", color: "#1A3A5C" },
  { type: "key", icon: "🔑", text: "API key 'Production Key' was rotated", time: "1 hour ago", color: "#B8860B" },
  { type: "member", icon: "👤", text: "Lee Soyeon joined the organization", time: "3 hours ago", color: "#4A8B6F" },
  { type: "docs", icon: "📄", text: "API documentation regenerated", time: "5 hours ago", color: "#2C5A8C" },
];

const severityData = [
  { label: "Critical", count: 4, max: 50, color: "#C0392B" },
  { label: "High", count: 12, max: 50, color: "#E67E22" },
  { label: "Medium", count: 23, max: 50, color: "#B8860B" },
  { label: "Low", count: 38, max: 50, color: "#4A8B6F" },
];

const recentRepos = [
  { name: "frontend-app", lang: "TypeScript", langColor: "#3178C6", lastAnalyzed: "2 min ago", findings: 7, status: "Needs Review", statusColor: "#B8860B" },
  { name: "api-service", lang: "Go", langColor: "#00ADD8", lastAnalyzed: "1 hour ago", findings: 2, status: "Healthy", statusColor: "#4A8B6F" },
  { name: "ml-pipeline", lang: "Python", langColor: "#3776AB", lastAnalyzed: "3 hours ago", findings: 15, status: "Critical", statusColor: "#C0392B" },
  { name: "mobile-app", lang: "Kotlin", langColor: "#A97BFF", lastAnalyzed: "1 day ago", findings: 5, status: "Needs Review", statusColor: "#B8860B" },
  { name: "infra-config", lang: "YAML", langColor: "#CB171E", lastAnalyzed: "2 days ago", findings: 0, status: "Healthy", statusColor: "#4A8B6F" },
];

function AnimatedNumber({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const dur = 1500;
    const steps = 40;
    const inc = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, dur / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <>{count}</>;
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className={`space-y-6 transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
      {/* Welcome Banner */}
      <div className="rounded-2xl p-8 text-white relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #1A3A5C 0%, #2C5A8C 50%, #1A3A5C 100%)",
      }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-system-red/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-system-amber/10 rounded-full blur-[60px]" />
        <div className="relative z-10">
          <p className="text-white/50 text-sm mb-1">{today}</p>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2">Welcome back, Developer 👋</h1>
          <p className="text-white/60 max-w-lg">Your codebase is looking good. 3 new analyses completed since your last visit.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="base-card p-6 group" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${stat.color}10` }}>
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? "bg-system-green/10 text-system-green" : "bg-system-red/10 text-system-red"}`}>
                ↑ {stat.trend}
              </span>
            </div>
            <p className="text-3xl font-serif font-bold text-system-blue">
              <AnimatedNumber value={stat.value} />
            </p>
            <p className="text-sm text-system-gray-800/50 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two Column */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 base-card p-6">
          <h2 className="text-lg font-serif font-bold text-system-blue mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-system-gray-100/50 transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${item.color}10` }}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-system-gray-800 font-medium">{item.text}</p>
                  <p className="text-xs text-system-gray-800/40 mt-0.5">{item.time}</p>
                </div>
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: item.color }} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="base-card p-6">
          <h2 className="text-lg font-serif font-bold text-system-blue mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🔍", label: "New Analysis", href: "/dashboard/analysis", color: "#C0392B" },
              { icon: "📄", label: "Generate Docs", href: "/dashboard/docs", color: "#1A3A5C" },
              { icon: "🏗️", label: "View Architecture", href: "/dashboard/architecture", color: "#4A8B6F" },
              { icon: "🔑", label: "Create API Key", href: "/dashboard/api-keys", color: "#B8860B" },
            ].map((action, i) => (
              <Link key={i} href={action.href} className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-system-gray-200 hover:border-system-blue/30 hover:bg-system-blue/5 transition-all group cursor-pointer">
                <span className="text-2xl group-hover:scale-110 transition-transform">{action.icon}</span>
                <span className="text-xs font-semibold text-system-gray-800/70 group-hover:text-system-blue text-center">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Severity Chart */}
      <div className="base-card p-6">
        <h2 className="text-lg font-serif font-bold text-system-blue mb-6">Findings by Severity</h2>
        <div className="space-y-4">
          {severityData.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm font-medium text-system-gray-800/70 w-16">{item.label}</span>
              <div className="flex-1 h-8 bg-system-gray-200/50 rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg flex items-center px-3 transition-all duration-1000 ease-out"
                  style={{
                    width: mounted ? `${(item.count / item.max) * 100}%` : "0%",
                    background: item.color,
                    transitionDelay: `${i * 200}ms`,
                  }}
                >
                  <span className="text-white text-xs font-bold">{item.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Repositories Table */}
      <div className="base-card p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-serif font-bold text-system-blue">Recent Repositories</h2>
          <Link href="/dashboard/repositories" className="text-sm text-system-red font-semibold hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-system-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-system-gray-800/50 text-xs uppercase tracking-wider">Repository</th>
                <th className="text-left py-3 px-4 font-semibold text-system-gray-800/50 text-xs uppercase tracking-wider">Language</th>
                <th className="text-left py-3 px-4 font-semibold text-system-gray-800/50 text-xs uppercase tracking-wider">Last Analyzed</th>
                <th className="text-left py-3 px-4 font-semibold text-system-gray-800/50 text-xs uppercase tracking-wider">Findings</th>
                <th className="text-left py-3 px-4 font-semibold text-system-gray-800/50 text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRepos.map((repo, i) => (
                <tr key={i} className="border-b border-system-gray-200/50 hover:bg-system-gray-100/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-system-blue">{repo.name}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ background: repo.langColor }} />
                      {repo.lang}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-system-gray-800/50">{repo.lastAnalyzed}</td>
                  <td className="py-3 px-4 font-semibold">{repo.findings}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: `${repo.statusColor}15`, color: repo.statusColor }}>
                      {repo.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
