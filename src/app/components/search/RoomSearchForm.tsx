'use client';

import { useState, useTransition, useMemo } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { generate30MinSlots, getSlotIndex } from '@/lib/timeSlots';
import RoomResultCard from './RoomResultCard';
import styles from './RoomSearchForm.module.css';
import { useSessionContext } from '@/contexts/SessionContext';
import { api } from '@/lib/api.client'; // Use your client-side API utility

const timeSlots = generate30MinSlots();

export default function RoomSearchForm() {
    const session = useSessionContext();
    const [criteria, setCriteria] = useState({
        date: new Date().toISOString().split('T')[0],
        capacity: '2',
    });
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);

    const [results, setResults] = useState<any[]>([]);
    const [executedSearchCriteria, setExecutedSearchCriteria] = useState<any>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSlotClick = (slotValue: string) => {
        const clickedIndex = getSlotIndex(timeSlots, slotValue);
        const startIndex = startTime ? getSlotIndex(timeSlots, startTime) : -1;

        if (slotValue === startTime) {
            setStartTime(null);
            setEndTime(null);
        } else if (slotValue === endTime) {
            setEndTime(null);
        } else if (!startTime || clickedIndex < startIndex) {
            setStartTime(slotValue);
            setEndTime(null);
        } else {
            setEndTime(slotValue);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCriteria(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setHasSearched(true);
        setResults([]);
        setError(null);
        setExecutedSearchCriteria(null);
        
        if (!startTime) {
            setError("Please select at least one time slot.");
            return;
        }

        startTransition(async () => {
            try {
                const finalEndTimeValue = endTime || startTime;
                const [h, m] = finalEndTimeValue.split(':').map(Number);
                const endTimeMinutes = h * 60 + m + 30;
                const endH = Math.floor(endTimeMinutes / 60);
                const endM = endTimeMinutes % 60;
                const finalEndTimeForQuery = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
                
                const searchPayload = {
                    date: criteria.date,
                    startTime: startTime,
                    endTime: finalEndTimeForQuery,
                    capacity: criteria.capacity
                };
                
                // Create query parameters
                const queryParams = new URLSearchParams(
                    Object.fromEntries(
                        Object.entries(searchPayload).map(([key, value]) => [key, String(value)])
                    )
                ).toString();

                console.log('Searching rooms with criteria:', searchPayload);
                
                // Client-side API call
                const data = await api.get(session, `/api/meeting-rooms/search?${queryParams}`);
                
                // Handle success
                setResults(data);
                setExecutedSearchCriteria(searchPayload);
                
                if (data.length === 0) {
                    setError(null);  
                }
                
            } catch (error: any) {
                console.error('Room search failed:', error);
                
                // Handle API error responses
                try {
                    let errorMessage = 'An error occurred while searching for rooms.';
                    
                    if (error.message) {
                        try {
                            const errorBody = JSON.parse(error.message);
                            errorMessage = errorBody.message || errorMessage;
                        } catch (parseError) {
                            errorMessage = error.message;
                        }
                    }
                    
                    setError(errorMessage);
                } catch (parseError) {
                    setError('An error occurred while searching for rooms.');
                }
            }
        });
    };
 
    const selectedRange = useMemo(() => {
        if (!startTime) return [];
        const startIndex = getSlotIndex(timeSlots, startTime);
        const endIndex = endTime ? getSlotIndex(timeSlots, endTime) : startIndex;
        
        return timeSlots.slice(startIndex, endIndex + 1).map(s => s.value);
    }, [startTime, endTime]);

    return (
        <div>
            <form onSubmit={handleSearch} className={styles.form}>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label>Time Slots</label>
                    <div className={styles.slotPicker}>
                        {timeSlots.map(slot => {
                            const isSelected = selectedRange.includes(slot.value);
                            const isStart = slot.value === startTime;
                            const isEnd = slot.value === endTime;
                            const isDisabled = startTime !== null && !endTime && getSlotIndex(timeSlots, slot.value) < getSlotIndex(timeSlots, startTime);
                            
                            let btnClass = styles.slotButton;
                            if (isSelected) btnClass += ` ${styles.selected}`;
                            if (isStart) btnClass += ` ${styles.startSlot}`;
                            if (isEnd) btnClass += ` ${styles.endSlot}`;

                            return (
                                <button
                                    type="button"
                                    key={slot.value}
                                    onClick={() => handleSlotClick(slot.value)}
                                    className={btnClass}
                                    disabled={isDisabled || isPending}
                                >
                                    {isStart && 'Start: '}
                                    {isEnd && 'End: '}
                                    {slot.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="date">Date</label>
                    <input 
                        type="date" 
                        id="date" 
                        name="date" 
                        value={criteria.date} 
                        onChange={handleChange} 
                        className={styles.input}
                        disabled={isPending}
                    />
                </div>
                
                <div className={styles.inputGroup}>
                    <label htmlFor="capacity">People</label>
                    <input 
                        type="number" 
                        id="capacity" 
                        name="capacity" 
                        min="1" 
                        value={criteria.capacity} 
                        onChange={handleChange} 
                        className={styles.input}
                        disabled={isPending}
                    />
                </div>
                
                <button type="submit" className={styles.searchButton} disabled={isPending}>
                    <Search size={18} />
                    <span>{isPending ? 'Searching...' : 'Find Rooms'}</span>
                </button>
            </form>

            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.resultsContainer}>
                {isPending && (
                    <div className={styles.loadingState}>
                        <Loader2 className={styles.loaderIcon} />
                        <p>Finding available rooms...</p>
                    </div>
                )}
                
                {!isPending && hasSearched && !error && results.length === 0 && (
                     <div className={styles.emptyState}>
                        <h3>No Rooms Found</h3>
                        <p>There are no rooms available that match your criteria. Please try a different time or date.</p>
                    </div>
                )}
                
                {!isPending && results.length > 0 && executedSearchCriteria && (
                    <div className={styles.resultsGrid}>
                        {results.map(room => (
                            <RoomResultCard
                                key={room.id}
                                room={room}
                                searchCriteria={executedSearchCriteria}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
