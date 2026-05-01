import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { fetchThreats, selectFilteredThreats } from '../store/threatsSlice';
import { buildSeverityChart, getCVSSScore, getSeverity } from '../utils/helpers';
import styles from './Dashboard.module.css';

const COLORS = {
  CRITICAL: '#ff3366',
  HIGH: '#fbbf24',
  MEDIUM: '#38bdf8',
  LOW: '#00ff88',
  'N/A': '#4a5568',
};

const STAT_CARDS = [
  { key: 'total', label: 'Total CVEs', icon: '🛡️' },
  { key: 'critical', label: 'Critical', icon: '🔴' },
  { key: 'high', label: 'High', icon: '🟠' },
  { key: 'medium', label: 'Medium', icon: '🟡' },
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const allItems = useSelector(s => s.threats.items);
  const status = useSelector(s => s.threats.status);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchThreats('critical'));
  }, [dispatch, status]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => dispatch(fetchThreats('critical')), 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const chartData = useMemo(() => buildSeverityChart(allItems), [allItems]);

  const stats = useMemo(() => {
    const counts = { total: allItems.length, critical: 0, high: 0, medium: 0 };
    allItems.forEach(item => {
      const score = getCVSSScore(item.cve);
      const { label } = getSeverity(score);
      if (label === 'CRITICAL') counts.critical++;
      if (label === 'HIGH') counts.high++;
      if (label === 'MEDIUM') counts.medium++;
    });
    return counts;
  }, [allItems]);

  // Recent 5 for bar chart
  const barData = allItems.slice(0, 8).map(item => ({
    name: item.cve?.id?.replace('CVE-', '').slice(0, 9) || '?',
    score: getCVSSScore(item.cve) || 0,
  }));

  if (status === 'loading' && allItems.length === 0) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Fetching threat intelligence...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Threat Overview</h1>
          <p className={styles.sub}>Real-time CVE data from NVD · Auto-refreshes every 60s</p>
        </div>
        <button
          className={styles.refreshBtn}
          onClick={() => dispatch(fetchThreats('critical'))}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? '⏳ Loading...' : '🔄 Refresh Now'}
        </button>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map(({ key, label, icon }) => (
          <div key={key} className={styles.statCard}>
            <span className={styles.statIcon}>{icon}</span>
            <div>
              <div className={styles.statNum}>{stats[key]}</div>
              <div className={styles.statLabel}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {allItems.length > 0 && (
        <div className={styles.chartsRow}>
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Severity Distribution</h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name] || '#888'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>CVSS Scores (Latest 8)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                <YAxis domain={[0, 10]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                <Bar dataKey="score" fill="var(--accent-green)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
