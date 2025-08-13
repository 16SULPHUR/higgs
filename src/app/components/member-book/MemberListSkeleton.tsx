import styles from './MemberListSkeleton.module.css';

export default function MemberListSkeleton({ cards = 8 }: { cards?: number }) {
  return (
    <div>
      <div className={styles.searchBarSkeleton} />
      <div className={styles.grid}>
        {Array.from({ length: cards }).map((_, i) => (
          <div className={styles.card} key={i}>
            <div className={styles.avatar} />
            <div className={styles.lines}>
              <div className={`${styles.line} ${styles.lineLong}`} />
              <div className={`${styles.line} ${styles.lineShort}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



