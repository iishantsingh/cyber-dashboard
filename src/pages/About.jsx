import styles from './About.module.css';

const FEATURES = [
  { icon: '🔴', title: 'Real-time CVE Feed', desc: 'Fetches live vulnerability data from the NVD (National Vulnerability Database) API.' },
  { icon: '🔍', title: 'Search & Filter', desc: 'Debounced search + severity filter to quickly find the threats that matter.' },
  { icon: '📊', title: 'Dashboard Charts', desc: 'Pie and bar charts (Recharts) showing severity distribution and CVSS scores.' },
  { icon: '🌙', title: 'Dark / Light Mode', desc: 'Theme toggle stored in Redux and applied via CSS variables globally.' },
  { icon: '📄', title: 'Pagination', desc: 'Navigate large result sets efficiently, 8 items per page.' },
  { icon: '⚡', title: 'Debounced API Calls', desc: 'Custom useDebounce hook prevents excessive API calls during typing.' },
  { icon: '🛡️', title: 'Error Boundary', desc: 'React class-based Error Boundary catches render errors gracefully.' },
  { icon: '🔄', title: 'Auto Refresh', desc: 'Data auto-refreshes every 60 seconds using useEffect + setInterval.' },
];

const STACK = [
  'React 18 (Vite)', 'Redux Toolkit', 'React Router v6',
  'Axios + Fetch API', 'Recharts', 'CSS Modules',
  'NVD CVE API (Public)', 'Vercel/Netlify Deploy',
];

export default function About() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.heroIcon}>⬡</span>
        <h1 className={styles.title}>Cyber Threat Intelligence Dashboard</h1>
        <p className={styles.sub}>
          A real-time cybersecurity awareness platform providing insights into emerging vulnerabilities,
          breaches, and CVE data — built as a React capstone project.
        </p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Advanced Features</h2>
        <div className={styles.featGrid}>
          {FEATURES.map(f => (
            <div key={f.title} className={styles.featCard}>
              <span className={styles.featIcon}>{f.icon}</span>
              <div>
                <h3 className={styles.featTitle}>{f.title}</h3>
                <p className={styles.featDesc}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tech Stack</h2>
        <div className={styles.stack}>
          {STACK.map(s => <span key={s} className={styles.tag}>{s}</span>)}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Data Source</h2>
        <div className={styles.sourceCard}>
          <p>This dashboard uses the <strong>NVD CVE 2.0 API</strong> — a free, public API by NIST that provides a comprehensive database of known cybersecurity vulnerabilities.</p>
          <a href="https://nvd.nist.gov/developers/vulnerabilities" target="_blank" rel="noopener noreferrer" className={styles.apiLink}>
            View NVD API Docs →
          </a>
        </div>
      </section>
    </div>
  );
}
