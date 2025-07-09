import Link from 'next/link';
import styles from './HomePage.module.css';
import MembersDashboardPage from './(members)/dashboard/page';
import SignOutButton from './components/SignOutButton';
import { useEffect, useState } from 'react';
import InstallPwaButton from './components/common/InstallPwaButton';

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])

  if (isStandalone) {
    return null // Don't show install button if already installed
  }

  return (
    <div>
      <h3>Install App</h3>
      <button>Add to Home Screen</button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {' '}
            ⎋{' '}
          </span>
          and then "Add to Home Screen"
          <span role="img" aria-label="plus icon">
            {' '}
            ➕{' '}
          </span>.
        </p>
      )}
    </div>
  )
}



export default function HomePage() {

  return (
    <div className={styles.pageContainer}>
      {/* <Link href='/admin/dashboard'>Admin Dashboard</Link> */}
      <SignOutButton />
      <InstallPrompt />
      <div className={styles.headerActions}>
        <InstallPwaButton /> 
      </div>
      <MembersDashboardPage />
    </div>
  );
}