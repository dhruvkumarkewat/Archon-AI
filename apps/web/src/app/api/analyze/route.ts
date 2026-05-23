import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code, language, filename } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required for analysis' }, { status: 400 });
    }

    // Simulate an analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // A simulated analysis result
    const hasSqlInjection = code.includes('SELECT * FROM users WHERE id =');
    const hasHardcodedAuth = code.includes('password == \'admin123\'');

    const findings = [];
    
    if (hasSqlInjection) {
      findings.push({
        id: 'f-1',
        severity: 'critical',
        category: 'Security',
        title: 'SQL Injection Vulnerability',
        description: 'The query string is constructed by concatenating user input directly into the SQL command. This exposes the application to SQL injection attacks.',
        file: filename || 'unknown',
        line: code.split('\n').findIndex((l: string) => l.includes('SELECT * FROM users')) + 1 || 0,
        suggestion: 'Use parameterized queries or an ORM/Query Builder to safely bind values.'
      });
    }

    if (hasHardcodedAuth) {
      findings.push({
        id: 'f-2',
        severity: 'high',
        category: 'Security',
        title: 'Hardcoded Credentials',
        description: 'Hardcoded passwords found in source code. This is extremely dangerous if the repository is ever compromised or made public.',
        file: filename || 'unknown',
        line: code.split('\n').findIndex((l: string) => l.includes('admin123')) + 1 || 0,
        suggestion: 'Move credentials to environment variables or a secure secrets manager.'
      });
    }

    // Default info finding
    findings.push({
      id: 'f-3',
      severity: 'info',
      category: 'Best Practices',
      title: 'Missing Input Validation',
      description: 'Consider adding explicit schema validation for incoming request bodies to ensure data integrity.',
      file: filename || 'unknown',
      line: 1,
      suggestion: 'Use a library like Zod, Joi, or Yup to validate req.body.'
    });

    const score = hasSqlInjection || hasHardcodedAuth ? 45 : 95;

    const data = {
      summary: hasSqlInjection ? 'Critical security vulnerabilities detected requiring immediate remediation.' : 'Code quality is excellent with only minor best practice suggestions.',
      score,
      findings,
      recommendations: hasSqlInjection ? [
        'Immediately refactor database queries to use parameterization.',
        'Remove hardcoded credentials from the source code.',
        'Implement input validation middleware.'
      ] : [
        'Implement input validation middleware.'
      ],
      metrics: {
        complexity: 85,
        maintainability: 70,
        reliability: 80,
        security: hasSqlInjection ? 20 : 95,
        performance: 90
      }
    };

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Internal server error during analysis' }, { status: 500 });
  }
}
