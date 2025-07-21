import RoomTypeSearchForm from '@/components/search/RoomTypeSearchForm';
import styles from './FindRoomPage.module.css';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function FindRoomPage() {
  return (
    <div className={styles.container}>
      <a href="/dashboard" className={styles.backButton}><ArrowLeft size={16} /><span>Back to Dashboard</span></a>
      <div className={styles.header}>
        <h1 className={styles.title}>Find a Space</h1>
        <p className={styles.description}>
          Select your criteria to find the perfect available space for your needs.
        </p>
      </div>
      <RoomTypeSearchForm />
    </div>
  );
}