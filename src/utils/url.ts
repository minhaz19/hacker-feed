/**
 * Extracts the domain from a URL string.
 * Falls back to the full URL if parsing fails.
 */
export function extractDomain(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Returns the Google favicon URL for a given domain.
 */
export function getFaviconUrl(domain: string, size: number = 64): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}
