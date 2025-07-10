'use client';

import { useState, useEffect } from 'react';
import { Download, Share } from 'lucide-react';
import styles from './InstallPwaPrompt.module.css';

export default function InstallPwaPrompt() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const isDeviceIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isAppStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    setIsIOS(isDeviceIOS);
    setIsStandalone(isAppStandalone);
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    (installPrompt as any).prompt();
    await (installPrompt as any).userChoice;
    setInstallPrompt(null);
  };

  if (isStandalone) {
    return null;
  }

  if (isIOS) {
    return (
      <div className={styles.iosBanner}>
        <div className={styles.iosContent}>
            <p className={styles.iosText}>To get the full app experience, add Higgs to your Home Screen.</p>
            <p className={styles.iosText}>Tap the Share <Share size={16} className={styles.inlineIcon}/> button and then 'Add to Home Screen'.</p>
        </div>
      </div>
    );
  }

  if (installPrompt) {
    return (
      <button className={styles.installButton} onClick={handleInstallClick} title="Install App">
        <Download size={18} />
        <span className={styles.buttonText}>Install App</span>
      </button>
    );
  }

  return null;
}