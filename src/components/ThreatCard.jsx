import { getCVSSScore, getSeverity, formatDate, truncate } from '../utils/helpers';
import styles from './ThreatCard.module.css';

export default function ThreatCard({ item }) {
  const cve = item.cve;
  const id = cve?.id || 'Unknown';
  const desc = cve?.descriptions?.[0]?.value || '';
  const published = cve?.published;
  const score = getCVSSScore(cve);
  const { label, color } = getSeverity(score);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.id}>{id}</span>
        <span className={styles.severity} style={{ color, borderColor: color }}>
          {label} {score !== null ? `· ${score}` : ''}
        </span>
      </div>
      <p className={styles.desc}>{truncate(desc)}</p>
      <div className={styles.footer}>
        <span className={styles.date}>📅 {formatDate(published)}</span>
        <a
          href={`https://nvd.nist.gov/vuln/detail/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          View CVE →
        </a>
      </div>
    </div>
  );
}
