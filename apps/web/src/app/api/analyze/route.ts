import { NextRequest, NextResponse } from 'next/server';
import { analyzeCode, detectBugs, type CodeAnalysisResult, type Finding } from '@/lib/gemini/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language, filename, mode } = body;

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

    let result: CodeAnalysisResult | Finding[];

    if (mode === 'bugs') {
      result = await detectBugs(code, language);
    } else {
      result = await analyzeCode(code, language, filename || 'untitled');
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { error: 'Internal server error during analysis' },
      { status: 500 }
    );
  }
}
