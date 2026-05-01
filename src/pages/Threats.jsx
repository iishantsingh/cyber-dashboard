import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThreats, setSearch, setFilter, setSort, selectFilteredThreats } from '../store/threatsSlice';
import { useDebounce } from '../hooks/useDebounce';
import ThreatCard from '../components/ThreatCard';
import Pagination from '../components/Pagination';
import styles from './Threats.module.css';

const KEYWORDS = ['critical', 'ransomware', 'injection', 'overflow', 'authentication'];

export default function Threats() {
  const dispatch = useDispatch();
  const status = useSelector(s => s.threats.status);
  const error = useSelector(s => s.threats.error);
  const { searchQuery, filterSeverity, sortBy, currentPage, itemsPerPage } = useSelector(s => s.threats);
  const filtered = useSelector(selectFilteredThreats);

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [activeKeyword, setActiveKeyword] = useState('critical');

  // Debounced API search
  const debouncedSearch = useDebounce(localSearch, 400);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  // Fetch when keyword changes
  function handleKeyword(kw) {
    setActiveKeyword(kw);
    dispatch(fetchThreats(kw));
  }

  useEffect(() => {
    dispatch(fetchThreats('critical'));
  }, [dispatch]);

  // Paginate
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>Threat Feed</h1>
        <p className={styles.count}>{filtered.length} vulnerabilities found</p>
      </div>

      {/* Keyword chips */}
      <div className={styles.keywords}>
        {KEYWORDS.map(kw => (
          <button
            key={kw}
            className={`${styles.chip} ${activeKeyword === kw ? styles.chipActive : ''}`}
            onClick={() => handleKeyword(kw)}
          >
            {kw}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <input
          className={styles.search}
          type="text"
          placeholder="🔍  Search CVEs..."
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
        />

        <select className={styles.select} value={filterSeverity} onChange={e => dispatch(setFilter(e.target.value))}>
          <option value="all">All Severities</option>
          <option value="critical">Critical (≥9.0)</option>
          <option value="high">High (7–8.9)</option>
          <option value="medium">Medium (4–6.9)</option>
          <option value="low">Low (&lt;4)</option>
        </select>

        <select className={styles.select} value={sortBy} onChange={e => dispatch(setSort(e.target.value))}>
          <option value="date">Sort: Newest First</option>
          <option value="score_desc">Sort: Score High→Low</option>
          <option value="score_asc">Sort: Score Low→High</option>
        </select>
      </div>

      {/* States */}
      {status === 'loading' && (
        <div className={styles.center}>
          <div className={styles.spinner}></div>
          <p>Loading threats...</p>
        </div>
      )}

      {status === 'failed' && (
        <div className={styles.error}>
          ⚠️ API Error: {error}
          <button onClick={() => dispatch(fetchThreats(activeKeyword))} className={styles.retryBtn}>
            Retry
          </button>
        </div>
      )}

      {status === 'succeeded' && paginated.length === 0 && (
        <div className={styles.center}>
          <p>No threats match your search.</p>
        </div>
      )}

      {/* Cards */}
      <div className={styles.grid}>
        {paginated.map((item, i) => (
          <ThreatCard key={item.cve?.id || i} item={item} />
        ))}
      </div>

      <Pagination totalItems={filtered.length} />
    </div>
  );
}
