export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  settings: {
    enforce2fa?: boolean;
    allowedDomains?: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  organizationId: string;
  email: string;
  fullName: string;
  role: 'viewer' | 'developer' | 'admin';
  status: 'pending_verification' | 'active' | 'suspended' | 'deleted';
  totpEnabled: boolean;
  lastLoginAt?: string;
  created_at: string;
  updated_at: string;
}

export interface APIKey {
  id: string;
  organizationId: string;
  userId: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  expiresAt?: string;
  lastUsedAt?: string;
  revokedAt?: string;
  requestCount: number;
  created_at: string;
  updated_at: string;
}

export interface Repository {
  id: string;
  organizationId: string;
  githubRepoId: number;
  fullName: string;
  defaultBranch: string;
  language?: string;
  private: boolean;
  lastSyncedAt?: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AnalysisJob {
  id: string;
  repositoryId: string;
  triggeredBy?: string;
  branch: string;
  commitSha?: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  jobType: 'full' | 'incremental' | 'security' | 'docs';
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface AnalysisFinding {
  id: string;
  jobId: string;
  filePath: string;
  lineStart?: number;
  lineEnd?: number;
  category: 'bug' | 'security' | 'code_smell' | 'performance' | 'documentation';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  ruleId?: string;
  title: string;
  description?: string;
  suggestion?: string;
  codeSnippet?: string;
  confidence?: number;
  dismissed: boolean;
  dismissedBy?: string;
  created_at: string;
}

export interface APIDocumentation {
  id: string;
  repositoryId: string;
  version: string;
  specFormat: string;
  specJson: Record<string, any>;
  htmlUrl?: string;
  pdfUrl?: string;
  generatedBy?: string;
  created_at: string;
}

export interface ArchitectureSnapshot {
  id: string;
  repositoryId: string;
  graphData: {
    nodes: Array<{ id: string; label: string; type: string; [key: string]: any }>;
    edges: Array<{ source: string; target: string; label?: string; [key: string]: any }>;
    metadata?: Record<string, any>;
  };
  diagramSvg?: string;
  customLayout?: Record<string, any>;
  annotations: any[];
  created_at: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  actorId?: string;
  actorType: 'user' | 'system' | 'api_key';
  apiKeyId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata: Record<string, any>;
  created_at: string;
}
