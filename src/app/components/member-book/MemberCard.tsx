'use client';

import Image from 'next/image';
import styles from './MemberCard.module.css';

const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
};

export default function MemberCard({ user }: { user: any }) {
    return (
        <div className={styles.card}>
            <div className={styles.avatarContainer}>
                {user.profile_picture ? (
                    <Image 
                        src={user.profile_picture} 
                        alt={user.name} 
                        width={64} 
                        height={64}
                        className={styles.avatar} 
                    />
                ) : (
                    <div className={styles.avatarFallback}>
                        <span>{getInitials(user.name)}</span>
                    </div>
                )}
            </div>
            <div className={styles.info}>
                <h3 className={styles.name}>{user.name}</h3>
                <p className={styles.org}>{user.organization_name || 'Individual Member'}</p>
                <a href={`mailto:${user.email}`} className={styles.email}>{user.email}</a>
            </div>
        </div>
    );
}