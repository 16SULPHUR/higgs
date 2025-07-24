import styles from './TableSkeleton.module.css';

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export default function TableSkeleton({ rows = 5, cols = 4 }: TableSkeletonProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i}><div className={`${styles.skeleton} ${styles.skeletonHeader}`}></div></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            {Array.from({ length: cols }).map((_, j) => (
              <td key={j}><div className={styles.skeleton}></div></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}