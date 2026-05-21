import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set. System features will not work.');
}

const genSystem = new GoogleGenerativeAI(apiKey || '');

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  safetySettings,
});

export interface CodeAnalysisResult {
  summary: string;
  score: number;
  findings: Finding[];
  recommendations: string[];
  metrics: CodeMetrics;
}

export interface Finding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  title: string;
  description: string;
  file: string;
  line: number;
  suggestion: string;
}

export interface CodeMetrics {
  complexity: number;
  maintainability: number;
  reliability: number;
  security: number;
  performance: number;
}

export async function analyzeCode(code: string, language: string, filename: string): Promise<CodeAnalysisResult> {
  const prompt = `You are an expert code reviewer and static analysis tool. Analyze the following ${language} code from file "${filename}" and return a comprehensive JSON analysis.

Return ONLY valid JSON with this exact structure (no markdown, no code fences):
{
  "summary": "Brief overview of the code quality",
  "score": <number 0-100 representing overall code quality>,
  "findings": [
    {
      "id": "F001",
      "severity": "critical|high|medium|low|info",
      "category": "security|performance|maintainability|reliability|style",
      "title": "Short title of the issue",
      "description": "Detailed description",
      "file": "${filename}",
      "line": <approximate line number>,
      "suggestion": "How to fix this issue"
    }
  ],
  "recommendations": ["Top recommendation 1", "Top recommendation 2"],
  "metrics": {
    "complexity": <0-100>,
    "maintainability": <0-100>,
    "reliability": <0-100>,
    "security": <0-100>,
    "performance": <0-100>
  }
}

Analyze for: bugs, security vulnerabilities, performance issues, code smells, best practices violations, and potential improvements.

CODE:
\`\`\`${language}
${code}
\`\`\``;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const text = response.text().trim();

    // Parse the JSON response, stripping any markdown fences
    const jsonStr = text.replace(/^```(?:json)?\n?/g, '').replace(/\n?```$/g, '').trim();
    const analysis: CodeAnalysisResult = JSON.parse(jsonStr);
    return analysis;
  } catch (error) {
    console.error('Gemini analysis error:', error);
    return {
      summary: 'Analysis could not be completed due to an error.',
      score: 0,
      findings: [],
      recommendations: ['Please try again or check your API key configuration.'],
      metrics: { complexity: 0, maintainability: 0, reliability: 0, security: 0, performance: 0 },
    };
  }
}

export async function generateDocumentation(code: string, language: string): Promise<string> {
  const prompt = `You are an expert technical writer. Generate comprehensive API documentation for the following ${language} code. Include:
- Overview/Description
- Function/Method signatures
- Parameters with types and descriptions
- Return values
- Usage examples
- Error handling notes

Format the output as clean Markdown.

CODE:
\`\`\`${language}
${code}
\`\`\``;

  try {
    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Documentation generation error:', error);
    return '# Error\nCould not generate documentation. Please try again.';
  }
}

export async function detectBugs(code: string, language: string): Promise<Finding[]> {
  const prompt = `You are a bug detection System. Analyze the following ${language} code for bugs, logic errors, and potential runtime issues.

Return ONLY valid JSON array (no markdown, no code fences):
[
  {
    "id": "BUG001",
    "severity": "critical|high|medium|low",
    "category": "bug",
    "title": "Short title",
    "description": "What the bug is and why it's a problem",
    "file": "submitted_code",
    "line": <line number>,
    "suggestion": "How to fix it with code example"
  }
]

CODE:
\`\`\`${language}
${code}
\`\`\``;

  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonStr = text.replace(/^```(?:json)?\n?/g, '').replace(/\n?```$/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Bug detection error:', error);
    return [];
  }
}

export async function suggestArchitecture(description: string): Promise<string> {
  const prompt = `You are a software architect. Based on the following project description, suggest an architecture with:
- System components and their responsibilities
- Data flow between components
- Technology stack recommendations
- Mermaid diagram code for the architecture
- Scalability considerations

Project Description:
${description}

Format as clean Markdown with the Mermaid diagram in a fenced code block.`;

  try {
    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Architecture suggestion error:', error);
    return '# Error\nCould not generate architecture suggestion.';
  }
}
