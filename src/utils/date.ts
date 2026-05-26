export function getDaysLeft(timestamp: Date | string, maxDays = 30): number {
  const d = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  if (isNaN(d.getTime())) return maxDays;

  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const daysLeft = maxDays - diffDays;
  
  return Math.max(1, daysLeft);
}
