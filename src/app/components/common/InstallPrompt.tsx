'use client';

import { useEffect, useState } from "react"
import styles from './InstallPwaButton.module.css';

export function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)

    useEffect(() => {
        setIsIOS(
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
        )

        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
    }, [])

    if (isStandalone) {
        return null
    }

    return (
        <div>
            {isIOS && (
                <p>
                    <h3>Install App</h3>
                    <button className={styles.installButton}>Add to Home Screen</button>
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