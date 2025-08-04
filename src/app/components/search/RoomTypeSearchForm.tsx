'use client';

import { useState, useMemo } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client';
import { generate15MinSlots } from '@/lib/timeSlots';
import RoomTypeResultCard from './RoomTypeResultCard';
import styles from './RoomSearchForm.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

const timeSlots = generate15MinSlots();

const getNextAvailableSlot = () => {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const nextSlot = timeSlots.find(slot => {
    const [hour, minute] = slot.value.split(':').map(Number);
    return hour * 60 + minute > currentMinutes;
  });
  return nextSlot || timeSlots[0];
};

export default function RoomTypeSearchForm({ rescheduleBookingId }: { rescheduleBookingId?: string }) {
  const session = useSessionContext();

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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCriteria(prev => {
      const newCriteria = { ...prev, [name]: value };
      if (name === 'startTime') {
        const startIndex = timeSlots.findIndex(slot => slot.value === value);
        const endIndex = timeSlots.findIndex(slot => slot.value === newCriteria.endTime);
        if (endIndex <= startIndex) {
          const nextSlot = timeSlots[startIndex + 1];
          if (nextSlot) newCriteria.endTime = nextSlot.value;
        }
      }
      return newCriteria;
    });
  };

  const availableEndTimes = useMemo(() => {
    const startIndex = timeSlots.findIndex(slot => slot.value === criteria.startTime);
    return timeSlots.slice(startIndex + 1);
  }, [criteria.startTime]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setResults([]);
    setError(null);
    setExecutedSearchCriteria(null);
    setIsLoading(true);

    // Check if user is authenticated
    if (!session) {
      setError('You must be logged in to search for spaces.');
      setIsLoading(false);
      return;
    }

    const selectedStartDateTime = new Date(`${criteria.date}T${criteria.startTime}`);
    if (selectedStartDateTime < new Date()) {
      setError('Search time cannot be in the past.');
      setIsLoading(false);
      return;
    }

    try {
      const queryParams = new URLSearchParams(criteria).toString();
      const data = await api.get(session, `/api/meeting-rooms/search?${queryParams}`);
      setResults(data);
      setExecutedSearchCriteria({
        ...criteria,
        rescheduleBookingId: rescheduleBookingId,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to search for spaces.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={criteria.date}
            onChange={handleChange}
            className={styles.input}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="startTime">Start Time</label>
          <select
            id="startTime"
            name="startTime"
            value={criteria.startTime}
            onChange={handleChange}
            className={styles.input}
          >
            {timeSlots.slice(0, -1).map(slot => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="endTime">End Time</label>
          <select
            id="endTime"
            name="endTime"
            value={criteria.endTime}
            onChange={handleChange}
            className={styles.input}
          >
            {availableEndTimes.map(slot => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
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
          />
        </div>
        <button
          type="submit"
          className={styles.searchButton}
          disabled={isLoading || !session}
        >
          {isLoading ? (
            <Loader2 size={18} className={styles.spinner} />
          ) : (
            <Search size={18} />
          )}
          <span>{isLoading ? 'Searching...' : 'Find Spaces'}</span>
        </button>
      </form>
      {error && <p className={styles.errorText}>{error}</p>}
      <div className={styles.resultsContainer}>
        {isLoading && (
          <div className={styles.loadingState}>
            <Loader2 className={styles.loaderIcon} />
            <p>Finding available spaces...</p>
          </div>
        )}
        {!isLoading && hasSearched && !error && results.length === 0 && (
          <div className={styles.emptyState}>
            <h3>No Spaces Found</h3>
            <p>There are no spaces available that match your criteria.</p>
          </div>
        )}
        {!isLoading && results.length > 0 && executedSearchCriteria && (
          <div className={styles.resultsGrid}>
            {results.map(roomType => (
              <RoomTypeResultCard
                key={roomType.id}
                roomType={roomType}
                searchCriteria={executedSearchCriteria}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
