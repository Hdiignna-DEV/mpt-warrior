/**
 * Exchange Rate Utility
 * - Fetch real-time USD to IDR conversion
 * - Cache rates to minimize API calls
 * - Fallback to fixed rate if API fails
 */

const EXCHANGE_RATE_API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
const FALLBACK_RATE = 15750; // Fallback: 1 USD = 15,750 IDR (update periodically)
const CACHE_KEY = 'mpt_exchange_rate';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

interface ExchangeRateCache {
  rate: number;
  timestamp: number;
}

interface ExchangeRateResponse {
  success: boolean;
  rates: {
    IDR: number;
  };
}

/**
 * Get cached exchange rate from localStorage
 */
function getCachedRate(): number | null {
  if (typeof window === 'undefined') return null;
  
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    const data: ExchangeRateCache = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - data.timestamp < CACHE_DURATION) {
      return data.rate;
    }
  } catch (error) {
    console.error('Error parsing cached rate:', error);
  }

  return null;
}

/**
 * Save exchange rate to localStorage cache
 */
function setCachedRate(rate: number): void {
  if (typeof window === 'undefined') return;
  
  const data: ExchangeRateCache = {
    rate,
    timestamp: Date.now(),
  };
  
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

/**
 * Fetch live exchange rate from API
 * Uses ExchangeRate-API (Free tier: 1,500 requests/month)
 */
async function fetchLiveRate(): Promise<number> {
  try {
    // Use free tier endpoint (no API key needed for basic usage)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data: ExchangeRateResponse = await response.json();
    
    if (data.success === false || !data.rates?.IDR) {
      throw new Error('Invalid API response');
    }

    return data.rates.IDR;
  } catch (error) {
    console.error('Failed to fetch live exchange rate:', error);
    throw error;
  }
}

/**
 * Get current USD to IDR exchange rate
 * - First tries cache
 * - Then fetches live rate
 * - Falls back to hardcoded rate if all fails
 */
export async function getExchangeRate(): Promise<number> {
  // Try cache first
  const cached = getCachedRate();
  if (cached) {
    console.log(`💰 Using cached exchange rate: ${cached} IDR/USD`);
    return cached;
  }

  // Try fetching live rate
  try {
    const liveRate = await fetchLiveRate();
    setCachedRate(liveRate);
    console.log(`💰 Fetched live exchange rate: ${liveRate} IDR/USD`);
    return liveRate;
  } catch (error) {
    console.warn(`⚠️ Failed to fetch exchange rate, using fallback: ${FALLBACK_RATE} IDR/USD`);
    return FALLBACK_RATE;
  }
}

/**
 * Convert USD to IDR
 */
export async function convertUSDtoIDR(usdAmount: number): Promise<number> {
  const rate = await getExchangeRate();
  return usdAmount * rate;
}

/**
 * Convert IDR to USD
 */
export async function convertIDRtoUSD(idrAmount: number): Promise<number> {
  const rate = await getExchangeRate();
  return idrAmount / rate;
}

/**
 * Get current exchange rate synchronously (uses cached value only)
 * Returns fallback rate if no cache available
 */
export function getExchangeRateSync(): number {
  return getCachedRate() || FALLBACK_RATE;
}

/**
 * Format currency based on type
 */
export function formatCurrency(amount: number, currency: 'USD' | 'IDR'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } else {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

/**
 * Initialize exchange rate cache on app load
 * Call this in _app.tsx or layout.tsx
 */
export async function initializeExchangeRate(): Promise<void> {
  try {
    await getExchangeRate();
  } catch (error) {
    console.error('Failed to initialize exchange rate:', error);
  }
}
