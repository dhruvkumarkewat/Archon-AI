// Self-contained demo auth system using localStorage
// No external services needed - works out of the box

export interface DemoUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  provider: 'email' | 'github' | 'google';
  organizationId?: string;
  role?: string;
  createdAt: string;
}

const USERS_KEY = 'archon_users';
const SESSION_KEY = 'archon_session';

function getUsers(): Record<string, DemoUser & { password: string }> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, DemoUser & { password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(user: DemoUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  // Dispatch a storage event so other tabs/components can react
  window.dispatchEvent(new Event('auth-change'));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('auth-change'));
}

export function getCurrentUser(): DemoUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function registerWithEmail(
  email: string,
  password: string,
  fullName: string,
  orgName?: string,
  orgSlug?: string
): Promise<DemoUser> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800));

  const users = getUsers();

  // Check if email already exists
  const existing = Object.values(users).find((u) => u.email === email);
  if (existing) {
    throw new Error('An account with this email already exists. Please sign in instead.');
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  const uid = 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const orgId = orgName ? 'org_' + Date.now() : undefined;

  const user: DemoUser & { password: string } = {
    uid,
    email,
    displayName: fullName,
    photoURL: null,
    provider: 'email',
    organizationId: orgId,
    role: 'ADMIN',
    password,
    createdAt: new Date().toISOString(),
  };

  users[uid] = user;
  saveUsers(users);

  const { password: _, ...sessionUser } = user;
  setSession(sessionUser);
  return sessionUser;
}

export async function signInWithEmail(email: string, password: string): Promise<DemoUser> {
  await new Promise((r) => setTimeout(r, 600));

  const users = getUsers();
  const found = Object.values(users).find((u) => u.email === email);

  if (!found) {
    throw new Error('No account found with this email. Please register first.');
  }

  if (found.password !== password) {
    throw new Error('Incorrect password. Please try again.');
  }

  const { password: _, ...sessionUser } = found;
  setSession(sessionUser);
  return sessionUser;
}

export async function signInWithProvider(provider: 'github' | 'google'): Promise<DemoUser> {
  await new Promise((r) => setTimeout(r, 1000));

  const demoProfiles: Record<string, { email: string; name: string }> = {
    github: { email: 'demo-github@archon.dev', name: 'GitHub Developer' },
    google: { email: 'demo-google@archon.dev', name: 'Google Developer' },
  };

  const profile = demoProfiles[provider];
  const users = getUsers();
  let found = Object.values(users).find((u) => u.email === profile.email);

  if (!found) {
    const uid = 'user_' + provider + '_' + Date.now();
    found = {
      uid,
      email: profile.email,
      displayName: profile.name,
      photoURL: null,
      provider,
      role: 'ADMIN',
      password: '',
      createdAt: new Date().toISOString(),
    };
    users[uid] = found;
    saveUsers(users);
  }

  const { password: _, ...sessionUser } = found;
  setSession(sessionUser);
  return sessionUser;
}

export async function signOut(): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
  clearSession();
}

export function onAuthChange(callback: (user: DemoUser | null) => void): () => void {
  const handler = () => callback(getCurrentUser());
  window.addEventListener('auth-change', handler);
  window.addEventListener('storage', handler);
  // Fire immediately
  callback(getCurrentUser());
  return () => {
    window.removeEventListener('auth-change', handler);
    window.removeEventListener('storage', handler);
  };
}
