import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import styles from './UnauthorizedPage.module.css';

export default function UnauthorizedPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <ShieldAlert size={48} className={styles.icon} />
                <h1 className={styles.title}>Access Denied</h1>
                <p className={styles.description}>
                    You do not have the necessary permissions to view this page. This feature is available only to Organization Admins.
                </p>
                <Link href="/dashboard" className={styles.button}>
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
}