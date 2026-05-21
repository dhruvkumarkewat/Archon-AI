import { NextRequest, NextResponse } from 'next/server';
import { generateDocumentation } from '@/lib/gemini/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language } = body;

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: code, language' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured on server' },
        { status: 500 }
      );
    }

    const documentation = await generateDocumentation(code, language);

    return NextResponse.json({ success: true, data: { documentation } });
  } catch (error) {
    console.error('Documentation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error during documentation generation' },
      { status: 500 }
    );
  }
}
