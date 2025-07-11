'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import MemberCard from './MemberCard';
import styles from './MemberList.module.css';

export default function MemberList({ initialUsers }: { initialUsers: any[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        if (!searchTerm) {
            return initialUsers;
        }
        return initialUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, initialUsers]);

    return (
        <div>
            <div className={styles.searchContainer}>
                <Search className={styles.searchIcon} size={20} />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
            
            {filteredUsers.length > 0 ? (
                <div className={styles.grid}>
                    {filteredUsers.map(user => <MemberCard key={user.id} user={user} />)}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <h3>No Members Found</h3>
                    <p>Your search for "{searchTerm}" did not match any members.</p>
                </div>
            )}
        </div>
    );
}