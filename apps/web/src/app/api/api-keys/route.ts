import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHash } from 'crypto';

// In-memory store for demo (would use Firestore in production)
interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  scopes: string[];
  createdAt: string;
  lastUsed: string | null;
  expiresAt: string | null;
  status: 'active' | 'revoked';
  usage: number[];
}

const apiKeysStore: ApiKey[] = [
  {
    id: 'key_1',
    name: 'Production Key',
    keyPrefix: 'dfk_prod_a3x9',
    keyHash: 'hashed',
    scopes: ['read', 'write', 'admin'],
    createdAt: '2024-11-15T10:30:00Z',
    lastUsed: '2024-12-20T14:22:00Z',
    expiresAt: null,
    status: 'active',
    usage: [120, 95, 140, 110, 88, 130, 155],
  },
  {
    id: 'key_2',
    name: 'Development Key',
    keyPrefix: 'dfk_dev_b7k2',
    keyHash: 'hashed',
    scopes: ['read', 'write'],
    createdAt: '2024-12-01T09:00:00Z',
    lastUsed: '2024-12-19T18:45:00Z',
    expiresAt: '2025-06-01T00:00:00Z',
    status: 'active',
    usage: [45, 62, 38, 71, 55, 49, 60],
  },
  {
    id: 'key_3',
    name: 'CI/CD Pipeline',
    keyPrefix: 'dfk_ci_m4p8',
    keyHash: 'hashed',
    scopes: ['read'],
    createdAt: '2024-10-20T15:00:00Z',
    lastUsed: '2024-12-20T06:00:00Z',
    expiresAt: null,
    status: 'active',
    usage: [200, 210, 195, 220, 205, 215, 230],
  },
];

// GET - List all API keys
export async function GET() {
  const safeKeys = apiKeysStore.map(({ keyHash, ...rest }) => rest);
  return NextResponse.json({ success: true, data: safeKeys });
}

// POST - Create a new API key
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, scopes, expiresIn } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Generate a secure random API key
    const rawKey = `dfk_${randomBytes(24).toString('base64url')}`;
    const keyHash = createHash('sha256').update(rawKey).digest('hex');
    const keyPrefix = rawKey.substring(0, 12);

    let expiresAt: string | null = null;
    if (expiresIn) {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + parseInt(expiresIn));
      expiresAt = expDate.toISOString();
    }

    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name,
      keyPrefix,
      keyHash,
      scopes: scopes || ['read'],
      createdAt: new Date().toISOString(),
      lastUsed: null,
      expiresAt,
      status: 'active',
      usage: [0, 0, 0, 0, 0, 0, 0],
    };

    apiKeysStore.push(newKey);

    // Return the full key ONLY on creation
    return NextResponse.json({
      success: true,
      data: {
        ...newKey,
        rawKey, // Only returned once!
      },
    }, { status: 201 });
  } catch (error) {
    console.error('API key creation error:', error);
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
  }
}

// DELETE - Revoke an API key
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get('id');

    if (!keyId) {
      return NextResponse.json({ error: 'Key ID is required' }, { status: 400 });
    }

    const keyIndex = apiKeysStore.findIndex(k => k.id === keyId);
    if (keyIndex === -1) {
      return NextResponse.json({ error: 'Key not found' }, { status: 404 });
    }

    apiKeysStore[keyIndex].status = 'revoked';
    return NextResponse.json({ success: true, message: 'Key revoked successfully' });
  } catch (error) {
    console.error('API key revocation error:', error);
    return NextResponse.json({ error: 'Failed to revoke key' }, { status: 500 });
  }
}
