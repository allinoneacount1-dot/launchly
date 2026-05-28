export interface ValidationError {
  field: string;
  message: string;
}

export interface TokenForm {
  name: string;
  symbol: string;
  supply: string;
  decimals: string;
  description: string;
  logo: string;
  website: string;
  twitter: string;
  telegram: string;
}

export function validateTokenForm(form: TokenForm): ValidationError[] {
  const errors: ValidationError[] = [];

  // Name
  if (!form.name.trim()) {
    errors.push({ field: 'name', message: 'Token name is required' });
  } else if (form.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  } else if (form.name.trim().length > 64) {
    errors.push({ field: 'name', message: 'Name must be 64 characters or less' });
  }

  // Symbol
  if (!form.symbol.trim()) {
    errors.push({ field: 'symbol', message: 'Token symbol is required' });
  } else if (form.symbol.trim().length < 2) {
    errors.push({ field: 'symbol', message: 'Symbol must be at least 2 characters' });
  } else if (form.symbol.trim().length > 12) {
    errors.push({ field: 'symbol', message: 'Symbol must be 12 characters or less' });
  } else if (!/^[A-Za-z0-9]+$/.test(form.symbol.trim())) {
    errors.push({ field: 'symbol', message: 'Symbol must contain only letters and numbers' });
  }

  // Supply
  if (!form.supply.trim()) {
    errors.push({ field: 'supply', message: 'Total supply is required' });
  } else {
    const supplyNum = Number(form.supply.replace(/,/g, ''));
    if (isNaN(supplyNum) || supplyNum <= 0) {
      errors.push({ field: 'supply', message: 'Supply must be a positive number' });
    } else if (supplyNum > 1e15) {
      errors.push({ field: 'supply', message: 'Supply cannot exceed 1 quadrillion' });
    } else if (!Number.isInteger(supplyNum)) {
      errors.push({ field: 'supply', message: 'Supply must be a whole number' });
    }
  }

  // Decimals
  const decNum = Number(form.decimals);
  if (isNaN(decNum) || decNum < 0 || decNum > 18) {
    errors.push({ field: 'decimals', message: 'Decimals must be between 0 and 18' });
  } else if (!Number.isInteger(decNum)) {
    errors.push({ field: 'decimals', message: 'Decimals must be a whole number' });
  }

  // URL validations (optional fields)
  if (form.logo && !isValidUrl(form.logo)) {
    errors.push({ field: 'logo', message: 'Logo must be a valid URL' });
  }
  if (form.website && !isValidUrl(form.website)) {
    errors.push({ field: 'website', message: 'Website must be a valid URL' });
  }

  // Twitter handle cleanup
  if (form.twitter && form.twitter.includes('twitter.com/')) {
    errors.push({ field: 'twitter', message: 'Enter only the handle, not the full URL' });
  }

  return errors;
}

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // strip < and > to prevent basic XSS
    .trim();
}
