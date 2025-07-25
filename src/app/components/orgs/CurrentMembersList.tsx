'use client';

import { useState } from 'react';
import { api } from '@/lib/api.client';
import { XCircle, Loader2 } from 'lucide-react';
import styles from './CurrentMembersList.module.css';

export default function CurrentMembersList({ members, onUpdate, session }: { members: any[], onUpdate: () => void, session: any }) {
    const [isRemoving, setIsRemoving] = useState<string | null>(null);

    const handleRemove = async (userId: string, userName: string) => {
        if (confirm(`Remove ${userName} from this organization?`)) {
            setIsRemoving(userId);
            try {
                await api(session).patch(`/api/admin/users/${userId}`, { organization_id: null });
                onUpdate();
            } catch (err: any) {
                alert(`Error: ${err.message}`);
            } finally {
                setIsRemoving(null);
            }
        }
    };

    return (<ul className={styles.memberList}>{members.length > 0 ? (members.map((member: any) => (<li key={member.id} className={styles.memberItem}><div className={styles.memberInfo}><span>{member.name}</span><span className={styles.memberEmail}>{member.email}</span></div><button onClick={() => handleRemove(member.id, member.name)} className={styles.removeButton} title={`Remove ${member.name}`} disabled={!!isRemoving}>{isRemoving === member.id ? <Loader2 size={18} className={styles.spinner} /> : <XCircle size={18} />}</button></li>))) : (<p className={styles.noMembers}>No users are in this organization.</p>)}</ul>);
}