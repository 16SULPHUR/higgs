'use client';
import { useEffect, useState } from 'react';
import { User, Mail, Save, Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';
import styles from './AdminProfileForm.module.css';
import { api } from '@/lib/api.client';
import { useSession } from '@/contexts/SessionContext';

export default function AdminProfileForm() {
  const session = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Email change states
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [emailChangeData, setEmailChangeData] = useState({ newEmail: '', currentPassword: '' });
  const [isEmailChangePending, setIsEmailChangePending] = useState(false);
  const [emailChangeError, setEmailChangeError] = useState<string | null>(null);
  const [emailChangeSuccess, setEmailChangeSuccess] = useState<string | null>(null);
  
  // OTP verification states
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpData, setOtpData] = useState({ otp: '' });
  const [isOTPPending, setIsOTPPending] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get(session, '/api/admin/profile');
        setProfile(data);
        setFormData({ name: data.name || '' });
      } catch (err: any) {
        setError(err.message || 'Failed to load profile.');
      }
    };
    fetchProfile();
  }, [session]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEmailChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailChangeData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOTPInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsPending(true);
    
    try {
      const updatedProfile = await api.patch(session, '/api/admin/profile', formData);
      setSuccess('Profile updated successfully!');
      setProfile(updatedProfile);
      setFormData({ name: updatedProfile.name || '' });
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsPending(false);
    }
  };

  const handleEmailChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailChangeError(null);
    setEmailChangeSuccess(null);
    setIsEmailChangePending(true);
    
    try {
      await api.post(session, '/api/admin/profile/change-email', emailChangeData);
      setEmailChangeSuccess('Email change request sent! Please check your new email for the verification code.');
      setShowOTPVerification(true);
      setShowEmailChange(false);
    } catch (err: any) {
      setEmailChangeError(err.message || 'Failed to request email change.');
    } finally {
      setIsEmailChangePending(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setOtpSuccess(null);
    setIsOTPPending(true);
    
    try {
      const result = await api.post(session, '/api/admin/profile/verify-email-change', otpData);
      setOtpSuccess('Email changed successfully!');
      setProfile(prev => ({ ...prev, email: result.newEmail }));
      setShowOTPVerification(false);
      setEmailChangeData({ newEmail: '', currentPassword: '' });
      setOtpData({ otp: '' });
      
      // Refresh profile data
      const updatedProfile = await api.get(session, '/api/admin/profile');
      setProfile(updatedProfile);
    } catch (err: any) {
      setOtpError(err.message || 'Failed to verify OTP.');
    } finally {
      setIsOTPPending(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpError(null);
    try {
      await api.post(session, '/api/admin/profile/resend-email-change-otp', {});
      setOtpSuccess('New verification code sent! Please check your email.');
    } catch (err: any) {
      setOtpError(err.message || 'Failed to resend OTP.');
    }
  };

  const handleCancelEmailChange = async () => {
    try {
      await api.delete(session, '/api/admin/profile/change-email');
      setShowEmailChange(false);
      setShowOTPVerification(false);
      setEmailChangeData({ newEmail: '', currentPassword: '' });
      setOtpData({ otp: '' });
      setEmailChangeError(null);
      setEmailChangeSuccess(null);
      setOtpError(null);
      setOtpSuccess(null);
    } catch (err: any) {
      console.error('Failed to cancel email change:', err);
    }
  };

  if (!profile) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.loaderIcon} />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      {/* Profile Update Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        
        <div className={styles.formContent}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Full Name</label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.inputIcon} />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleTextChange}
                required
                className={styles.input}
                placeholder="Enter your full name"
              />
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                id="email"
                name="email"
                type="email"
                value={profile?.email || ''}
                disabled
                className={styles.input}
                title="Email cannot be changed directly. Use the email change form below."
              />
            </div>
            <button
              type="button"
              className={styles.changeEmailButton}
              onClick={() => setShowEmailChange(true)}
            >
              Change Email
            </button>
          </div>
          
          <div className={styles.inputGroup}>
            <label>Role</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={profile?.role || ''}
                disabled
                className={`${styles.input} ${styles.disabledInput}`}
              />
            </div>
          </div>
        </div>
        
        <div className={styles.formFooter}>
          <div className={styles.messageContainer}>
            {error && <p className={styles.errorMessage}>{error}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}
          </div>
          <button 
            type="submit" 
            disabled={isPending} 
            className={styles.saveButton}
          >
            <Save size={16} />
            <span>{isPending ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>

      {/* Email Change Form */}
      {showEmailChange && (
        <div className={styles.emailChangeOverlay}>
          <div className={styles.emailChangeModal}>
            <div className={styles.modalHeader}>
              <h3>Change Email Address</h3>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowEmailChange(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEmailChangeRequest} className={styles.emailChangeForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="newEmail">New Email Address</label>
                <input
                  id="newEmail"
                  name="newEmail"
                  type="email"
                  value={emailChangeData.newEmail}
                  onChange={handleEmailChangeInput}
                  required
                  className={styles.input}
                  placeholder="Enter new email address"
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={emailChangeData.currentPassword}
                  onChange={handleEmailChangeInput}
                  required
                  className={styles.input}
                  placeholder="Enter your current password"
                />
              </div>
              
              <div className={styles.messageContainer}>
                {emailChangeError && <p className={styles.errorMessage}>{emailChangeError}</p>}
                {emailChangeSuccess && <p className={styles.successMessage}>{emailChangeSuccess}</p>}
              </div>
              
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowEmailChange(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isEmailChangePending} 
                  className={styles.primaryButton}
                >
                  {isEmailChangePending ? 'Sending...' : 'Send Verification Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Form */}
      {showOTPVerification && (
        <div className={styles.emailChangeOverlay}>
          <div className={styles.emailChangeModal}>
            <div className={styles.modalHeader}>
              <h3>Verify Email Change</h3>
              <button
                type="button"
                className={styles.closeButton}
                onClick={handleCancelEmailChange}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.otpInstructions}>
              <p>We've sent a verification code to <strong>{emailChangeData.newEmail}</strong></p>
              <p>Please enter the 6-digit code to complete your email change.</p>
            </div>
            
            <form onSubmit={handleOTPVerification} className={styles.otpForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="otp">Verification Code</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otpData.otp}
                  onChange={handleOTPInput}
                  required
                  maxLength={6}
                  className={styles.input}
                  placeholder="Enter 6-digit code"
                />
              </div>
              
              <div className={styles.messageContainer}>
                {otpError && <p className={styles.errorMessage}>{otpError}</p>}
                {otpSuccess && <p className={styles.successMessage}>{otpSuccess}</p>}
              </div>
              
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={handleResendOTP}
                >
                  Resend Code
                </button>
                <button 
                  type="submit" 
                  disabled={isOTPPending} 
                  className={styles.primaryButton}
                >
                  {isOTPPending ? 'Verifying...' : 'Verify & Change Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
