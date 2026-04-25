/**
 * Converts a Unix timestamp to a human-readable relative time string.
 * e.g., "2 hours ago", "3 days ago"
 */
export function getRelativeTime(unixTimestamp: number): string {
  const now = Date.now();
  const diffMs = now - unixTimestamp * 1000;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'just now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 30) {
    return `${diffDays}d ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths}mo ago`;
  }

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y ago`;
}

/**
 * Formats a Unix timestamp to a full human-readable date string.
 * e.g., "April 23, 2026 at 5:30 PM"
 */
export function formatFullDate(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
