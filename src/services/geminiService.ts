import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ParsedExpense {
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'expense' | 'income';
}

export async function parseExpenseFromText(
  text: string,
  categories: string[],
  today: string
): Promise<ParsedExpense> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key not configured. Add VITE_GEMINI_API_KEY to .env');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

  const prompt = `Extract expense details from the text below and return ONLY a valid JSON object.

Available categories: ${categories.join(', ')}
Today's date: ${today}

Rules:
- amount: positive number (extract numeric value only, no currency symbols). MUST BE A NUMBER.
- description: short clean description (3-6 words)
- category: must exactly match one of the available categories
- date: YYYY-MM-DD format (resolve relative terms: "today"="${today}", "yesterday"=1 day before today, "last week"=7 days ago)
- type: "expense" for spending/paying/bought, "income" for receiving/earning/salary/got paid

Text: "${text}"

Return ONLY the JSON object. Do not include markdown fences, explanations, or any other text.`;

  let result;
  try {
    result = await model.generateContent(prompt);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/api.?key|401|403|invalid|not valid/i.test(msg)) {
      throw new Error('Invalid Gemini API key. Get a free key at aistudio.google.com and update VITE_GEMINI_API_KEY in .env');
    }
    if (/network|fetch|ECONNREFUSED/i.test(msg)) {
      throw new Error('Network error — check your internet connection');
    }
    throw new Error(`Gemini error: ${msg}`);
  }

  const responseText = result.response.text().trim();

  // Robust extraction using Regex to find the first { and last }
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse response from Gemini — try rephrasing (e.g. "Spent 350 on lunch today")');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('Unexpected response format from Gemini — try rephrasing');
  }

  // Strict Validation
  const errors: string[] = [];
  if (typeof parsed.amount !== 'number' || isNaN(parsed.amount)) {
    errors.push('amount (numeric value)');
  }
  if (!parsed.description || typeof parsed.description !== 'string') {
    errors.push('description');
  }
  if (!parsed.category || !categories.some(c => c.toLowerCase() === String(parsed.category).toLowerCase())) {
    errors.push(`category (must match: ${categories.join(', ')})`);
  }
  if (!parsed.date || !/^\d{4}-\d{2}-\d{2}$/.test(parsed.date)) {
    errors.push('date (YYYY-MM-DD)');
  }

  if (errors.length > 0) {
    throw new Error(`Gemini failed to extract: ${errors.join(', ')}. Please try being more specific.`);
  }

  // Normalize category name to match original list casing
  const originalCategory = categories.find(c => c.toLowerCase() === String(parsed.category).toLowerCase());
  
  return {
    amount: parsed.amount,
    description: parsed.description,
    category: originalCategory || parsed.category,
    date: parsed.date,
    type: parsed.type === 'income' ? 'income' : 'expense'
  };
}
