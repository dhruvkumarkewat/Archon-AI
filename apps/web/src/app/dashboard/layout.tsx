"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

function SystemIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

const navItems = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/dashboard/repositories", icon: "📁", label: "Repositories" },
  { href: "/dashboard/analysis", icon: "🔍", label: "Analysis" },
  { href: "/dashboard/docs", icon: "📄", label: "API Docs" },
  { href: "/dashboard/architecture", icon: "🏗️", label: "Architecture" },
  { href: "/dashboard/api-keys", icon: "🔑", label: "API Keys" },
  { href: "/dashboard/settings", icon: "⚙️", label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications] = useState(3);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const displayName = user?.displayName || "Admin User";
  const initials = displayName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "AU";
  const displayEmail = user?.email || "admin@devforge.system";

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-system-gray-100">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-72"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `} style={{ background: "linear-gradient(180deg, #1A3A5C 0%, #0F2440 100%)" }}>
        {/* Red top border */}
        <div className="h-1 bg-gradient-to-r from-system-red via-system-amber to-system-green flex-shrink-0" />

        {/* Logo */}
        <div className={`flex items-center gap-3 p-5 ${collapsed ? "justify-center" : ""}`}>
          <SystemIcon className="w-9 h-9 flex-shrink-0" />
          {!collapsed && (
            <span className="text-xl font-serif font-bold text-white whitespace-nowrap">
              Dev<span className="text-system-red-light">Forge</span>
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive(item.href)
                  ? "bg-white/10 text-white border-l-4 border-system-red ml-0 pl-3"
                  : "text-white/50 hover:text-white hover:bg-white/5"
                }
                ${collapsed ? "justify-center !px-0" : ""}
              `}
              title={collapsed ? item.label : undefined}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className={`p-4 border-t border-white/10 ${collapsed ? "flex justify-center" : ""}`}>
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-system-red to-system-amber flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{displayName}</p>
                <p className="text-white/40 text-xs truncate">System Admin</p>
              </div>
              <button onClick={handleLogout} className="p-2 text-white/30 hover:text-white/70 transition-colors" title="Sign Out">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-system-red to-system-amber flex items-center justify-center text-white font-bold text-sm">
              {initials}
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-system-blue border-2 border-system-gray-100 items-center justify-center text-white hover:bg-system-red transition-colors shadow-lg"
        >
          <svg className={`w-3 h-3 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-72"}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass border-b border-system-gray-200/50">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-system-gray-800 hover:bg-system-gray-200 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Search */}
              <div className="relative hidden sm:block">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-system-gray-800/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Search..." className="base-input !py-2 !pl-10 !pr-4 !w-64 !text-sm !rounded-xl !bg-system-gray-100/50" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 text-system-gray-800/50 hover:text-system-gray-800 hover:bg-system-gray-200 rounded-xl transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-system-red text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-system-gray-200 transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-system-red to-system-amber flex items-center justify-center text-white font-bold text-xs">
                    {initials}
                  </div>
                  <svg className={`w-4 h-4 text-system-gray-800/40 transition-transform hidden sm:block ${userMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 base-card p-2 shadow-xl animate-fade-in-up z-50">
                    <div className="px-3 py-2 border-b border-system-gray-200 mb-1">
                      <p className="font-semibold text-system-gray-800 text-sm">{displayName}</p>
                      <p className="text-xs text-system-gray-800/40">{displayEmail}</p>
                    </div>
                    <Link href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-system-gray-800 hover:bg-system-gray-100 transition-colors">⚙️ Settings</Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-system-red hover:bg-system-red/5 transition-colors">🚪 Sign Out</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
