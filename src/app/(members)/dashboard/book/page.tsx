'use client';

import BookingConfirmationWrapper from '@/components/bookings/BookingConfirmationWrapper';
import { Suspense } from 'react';

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingConfirmationWrapper />
    </Suspense>
  );
}




// 'use client';

// import { useState, useEffect } from 'react';
// import { useSearchParams, redirect } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import Link from 'next/link';
// import { ArrowLeft, Loader2 } from 'lucide-react';
// import { api } from '@/lib/api.client';
// import NewBookingConfirmation from '@/components/bookings/NewBookingConfirmation';
// import styles from './BookingConfirmationPage.module.css';

// export default function BookingConfirmationPage() {
//     const { status } = useSession();
//     const searchParams = useSearchParams();
    
//     const [data, setData] = useState<{ newRoomType: any, liveUserData: any } | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
    
//     const typeOfRoomId = searchParams.get('typeOfRoomId');
//     const date = searchParams.get('date');
//     const startTime = searchParams.get('startTime');
//     const endTime = searchParams.get('endTime');

//     useEffect(() => {
//         if (status === 'authenticated') {
//             if (!typeOfRoomId || !date || !startTime || !endTime) {
//                 setError('Booking information is missing. Please try again.');
//                 setIsLoading(false);
//                 return;
//             }

//             const fetchData = async () => {
//                 try {
//                     const [newRoomTypeData, userData] = await Promise.all([
//                         api.get(`/api/room-types/${typeOfRoomId}`),
//                         api.get('/api/auth/me')
//                     ]);
//                     setData({ newRoomType: newRoomTypeData, liveUserData: userData });
//                 } catch (err: any) {
//                     setError(err.message || 'Could not load booking details.');
//                 } finally {
//                     setIsLoading(false);
//                 }
//             };
//             fetchData();
//         }
        
//         if (status === 'unauthenticated') {
//             redirect('/login');
//         }
//     }, [status, typeOfRoomId, date, startTime, endTime]);

//     const renderContent = () => {
//         if (isLoading || status === 'loading') {
//             return <div className={styles.stateContainer}><Loader2 className={styles.loaderIcon} /></div>;
//         }
//         if (error) {
//             return <div className={styles.stateContainer}><p className={styles.errorText}>{error}</p></div>;
//         }
//         if (data && date && startTime && endTime) {
//             function parseKolkataTimeToUTC(dateStr: string, timeStr: string): Date {
//                 const [year, month, day] = dateStr.split('-').map(Number);
//                 const [hour, minute] = timeStr.split(':').map(Number);
//                 return new Date(Date.UTC(year, month - 1, day, hour - 5, minute - 30));
//             }
//             const startDateTime = parseKolkataTimeToUTC(date, startTime);
//             const endDateTime = parseKolkataTimeToUTC(date, endTime);
            
//             return (
//                 <div className={styles.card}>
//                     <NewBookingConfirmation 
//                         roomType={data.newRoomType}
//                         liveUserData={data.liveUserData} 
//                         startDateTime={startDateTime}
//                         endDateTime={endDateTime}
//                     />
//                 </div>
//             );
//         }
//         return <div className={styles.stateContainer}><p>Something went wrong.</p></div>;
//     };

//     return (
//         <div className={styles.container}>
//              <a href="/dashboard/find-room" className={styles.backButton}>
//                 <ArrowLeft size={16} />
//                 <span>Back to Search</span>
//             </a>
//             <h1 className={styles.title}>Confirm Your Booking</h1>
//             <p className={styles.description}>Please review the details below before confirming.</p>
//             {renderContent()}
//         </div>
//     );
// }