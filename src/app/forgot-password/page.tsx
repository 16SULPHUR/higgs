'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import styles from './ForgotPasswordPage.module.css';

type Step = 'EMAIL' | 'OTP' | 'SUCCESS';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>('EMAIL');
    const [email, setEmail] = useState('');

    const handleEmailSubmitted = (submittedEmail: string) => {
        setEmail(submittedEmail);
        setStep('OTP');
    };

    const handlePasswordReset = () => {
        setStep('SUCCESS');
    };

    const renderStep = () => {
        switch (step) {
            case 'EMAIL':
                return <ForgotPasswordForm onEmailSubmit={handleEmailSubmitted} />;
            case 'OTP':
                return <ResetPasswordForm email={email} onPasswordReset={handlePasswordReset} />;
            case 'SUCCESS':
                return (
                    <div className={styles.successMessage}>
                        <h3>Password Reset Successfully!</h3>
                        <p>You can now log in with your new password.</p>
                        <a href="/login" className={styles.loginButton}>
                            Go to Login
                        </a >
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
             <a href="/login" className={styles.backButton}>
                <ArrowLeft size={16} />
                <span>Back to Login</span>
            </a >
            <div className={styles.card}>
                {renderStep()}
            </div>
        </div>
    );
}