'use client';

import { Suspense } from 'react';
import RescheduleConfirmInner from './RescheduleConfirmInner';

export default function RescheduleConfirmPage() {
  return (
    <Suspense fallback={<div>Loading reschedule confirmation...</div>}>
      <RescheduleConfirmInner />
    </Suspense>
  );
}


// 'use client';

// import { useState, useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { ArrowLeft, Loader2 } from 'lucide-react';
// import { api } from '@/lib/api.client';
// import RescheduleConfirmation from '@/components/bookings/RescheduleConfirmation';
// import styles from '../../book/BookingConfirmationPage.module.css';
// import { useSessionContext } from '@/contexts/SessionContext';

// export default function RescheduleConfirmPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const session = useSessionContext();

//   const originalBookingId = searchParams.get('originalBookingId');
//   const newTypeOfRoomId = searchParams.get('newTypeOfRoomId');
//   const date = searchParams.get('date');
//   const startTime = searchParams.get('startTime');
//   const endTime = searchParams.get('endTime');

//   const [originalBooking, setOriginalBooking] = useState<any>(null);
//   const [newRoomType, setNewRoomType] = useState<any>(null);
//   const [liveUserData, setLiveUserData] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Check required search params
//     if (!originalBookingId || !newTypeOfRoomId || !date || !startTime || !endTime) {
//       router.push('/dashboard/my-bookings');
//       return;
//     }

//     // Check session
//     if (!session) {
//       setIsLoading(false);
//       return;
//     }

//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const [originalBookingData, newRoomTypeData, liveUserDataResponse] = await Promise.all([
//           api.get(`/api/bookings/${originalBookingId}`),
//           api.get(`/api/room-types/${newTypeOfRoomId}`),
//           api.get('/api/auth/me')
//         ]);

//         setOriginalBooking(originalBookingData);
//         setNewRoomType(newRoomTypeData);
//         setLiveUserData(liveUserDataResponse);
//       } catch (err: any) {
//         setError(err.message || 'Failed to load reschedule data.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [session, originalBookingId, newTypeOfRoomId, date, startTime, endTime, router]);

//   // Redirect to login if no session
//   useEffect(() => {
//     if (!session && !isLoading) {
//       router.push('/login');
//     }
//   }, [session, isLoading, router]);

//   if (isLoading) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.loadingState}>
//           <Loader2 className={styles.loaderIcon} />
//           Loading reschedule details...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={styles.container}>
//         <p>Error: {error}</p>
//         <a href="/dashboard/my-bookings" className={styles.backButton}>
//           <ArrowLeft size={16} />
//           <span>Back to My Bookings</span>
//         </a>
//       </div>
//     );
//   }

//   if (!originalBooking || !newRoomType || !liveUserData) {
//     return (
//       <div className={styles.container}>
//         <p>Unable to load reschedule data.</p>
//         <a href="/dashboard/my-bookings" className={styles.backButton}>
//           <ArrowLeft size={16} />
//           <span>Back to My Bookings</span>
//         </a>
//       </div>
//     );
//   }

//   const startDateTime = new Date(`${date}T${startTime}`);
//   const endDateTime = new Date(`${date}T${endTime}`);

//   return (
//     <div className={styles.container}>
//       <a href={`/dashboard/reschedule/${originalBookingId}`} className={styles.backButton}>
//         <ArrowLeft size={16} />
//         <span>Back to Reschedule Search</span>
//       </a>
//       <h1 className={styles.title}>Confirm Reschedule</h1>
//       <p className={styles.description}>
//         Review the new details and credit adjustment before confirming.
//       </p>
//       <div className={styles.card}>
//         <RescheduleConfirmation
//           newRoomType={newRoomType}
//           liveUserData={liveUserData}
//           startDateTime={startDateTime}
//           endDateTime={endDateTime}
//           originalBooking={originalBooking}
//         />
//       </div>
//     </div>
//   );
// }
