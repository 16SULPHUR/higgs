'use client';

import { useTransition } from 'react';
import { XCircle } from 'lucide-react';
import { removeUserFromOrg } from '@/actions/orgActions';
import styles from './CurrentMembersList.module.css';

export default function CurrentMembersList({ members }: { members: any[] }) {
    const [isPending, startTransition] = useTransition();

    const handleRemove = (userId: string, userName: string) => {
        if (confirm(`Are you sure you want to remove ${userName} from this organization?`)) {
            startTransition(async () => {
                const result = await removeUserFromOrg(userId);
                if (!result.success) {
                    alert(result.message); 
                    
                }
                
            });
        }
    };

    return (
        <ul className={styles.memberList}>
            {members.length > 0 ? (
                members.map((member: any) => (
                    <li key={member.id} className={styles.memberItem}>
                        <div className={styles.memberInfo}>
                            <span>{member.name}</span>
                            <span className={styles.memberEmail}>{member.email}</span>
                        </div>
                        <button 
                            onClick={() => handleRemove(member.id, member.name)}
                            className={styles.removeButton}
                            title={`Remove ${member.name}`}
                            disabled={isPending}
                        >
                            <XCircle size={18} />
                        </button>
                    </li>
                ))
            ) : (
                <p className={styles.noMembers}>No users are currently in this organization.</p>
            )}
        </ul>
    );
}