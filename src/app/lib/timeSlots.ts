interface TimeSlot {
    value: string;
    label: string;
}

export function generate30MinSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const startTime = 9 * 60; 
    const endTime = 21 * 60;
    const interval = 30;

    for (let timeInMinutes = startTime; timeInMinutes < endTime; timeInMinutes += interval) {
        const h = Math.floor(timeInMinutes / 60);
        const m = (timeInMinutes % 60).toString().padStart(2, '0');
        
        const period = h >= 12 ? 'PM' : 'AM';
        const hour12 = h % 12 === 0 ? 12 : h % 12;

        slots.push({
            value: `${h.toString().padStart(2, '0')}:${m}`,
            label: `${hour12}:${m} ${period}`
        });
    }

    return slots;
}

export function getSlotIndex(slots: TimeSlot[], value: string): number {
    return slots.findIndex(slot => slot.value === value);
}