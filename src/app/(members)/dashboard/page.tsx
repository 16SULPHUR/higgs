import DashboardClient from './DashboardClient';
 
export default function MembersDashboardPage() {
  return <DashboardClient />;
}


// 'use client';

// import { redirect } from 'next/navigation';
// import Link from 'next/link';
// import SignOutButton from '@/components/SignOutButton';
// import InstallPwaButton from '@/components/common/InstallPwaButton';
// import { ArrowRight, BookUser, Building, CalendarCheck, CalendarDays, Contact } from 'lucide-react';
// import styles from './Dashboard.module.css';
// import { getSession } from '@/lib/session';
// import { useSessionContext } from '@/contexts/SessionContext';
// import { useEffect, useState } from 'react';
// import { getCookie } from '@/lib/cookieUtils';

// export default function MembersDashboardPage() {
//   const [session, setSession] = useState<string | null>(null);
//   const [userName, setUserName] = useState("");
//   const [isClient, setIsClient] = useState(false);

//   console.log('Session state:', session);
 
//   useEffect(() => {
//     setIsClient(true);
//     const accessToken = getCookie("accessToken");
//     setSession(accessToken);
    
//     if (accessToken) {
//       setUserName(getCookie("name") || "");
//     }
//   }, []);

//  if (!isClient) {
//     return (
//       <div className={styles.pageContainer}>
//         <header className={styles.header}>
//           <div className={styles.welcomeMessage}>
//             <h1 className={styles.welcomeTitle}>Welcome!</h1>
//             <p className={styles.welcomeSubtitle}>Loading your workspace...</p>
//           </div>
//           <div className={styles.headerActions}>
//             <InstallPwaButton />
//           </div>
//         </header>
//         <main className={styles.mainContent}>
//           <div className={styles.actionGrid}>
//             {/* Show loading skeleton or basic cards */}
//             <div className={styles.actionCard}>
//               <div className={styles.cardIconWrapper}>
//                 <CalendarCheck size={28} className={styles.cardIcon} />
//               </div>
//               <div>
//                 <h2 className={styles.cardTitle}>Loading...</h2>
//                 <p className={styles.cardDescription}>Please wait...</p>
//               </div>
//             </div> 
//           </div>
//         </main>
//       </div>
//     );
//   }
 
//   if (!session) {
//     redirect('/login');
//   }

//   return (
//     <div className={styles.pageContainer}>
//       <header className={styles.header}>
//         <div className={styles.welcomeMessage}>
//           <h1 className={styles.welcomeTitle}>
//             Welcome, {userName || 'User'}!
//           </h1>
//           <p className={styles.welcomeSubtitle}>Your workspace dashboard is ready.</p>
//         </div>
//         <div className={styles.headerActions}>
//           <InstallPwaButton />
//         </div>
//       </header>

//       <main className={styles.mainContent}>
//         <div className={styles.actionGrid}>
//           <a href="/dashboard/find-room" className={styles.actionCard}>
//             <div className={styles.cardIconWrapper}>
//               <CalendarCheck size={28} className={styles.cardIcon} />
//             </div>
//             <div>
//               <h2 className={styles.cardTitle}>Book a Space</h2>
//               <p className={styles.cardDescription}>Find and reserve an available meeting room or private office.</p>
//             </div>
//             <ArrowRight size={20} className={styles.cardArrow} />
//           </a>

//           <a href="/dashboard/my-bookings" className={styles.actionCard}>
//             <div className={styles.cardIconWrapper}>
//               <BookUser size={28} className={styles.cardIcon} />
//             </div>
//             <div>
//               <h2 className={styles.cardTitle}>My Bookings</h2>
//               <p className={styles.cardDescription}>View your upcoming reservations and booking history.</p>
//             </div>
//             <ArrowRight size={20} className={styles.cardArrow} />
//           </a>

//           <a href="/dashboard/member-book" className={styles.actionCard}>
//             <div className={styles.cardIconWrapper}>
//               <Contact size={28} className={styles.cardIcon} />
//             </div>
//             <div>
//               <h2 className={styles.cardTitle}>Member Directory</h2>
//               <p className={styles.cardDescription}>Connect with other members in your workspace.</p>
//             </div>
//             <ArrowRight size={20} className={styles.cardArrow} />
//           </a>

//           <a href="/dashboard/events" className={styles.actionCard}>
//             <div className={styles.cardIconWrapper}>
//               <CalendarDays size={28} className={styles.cardIcon} />
//             </div>
//             <div>
//               <h2 className={styles.cardTitle}>Community Events</h2>
//               <p className={styles.cardDescription}>View upcoming events and manage your registrations.</p>
//             </div>
//             <ArrowRight size={20} className={styles.cardArrow} />
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }
