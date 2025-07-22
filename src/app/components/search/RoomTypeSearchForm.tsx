'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { searchAvailableRoomTypesAction } from '@/actions/bookingActions';
import { generate30MinSlots } from '@/lib/timeSlots';
import RoomTypeResultCard from './RoomTypeResultCard';
import styles from './RoomSearchForm.module.css';

const timeSlots = generate30MinSlots();
 
const getNextAvailableSlot = () => { 
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
 
    const nextSlot = timeSlots.find(slot => {
        const [hour, minute] = slot.value.split(':').map(Number);
        const slotMinutes = hour * 60 + minute;
        return slotMinutes > currentMinutes;
    });
 
    return nextSlot || timeSlots[0];
};

export default function RoomTypeSearchForm({ rescheduleBookingId }: { rescheduleBookingId?: string }) { 
    const [criteria, setCriteria] = useState(() => {
        const nextSlot = getNextAvailableSlot();
        const nextSlotIndex = timeSlots.findIndex(s => s.value === nextSlot.value);
        const endSlot = timeSlots[nextSlotIndex + 1] || nextSlot;

        return {
            date: new Date().toISOString().split('T')[0],
            startTime: nextSlot.value,
            endTime: endSlot.value,
            capacity: '2',
        };
    });

    const [results, setResults] = useState<any[]>([]);
    const [executedSearchCriteria, setExecutedSearchCriteria] = useState<any>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setCriteria(prev => {
            const newCriteria = { ...prev, [name]: value };
            
            if (name === 'startTime') {
                const startIndex = timeSlots.findIndex(slot => slot.value === value);
                const endIndex = timeSlots.findIndex(slot => slot.value === newCriteria.endTime);
                if (endIndex <= startIndex) {
                    const nextSlot = timeSlots[startIndex + 1];
                    if (nextSlot) {
                        newCriteria.endTime = nextSlot.value;
                    }
                }
            }
            return newCriteria;
        });
    };

    const availableEndTimes = useMemo(() => {
        const startIndex = timeSlots.findIndex(slot => slot.value === criteria.startTime);
        return timeSlots.slice(startIndex + 1);
    }, [criteria.startTime]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setHasSearched(true);
        setResults([]);
        setError(null);
        setExecutedSearchCriteria(null);

        const selectedStartDateTime = new Date(`${criteria.date}T${criteria.startTime}`);
        if (selectedStartDateTime < new Date()) {
            setError('Search time cannot be in the past. Please select a future time or date.');
            return;
        }

        startTransition(async () => {
            const result = await searchAvailableRoomTypesAction(criteria);
            
            if (result.success) {
                setResults(result.data);
                setExecutedSearchCriteria({
                    ...criteria,
                    rescheduleBookingId: rescheduleBookingId,
                });
            } else {
                setError(result.error);
            }
        });
    };

    return (
        <div>
            <form onSubmit={handleSearch} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" name="date" value={criteria.date} onChange={handleChange} className={styles.input} min={new Date().toISOString().split('T')[0]}/>
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="startTime">Start Time</label>
                    <select id="startTime" name="startTime" value={criteria.startTime} onChange={handleChange} className={styles.input}>
                        {timeSlots.slice(0, -1).map(slot => (
                            <option key={slot.value} value={slot.value}>{slot.label}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="endTime">End Time</label>
                    <select id="endTime" name="endTime" value={criteria.endTime} onChange={handleChange} className={styles.input}>
                        {availableEndTimes.map(slot => (
                            <option key={slot.value} value={slot.value}>{slot.label}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="capacity">People</label>
                    <input type="number" id="capacity" name="capacity" min="1" value={criteria.capacity} onChange={handleChange} className={styles.input} />
                </div>
                <button type="submit" className={styles.searchButton} disabled={isPending}>
                    <Search size={18} />
                    <span>{isPending ? 'Searching...' : 'Find Spaces'}</span>
                </button>
            </form>
            {error && <p className={styles.errorText}>{error}</p>}
            <div className={styles.resultsContainer}>
                {isPending && <div className={styles.loadingState}><Loader2 className={styles.loaderIcon} /><p>Finding available spaces...</p></div>}
                {!isPending && hasSearched && !error && results.length === 0 && <div className={styles.emptyState}><h3>No Spaces Found</h3><p>There are no spaces available that match your criteria.</p></div>}
                {!isPending && results.length > 0 && executedSearchCriteria && (
                    <div className={styles.resultsGrid}>
                        {results.map(roomType => <RoomTypeResultCard key={roomType.id} roomType={roomType} searchCriteria={executedSearchCriteria} />)}
                    </div>
                )}
            </div>
        </div>
    );
}