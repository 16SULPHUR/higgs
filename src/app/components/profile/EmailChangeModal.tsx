'use client';
import { useState } from 'react';
import { X, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import styles from './EmailChangeModal.module.css';
import { api } from '@/lib/api.client';
import { useSession } from '@/contexts/SessionContext';

interface EmailChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    currentEmail: string;
}

export default function EmailChangeModal({ isOpen, onClose, onSuccess, currentEmail }: EmailChangeModalProps) {
    const session = useSession();
    const [step, setStep] = useState<'request' | 'verify' | 'success'>('request');
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<Date | null>(null);

    if (!isOpen) return null;

    const handleRequestEmailChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post(session, '/api/profile/change-email', {
                newEmail,
                currentPassword
            });

            setExpiresAt(new Date(response.expiresAt));
            setStep('verify');
            setSuccess('Verification code sent to your new email address.');
        } catch (err: any) {
            setError(err.message || 'Failed to request email change.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await api.post(session, '/api/profile/verify-email-change', { otp });
            setStep('success');
            setSuccess('Email address updated successfully!');
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to verify OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post(session, '/api/profile/resend-email-change-otp', {});
            setExpiresAt(new Date(response.expiresAt));
            setSuccess('New verification code sent to your new email address.');
        } catch (err: any) {
            setError(err.message || 'Failed to resend verification code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async () => {
        try {
            await api.delete(session, '/api/profile/change-email');
            setStep('request');
            setNewEmail('');
            setCurrentPassword('');
            setOtp('');
            setError(null);
            setSuccess(null);
            setExpiresAt(null);
        } catch (err: any) {
            console.error('Failed to cancel email change:', err);
        }
    };

    const handleClose = () => {
        if (step === 'request') {
            onClose();
        } else {
            handleCancel();
            onClose();
        }
    };

    const renderRequestStep = () => (
        <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Change Email Address</h2>
            <p className={styles.stepDescription}>
                Enter your new email address and current password to request a change.
            </p>
            
            <form onSubmit={handleRequestEmailChange} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="currentEmail">Current Email</label>
                    <div className={styles.inputWrapper}>
                        <Mail size={18} className={styles.inputIcon} />
                        <input
                            id="currentEmail"
                            type="email"
                            value={currentEmail}
                            disabled
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="newEmail">New Email Address</label>
                    <div className={styles.inputWrapper}>
                        <Mail size={18} className={styles.inputIcon} />
                        <input
                            id="newEmail"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="Enter new email address"
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="currentPassword">Current Password</label>
                    <div className={styles.inputWrapper}>
                        <Lock size={18} className={styles.inputIcon} />
                        <input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="Enter your current password"
                        />
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        onClick={handleClose}
                        className={styles.cancelButton}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.primaryButton}
                    >
                        {isLoading ? 'Sending...' : 'Send Verification Code'}
                    </button>
                </div>
            </form>
        </div>
    );

    const renderVerifyStep = () => (
        <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Verify New Email</h2>
            <p className={styles.stepDescription}>
                We've sent a 6-digit verification code to <strong>{newEmail}</strong>
            </p>
            
            {expiresAt && (
                <div className={styles.expiryInfo}>
                    <AlertCircle size={16} />
                    <span>Code expires in {Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / 60000))} minutes</span>
                </div>
            )}

            <form onSubmit={handleVerifyOTP} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="otp">Verification Code</label>
                    <div className={styles.inputWrapper}>
                        <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            required
                            className={styles.otpInput}
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                        />
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className={styles.cancelButton}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className={styles.secondaryButton}
                    >
                        Resend Code
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        className={styles.primaryButton}
                    >
                        {isLoading ? 'Verifying...' : 'Verify & Update Email'}
                    </button>
                </div>
            </form>
        </div>
    );

    const renderSuccessStep = () => (
        <div className={styles.stepContent}>
            <div className={styles.successIcon}>
                <CheckCircle size={48} />
            </div>
            <h2 className={styles.stepTitle}>Email Updated Successfully!</h2>
            <p className={styles.stepDescription}>
                Your email address has been changed from <strong>{currentEmail}</strong> to <strong>{newEmail}</strong>
            </p>
            <p className={styles.stepDescription}>
                You can now log in using your new email address.
            </p>
            
            <div className={styles.buttonGroup}>
                <button
                    onClick={onClose}
                    className={styles.primaryButton}
                >
                    Done
                </button>
            </div>
        </div>
    );

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={handleClose}>
                    <X size={20} />
                </button>

                {error && (
                    <div className={styles.errorMessage}>
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className={styles.successMessage}>
                        <CheckCircle size={16} />
                        <span>{success}</span>
                    </div>
                )}

                {step === 'request' && renderRequestStep()}
                {step === 'verify' && renderVerifyStep()}
                {step === 'success' && renderSuccessStep()}
            </div>
        </div>
    );
}
