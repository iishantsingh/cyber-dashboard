import { useDispatch, useSelector } from 'react-redux';
import { setPage } from '../store/threatsSlice';
import styles from './Pagination.module.css';

export default function Pagination({ totalItems }) {
  const dispatch = useDispatch();
  const { currentPage, itemsPerPage } = useSelector(s => s.threats);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className={styles.container}>
      <button
        className={styles.btn}
        disabled={currentPage === 1}
        onClick={() => dispatch(setPage(currentPage - 1))}
      >
        ← Prev
      </button>

      <div className={styles.pages}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            className={`${styles.page} ${p === currentPage ? styles.active : ''}`}
            onClick={() => dispatch(setPage(p))}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        className={styles.btn}
        disabled={currentPage === totalPages}
        onClick={() => dispatch(setPage(currentPage + 1))}
      >
        Next →
      </button>
    </div>
  );
}
