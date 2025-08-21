'use client';

import { useState } from 'react';
import styles from './ForgotPasswordPage.module.css';
import AdminForgotPasswordForm from '@/components/auth/AdminForgotPasswordForm';
import AdminResetPasswordForm from '@/components/auth/AdminResetPasswordForm';
import { ArrowLeft } from 'lucide-react';

type Step = 'EMAIL' | 'OTP' | 'SUCCESS';

export default function AdminForgotPasswordPage() {
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
                return <AdminForgotPasswordForm onEmailSubmit={handleEmailSubmitted} />;
            case 'OTP':
                return <AdminResetPasswordForm email={email} onPasswordReset={handlePasswordReset} />;
            case 'SUCCESS':
                return (
                    <div className={styles.successMessage}>
                        <h3>Password Reset Successfully!</h3>
                        <p>You can now log in with your new password.</p>
                        <a href="/admin/login" className={styles.loginButton}>
                            Go to Admin Login
                        </a>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <a href="/admin/login" className={styles.backButton}>
                <ArrowLeft size={16} />
                <span>Back to Admin Login</span>
            </a>
            <div className={styles.card}>
                {renderStep()}
            </div>
        </div>
    );
}


