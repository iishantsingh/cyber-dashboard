// Get CVSS score from a CVE object
export function getCVSSScore(cve) {
  return (
    cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore ||
    cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore ||
    null
  );
}

// Return severity label + color var based on score
export function getSeverity(score) {
  if (score === null || score === undefined) return { label: 'N/A', color: 'var(--text-muted)' };
  if (score >= 9.0) return { label: 'CRITICAL', color: 'var(--accent-red)' };
  if (score >= 7.0) return { label: 'HIGH', color: 'var(--accent-yellow)' };
  if (score >= 4.0) return { label: 'MEDIUM', color: 'var(--accent-blue)' };
  return { label: 'LOW', color: 'var(--accent-green)' };
}

// Format ISO date to readable
export function formatDate(iso) {
  if (!iso) return 'Unknown';
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

// Truncate text
export function truncate(text, len = 120) {
  if (!text) return 'No description available.';
  return text.length > len ? text.slice(0, len) + '...' : text;
}

// Build severity distribution for chart
export function buildSeverityChart(items) {
  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, 'N/A': 0 };
  items.forEach(item => {
    const score = getCVSSScore(item.cve);
    const { label } = getSeverity(score);
    counts[label] = (counts[label] || 0) + 1;
  });
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));
}
