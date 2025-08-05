'use client';

import { useState, useEffect } from 'react';
import { Download, Share, X } from 'lucide-react';
import styles from './PwaInstallPopup.module.css';

const LOCAL_STORAGE_KEY = 'pwaInstallDismissed';

export default function PwaInstallPopup() {
    const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const isDismissed = localStorage.getItem(LOCAL_STORAGE_KEY) === 'true';
        if (isDismissed) return;

        const isDeviceIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        if (isStandalone) return;

        setIsIOS(isDeviceIOS);

        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setInstallPrompt(event);
            setIsVisible(true);
        };

        if (isDeviceIOS) { 
            setTimeout(() => setIsVisible(true), 3000);
        } else {
            window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        }

        return () => {
            if (!isDeviceIOS) {
                window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            }
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) return;
        (installPrompt as any).prompt();
        const { outcome } = await (installPrompt as any).userChoice;
        if (outcome === 'accepted') {
            setIsVisible(false);
        }
    };
 
    const handleDismiss = (e: React.MouseEvent<HTMLButtonElement>) => { 
        e.stopPropagation(); 
        
        setIsVisible(false);
        localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    };

    if (!isVisible) return null;

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupCard}>
                <button onClick={handleDismiss} className={styles.closeButton} title="Close">
                    <X size={20} />
                </button>
                <div className={styles.popupContent}>
                    <h3 className={styles.title}>Get the Higgs App</h3>
                    <p className={styles.description}>
                        Install the Higgs Workspace app for a faster, more integrated experience.
                    </p>
                    {isIOS ? (
                        <div className={styles.iosInstructions}>
                            Tap the Share <Share size={16} className={styles.inlineIcon} /> button, then scroll down and tap 'Add to Home Screen'.
                        </div>
                    ) : (
                        <button className={styles.installButton} onClick={handleInstallClick}>
                            <Download size={18} />
                            <span>Install App</span>
                        </button>
                    )} 
                    <button onClick={handleDismiss} className={styles.dismissLink}>
                        Never show this again
                    </button>
                </div>
            </div>
        </div>
    );
}