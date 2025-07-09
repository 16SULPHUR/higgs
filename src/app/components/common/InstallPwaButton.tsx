'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import styles from './InstallPwaButton.module.css';

export default function InstallPwaButton() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => { 
      event.preventDefault(); 
      setInstallPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
 
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }
 
    (installPrompt as any).prompt();
 
    const { outcome } = await (installPrompt as any).userChoice;
    
    console.log(`User response to the install prompt: ${outcome}`);
 
    setInstallPrompt(null);
  };
 
  if (!installPrompt) {
    return null;
  }

  return (
    <button className={styles.installButton} onClick={handleInstallClick}>
      <Download size={16} />
      <span>Install App</span>
    </button>
  );
}