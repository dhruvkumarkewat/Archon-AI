import { NextRequest, NextResponse } from 'next/server';
import { suggestArchitecture } from '@/lib/gemini/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Missing required field: description' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured on server' },
        { status: 500 }
      );
    }

    const architecture = await suggestArchitecture(description);

    return NextResponse.json({ success: true, data: { architecture } });
  } catch (error) {
    console.error('Architecture API error:', error);
    return NextResponse.json(
      { error: 'Internal server error during architecture generation' },
      { status: 500 }
    );
  }
}
