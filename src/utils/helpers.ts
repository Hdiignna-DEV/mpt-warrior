// Utility functions untuk berbagai keperluan

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency === "USD" ? "USD" : "IDR",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatDate(date: Date | string, format: "short" | "long" = "short"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions =
    format === "short"
      ? { day: "2-digit", month: "2-digit", year: "2-digit" }
      : { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" };
  return d.toLocaleDateString("id-ID", options);
}

export function calculateWinRate(wins: number, total: number): number {
  return total === 0 ? 0 : (wins / total) * 100;
}

export function calculateProfitFactor(profits: number, losses: number): number {
  return losses === 0 ? profits : profits / Math.abs(losses);
}

export function calculateRiskRewardRatio(entryPrice: number, stopLoss: number, takeProfit: number): number {
  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(takeProfit - entryPrice);
  return risk === 0 ? 0 : reward / risk;
}

export function calculatePips(entryPrice: number, exitPrice: number, pipsPerPoint = 1): number {
  return (exitPrice - entryPrice) * pipsPerPoint * 10000;
}

export function calculatePositionSize(
  accountBalance: number,
  riskPercent: number,
  stopLossPips: number,
  pipValue = 10
): number {
  const riskAmount = (accountBalance * riskPercent) / 100;
  return riskAmount / (stopLossPips * pipValue);
}

export function calculateDrawdown(peakBalance: number, currentBalance: number): number {
  return ((currentBalance - peakBalance) / peakBalance) * 100;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

export function generateId(prefix = ""): string {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function round(value: number, decimals = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function getDayOfWeek(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  return days[d.getDay()];
}

export function getMonthName(monthIndex: number): string {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return months[monthIndex] || "";
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isWithinRange(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate;
}

export function getTimeRemaining(targetDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}
