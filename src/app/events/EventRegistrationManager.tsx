'use client';

import { useState, useEffect } from 'react'; 
import { Check, Loader2, X, UserPlus, LogIn } from 'lucide-react';
import GuestRegistrationForm from './GuestRegistrationForm';
import styles from './EventRegistrationManager.module.css'; 

export default function EventRegistrationManager({ eventId }: { eventId: string }) {  
    const [showGuestForm, setShowGuestForm] = useState(false);

 

    if (showGuestForm) {
        return <GuestRegistrationForm eventId={eventId} onBack={() => setShowGuestForm(false)} />;
    }

    return (
        <div className={styles.loggedOutActions}> 
            <button onClick={() => setShowGuestForm(true)} className={`${styles.actionButton}`}>
                <UserPlus size={16} /><span>Register as Guest</span>
            </button>
        </div>
    );
}