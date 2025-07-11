export const TIMEZONE = 'Asia/Kolkata';

export const displayDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString('en-US', {
        dateStyle: 'full',
        timeZone: TIMEZONE,
    });

export const displayTime = (isoDate: string) =>
    new Date(isoDate).toLocaleTimeString('en-US', {
        timeStyle: 'short',
        timeZone: TIMEZONE,
    });