import { Suspense } from 'react';
import styles from './BookingConfirmationPage.module.css';

import BookingConfirmationPageClient from './BookingConfirmationPageClient';

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.stateContainer}>
            <div>Loading...</div>
          </div>
        </div>
      }
    >
      <BookingConfirmationPageClient />
    </Suspense>
  );
}