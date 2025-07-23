'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client';
import ProfileForm from '@/components/profile/ProfileForm';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
    const { status } = useSession();
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'authenticated') {
            const fetchProfile = async () => {
                try {
                    const data = await api.get('/api/auth/me');
                    setUserData(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProfile();
        }
        if (status === 'unauthenticated') {
            setIsLoading(false);
        }
    }, [status]);

    const renderContent = () => {
        if (isLoading || status === 'loading') {
            return <div className={styles.loadingState}><Loader2 className={styles.loaderIcon} /></div>;
        }
        if (error) {
            return <p>Error: {error}</p>;
        }
        if (!userData) {
            return <p>Could not load user profile.</p>;
        }
        return <ProfileForm initialData={userData} />;
    };

    return (
        <div className={styles.container}>
            <a href="/dashboard" className={styles.backButton}>
                <ArrowLeft size={16} />
                <span>Back to Dashboard</span>
            </a>
            <h1 className={styles.title}>My Profile</h1>
            <p className={styles.description}>
                Update your personal details and manage your profile picture.
            </p>
            <div className={styles.formContainer}>
                {renderContent()}
            </div>
        </div>
    );
}