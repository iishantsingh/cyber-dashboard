import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { toggleTheme } from '../store/themeSlice';
import styles from './Navbar.module.css';

export default function Navbar() {
  const dispatch = useDispatch();
  const theme = useSelector(s => s.theme.mode);
  const lastRefreshed = useSelector(s => s.threats.lastRefreshed);

  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <span className={styles.logo}>⬡</span>
        <span className={styles.title}>CyberIntel</span>
        <span className={styles.badge}>LIVE</span>
      </div>

      <div className={styles.links}>
        <NavLink to="/" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} end>
          Dashboard
        </NavLink>
        <NavLink to="/threats" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          Threats
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          About
        </NavLink>
      </div>

      <div className={styles.right}>
        {lastRefreshed && (
          <span className={styles.refreshTime}>
            Updated {new Date(lastRefreshed).toLocaleTimeString()}
          </span>
        )}
        <button className={styles.themeBtn} onClick={() => dispatch(toggleTheme())} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}
