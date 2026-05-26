// Helper functions to parse transaction notifications or banking messages

interface ParsedTransaction {
  amount: number;
  description: string;
  tag: 'Necessity' | 'Personal' | 'Pleasure';
  source: 'auto';
}

export function parseTransactionText(text: string): ParsedTransaction | null {
  // Simple regex to match typical banking transaction notification formats, e.g.:
  // "Charged $45.20 at STARBUCKS"
  // "Spent Rs. 1,200.00 on Amazon"
  
  const amountRegex = /(?:rs\.?|usd|\$|inr)\s*([\d,]+(?:\.\d{2})?)/i;
  const amountMatch = text.match(amountRegex);
  
  if (!amountMatch) return null;
  
  // Clean commas and parse amount
  const amountStr = amountMatch[1].replace(/,/g, '');
  const amount = parseFloat(amountStr);
  
  if (isNaN(amount)) return null;

  // Attempt to extract merchant/description
  let description = 'Automated Bank Alert';
  const merchantKeywords = ['at', 'on', 'to', 'from'];
  
  for (const keyword of merchantKeywords) {
    const keywordIndex = text.toLowerCase().indexOf(` ${keyword} `);
    if (keywordIndex !== -1) {
      const rest = text.substring(keywordIndex + keyword.length + 2).trim();
      if (rest) {
        description = rest.split(/[\s,.]+/)[0]; // get the first word/token as merchant
        break;
      }
    }
  }

  // Map tag heuristics based on merchant names or text context
  let tag: 'Necessity' | 'Personal' | 'Pleasure' = 'Personal';
  const textLower = text.toLowerCase();
  
  if (textLower.includes('market') || textLower.includes('grocery') || textLower.includes('fuel') || textLower.includes('gas') || textLower.includes('electricity')) {
    tag = 'Necessity';
  } else if (textLower.includes('movie') || textLower.includes('game') || textLower.includes('netflix') || textLower.includes('concert')) {
    tag = 'Pleasure';
  }

  return {
    amount,
    description,
    tag,
    source: 'auto',
  };
}
