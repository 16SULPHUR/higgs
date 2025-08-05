'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api.client';
import { Send, UserPlus, Loader2, X, Check } from 'lucide-react';
import styles from './InviteGuestManager.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

type InviteMode = 'GUEST' | 'MEMBER';
interface Invitee { name: string; email: string; }

export default function InviteGuestManager({ bookingId }: { bookingId: string }) {
    const session = useSessionContext();
    const [mode, setMode] = useState<InviteMode>('GUEST');
    
    const [invitedGuests, setInvitedGuests] = useState<any[]>([]);
    const [invitableUsers, setInvitableUsers] = useState<any[]>([]);
    
    const [guestInputs, setGuestInputs] = useState<Invitee[]>([{ name: '', email: '' }]);
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        if (!session) return;
        setIsLoading(true);
        try {
            const [guests, users] = await Promise.all([
                api.get(session, `/api/bookings/${bookingId}/invitations`),
                api.get(session, `/api/users/invitable?bookingId=${bookingId}`),
            ]);
            setInvitedGuests(guests);
            setInvitableUsers(users);
        } catch (err: any) {
            setError(err.message || 'Could not load guest data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session) fetchData();
    }, [session, bookingId]);

    const handleGuestInputChange = (index: number, field: keyof Invitee, value: string) => {
        const newInputs = [...guestInputs];
        newInputs[index][field] = value;
        setGuestInputs(newInputs);
    };
    const addGuestInput = () => setGuestInputs([...guestInputs, { name: '', email: '' }]);
    const removeGuestInput = (index: number) => setGuestInputs(guestInputs.filter((_, i) => i !== index));

    const handleMemberSelect = (userId: string) => {
        setSelectedMemberIds(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        setSuccess('');
        let invitees: Invitee[] = [];

        if (mode === 'GUEST') {
            invitees = guestInputs.filter(g => g.name && g.email);
        } else {
            invitees = invitableUsers
                .filter(u => selectedMemberIds.includes(u.id))
                .map(u => ({ name: u.name, email: u.email }));
        }

        if (invitees.length === 0) {
            setError('Please add at least one person to invite.');
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await api.post(session, `/api/bookings/${bookingId}/invite`, { invitees });
            setSuccess(result.message);
            setGuestInputs([{ name: '', email: '' }]);
            setSelectedMemberIds([]);
            fetchData();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const uninvitedMembers = useMemo(() => {
        const invitedEmails = new Set(invitedGuests.map(g => g.guest_email));
        return invitableUsers.filter(u => !invitedEmails.has(u.email));
    }, [invitedGuests, invitableUsers]);
    
    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <button onClick={() => setMode('GUEST')} className={mode === 'GUEST' ? styles.activeTab : ''}>Invite External Guests</button>
                <button onClick={() => setMode('MEMBER')} className={mode === 'MEMBER' ? styles.activeTab : ''}>Invite Members</button>
            </div>

            {mode === 'GUEST' && (
                <div className={styles.form}>
                    {guestInputs.map((guest, index) => (
                        <div key={index} className={styles.guestInputRow}>
                            <input value={guest.name} placeholder="Guest Name" onChange={(e) => handleGuestInputChange(index, 'name', e.target.value)} required disabled={isSubmitting} />
                            <input type="email" value={guest.email} placeholder="Guest Email" onChange={(e) => handleGuestInputChange(index, 'email', e.target.value)} required disabled={isSubmitting} />
                            {guestInputs.length > 1 && <button type="button" onClick={() => removeGuestInput(index)} className={styles.removeButton}><X size={16}/></button>}
                        </div>
                    ))}
                    <button type="button" onClick={addGuestInput} className={styles.addButton}>+ Add Another Guest</button>
                </div>
            )}

            {mode === 'MEMBER' && (
                <div className={styles.memberSelector}>
                    {uninvitedMembers.length > 0 ? uninvitedMembers.map(user => (
                        <div key={user.id} className={`${styles.memberItem} ${selectedMemberIds.includes(user.id) ? styles.selected : ''}`} onClick={() => handleMemberSelect(user.id)}>
                            <div className={styles.checkbox}>{selectedMemberIds.includes(user.id) && <Check size={12}/>}</div>
                            <div><div className={styles.memberName}>{user.name}</div><div className={styles.memberEmail}>{user.email}</div></div>
                        </div>
                    )) : <p className={styles.noGuestsText}>All members have been invited.</p>}
                </div>
            )}
            
            <div className={styles.footerActions}>
                {error && <p className={styles.messageText} style={{ color: 'hsl(var(--destructive))'}}>{error}</p>}
                {success && <p className={styles.messageText} style={{ color: 'hsl(var(--primary))'}}>{success}</p>}
                <button onClick={handleSubmit} disabled={isSubmitting} className={styles.button}>
                    {isSubmitting && <Loader2 size={16} className={styles.spinner}/>}
                    {isSubmitting ? 'Sending...' : 'Send Invites'}
                </button>
            </div>
            
            <hr className={styles.divider} />
            <div className={styles.guestList}>
                <h3 className={styles.guestListTitle}>Invited ({invitedGuests.length})</h3>
                {isLoading ? <Loader2 className={styles.spinner} /> : invitedGuests.length > 0 ? (
                    <ul>{invitedGuests.map((guest: any) => <li key={guest.id}>{guest.guest_name} ({guest.guest_email})</li>)}</ul>
                ) : (
                    <p className={styles.noGuestsText}>No one has been invited yet.</p>
                )}
            </div>
        </div>
    );
}