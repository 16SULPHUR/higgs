
import RoomSearchForm from '@/components/search/RoomSearchForm';
import styles from './FindRoomPage.module.css';

export default function FindRoomPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Find a Meeting Room</h1>
      </div>
      <RoomSearchForm />
    </div>
  );
}