import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CreateTicketForm from '@/components/tickets/CreateTicketForm';
import styles from '../SupportPage.module.css';

export default function NewTicketPage() {
  return (
    <div className={styles.container}>
      <Link href="/dashboard/support" className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Back to Support Center</span>
      </Link>
      <div className={styles.header}>
        <h1 className={styles.title}>Open a New Ticket</h1>
        <p className={styles.description}>Describe your issue and our team will get back to you shortly.</p>
      </div>
      <CreateTicketForm />
    </div>
  );
}