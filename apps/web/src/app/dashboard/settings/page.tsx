"use client";

import { useState, useEffect } from "react";

const tabs = [
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "security", label: "Security", icon: "🔒" },
  { id: "integrations", label: "Integrations", icon: "🔌" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
];

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [twoFaEnabled, setTwoFaEnabled] = useState(true);

  useEffect(() => setMounted(true), []);

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-system-blue mb-1">Account Settings</h1>
        <p className="text-system-gray-800/50 text-sm">Manage your personal preferences and security</p>
      </div>

      <div className="base-card overflow-hidden">
        {/* Mobile Tab Select */}
        <div className="sm:hidden p-4 border-b border-system-gray-200">
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value)}
            className="base-input w-full font-semibold text-system-blue"
          >
            {tabs.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row min-h-[500px]">
          {/* Desktop Tab Sidebar */}
          <div className="hidden sm:flex flex-col w-64 border-r border-system-gray-200 bg-system-gray-100/30 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 text-left ${
                  activeTab === tab.id 
                    ? "bg-white border border-system-gray-200 shadow-sm text-system-blue" 
                    : "text-system-gray-800/60 hover:text-system-gray-800 hover:bg-white/50"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 sm:p-8 animate-fade-in">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="flex items-center gap-6">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-system-red to-system-amber flex items-center justify-center text-white font-bold text-3xl shadow-lg group-hover:opacity-80 transition-opacity">
                      DK
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-system-gray-800">Profile Picture</h3>
                    <p className="text-sm text-system-gray-800/50 mb-2">JPG, GIF or PNG. Max size of 800K</p>
                    <button className="text-sm font-semibold text-system-blue hover:text-system-red transition-colors">Remove Photo</button>
                  </div>
                </div>

                <div className="decorative-divider-thin opacity-30" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-system-gray-800 mb-1.5">Full Name</label>
                    <input type="text" className="base-input" defaultValue="Kim Developer" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-system-gray-800 mb-1.5">Email</label>
                    <input type="email" className="base-input !bg-system-gray-200/30 text-system-gray-800/60" defaultValue="dev@devforge.kr" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-system-gray-800 mb-1.5">Role</label>
                    <input type="text" className="base-input" defaultValue="Senior Fullstack Engineer" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-system-gray-800 mb-1.5">Organization</label>
                    <input type="text" className="base-input !bg-system-gray-200/30 text-system-gray-800/60" defaultValue="DevForge System" disabled />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-system-gray-800 mb-1.5">Bio</label>
                    <textarea className="base-input min-h-[100px] resize-y" defaultValue="Passionate about building scalable System tools and beautiful modern interfaces." />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div className="space-y-8 animate-fade-in-up">
                <div>
                  <h3 className="text-lg font-serif font-bold text-system-blue mb-4 border-b border-system-gray-200 pb-2">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-semibold text-system-gray-800 mb-1.5">Current Password</label>
                      <input type="password" className="base-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-system-gray-800 mb-1.5">New Password</label>
                      <input type="password" className="base-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-system-gray-800 mb-1.5">Confirm New Password</label>
                      <input type="password" className="base-input" />
                    </div>
                    <button className="btn-primary !mt-6">Update Password</button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-system-blue mb-4 border-b border-system-gray-200 pb-2">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 border border-system-gray-200 rounded-xl bg-system-gray-100">
                    <div>
                      <p className="font-semibold text-system-gray-800 flex items-center gap-2">
                        Authenticator App
                        {twoFaEnabled && <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-system-green/20 text-system-green">Active</span>}
                      </p>
                      <p className="text-sm text-system-gray-800/60 mt-1">Protect your account with TOTP codes from your mobile app.</p>
                    </div>
                    <button 
                      onClick={() => setTwoFaEnabled(!twoFaEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${twoFaEnabled ? "bg-system-green" : "bg-system-gray-200"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFaEnabled ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                  {twoFaEnabled && (
                    <div className="mt-3">
                      <button className="text-sm font-semibold text-system-blue hover:underline">View backup codes</button>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-system-blue mb-4 border-b border-system-gray-200 pb-2">Active Sessions</h3>
                  <div className="space-y-3">
                    {[
                      { browser: "Chrome on Windows", ip: "192.168.1.1", time: "Current Session", current: true },
                      { browser: "Safari on iOS", ip: "10.0.0.45", time: "2 days ago", current: false },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-system-gray-200/50 hover:bg-system-gray-100/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{s.current ? "💻" : "📱"}</div>
                          <div>
                            <p className="text-sm font-semibold text-system-gray-800">{s.browser}</p>
                            <p className="text-xs text-system-gray-800/50">{s.ip} · {s.time}</p>
                          </div>
                        </div>
                        {!s.current && <button className="text-xs font-bold text-system-red hover:underline">Revoke</button>}
                        {s.current && <span className="text-xs font-bold text-system-green bg-system-green/10 px-2 py-1 rounded">Active</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* INTEGRATIONS TAB */}
            {activeTab === "integrations" && (
              <div className="space-y-6 animate-fade-in-up">
                <p className="text-system-gray-800/60 text-sm">Connect external services to unlock automated workflows.</p>
                
                {[
                  { id: "github", name: "GitHub", desc: "Import repositories and sync PR analysis automatically", connected: true, meta: "kim-devforge", icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" fill="currentColor"/></svg> },
                  { id: "slack", name: "Slack", desc: "Receive analysis alerts directly in your team channels", connected: false, icon: <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/><path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521h-6.313A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.313z" fill="#36C5F0"/><path d="M18.956 8.835a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.835zM17.688 8.835a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.313z" fill="#2EB67D"/><path d="M15.165 18.958a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.523-2.52h-2.52v-2.522zM15.165 17.687a2.527 2.527 0 0 1-2.523-2.522 2.528 2.528 0 0 1 2.523-2.521h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.522h-6.313z" fill="#ECB22E"/></svg> },
                  { id: "jira", name: "Jira", desc: "Create tickets automatically for critical security findings", connected: false, icon: <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none"><path d="M11.66 19.34a2.828 2.828 0 010-4l1.32-1.32c1.1-1.1 2.88-1.1 3.98 0l2.38 2.38c1.1 1.1 1.1 2.88 0 3.98l-2.38 2.38c-1.1 1.1-2.88 1.1-3.98 0l-1.32-1.32v-.12zm-4.44-4.44a2.828 2.828 0 010-4l3.66-3.66c1.1-1.1 2.88-1.1 3.98 0l2.38 2.38c1.1 1.1 1.1 2.88 0 3.98l-2.38 2.38c-1.1 1.1-2.88 1.1-3.98 0L7.22 14.9zM2.8 10.46a2.828 2.828 0 010-4l1.32-1.32c1.1-1.1 2.88-1.1 3.98 0L10.48 7.5c1.1 1.1 1.1 2.88 0 3.98L8.1 13.86c-1.1 1.1-2.88 1.1-3.98 0L2.8 10.46z" fill="#2684FF"/></svg> }
                ].map(app => (
                  <div key={app.id} className="flex items-center gap-4 p-5 rounded-xl border border-system-gray-200 hover:shadow-sm transition-shadow bg-white">
                    <div className="flex-shrink-0 text-system-gray-800">{app.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-system-blue">{app.name}</h4>
                        {app.connected && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-system-green/20 text-system-green">Connected</span>}
                      </div>
                      <p className="text-sm text-system-gray-800/60 truncate">{app.desc}</p>
                      {app.meta && <p className="text-xs text-system-blue font-mono mt-1">{app.meta}</p>}
                    </div>
                    <div>
                      {app.connected ? (
                        <button className="btn-outline !py-1.5 !px-4 !text-sm hover:!bg-system-red hover:!text-white hover:!border-system-red">Disconnect</button>
                      ) : (
                        <button className="btn-primary !py-1.5 !px-4 !text-sm">Connect</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <div className="space-y-6 animate-fade-in-up">
                <p className="text-system-gray-800/60 text-sm mb-4">Choose what updates you want to receive and how.</p>
                
                <div className="space-y-4">
                  {[
                    { title: "Weekly Digest", desc: "A summary of your repository health and analysis trends", email: true, push: false },
                    { title: "Analysis Completed", desc: "Get notified immediately when a manual analysis finishes", email: true, push: true },
                    { title: "Critical Security Alerts", desc: "Immediate alerts for exposed secrets or critical vulnerabilities", email: true, push: true },
                    { title: "New Login", desc: "Alert when a new device logs into your account", email: true, push: false },
                    { title: "Product Updates", desc: "News about platform features and updates", email: false, push: false },
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-b border-system-gray-200/50">
                      <div className="pr-4">
                        <p className="font-semibold text-system-gray-800">{notif.title}</p>
                        <p className="text-sm text-system-gray-800/50 mt-0.5">{notif.desc}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-system-gray-200 text-system-blue focus:ring-system-blue" defaultChecked={notif.email} />
                          <span className="text-sm text-system-gray-800/70">Email</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-system-gray-200 text-system-blue focus:ring-system-blue" defaultChecked={notif.push} />
                          <span className="text-sm text-system-gray-800/70">Push</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end pt-4">
                  <button className="btn-primary">Save Preferences</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
