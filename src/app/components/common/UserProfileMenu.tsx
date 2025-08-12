'use client';
import Image from "next/image";
import styles from './UserProfileMenu.module.css';
import { User, LogOut } from 'lucide-react';
import SignOutButton from "../SignOutButton";
import { useEffect, useState, useRef } from "react";
import { clearAllCookies, getCookie } from "@/lib/cookieUtils";
import { jwtDecode } from "jwt-decode"; 
import { redirect } from "next/navigation";

export default function UserProfileMenu() { 
    const [session, setSession] = useState<string | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setIsClient(true);
        const accessToken = getCookie("accessToken");
        if (accessToken) {
            try { console.log(jwtDecode(accessToken)); } catch (err) { /* ignore client decode errors */ }
        }
        setSession(accessToken);
    }, []);
    
    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const data = {
                name: getCookie("name") || "",
                email: getCookie("email") || "",
                profile_picture: getCookie("profile_picture") || ""
            };
            setUserData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (session && isClient) {
            fetchUserData();
        } else if (!session && isClient) {
            setUserData(null);
            setIsLoading(false);
            setError(null);
        }
    }, [session, isClient]);
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }
    };
    
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    if (!isClient) {
        return (
            <div className={styles.menuContainer}>
                <div className={styles.avatarButton}>
                    <div className={styles.avatarFallback}>U</div>
                </div>
            </div>
        );
    }
    
    if (!session) return null;
    
    const getInitials = (name: string) => {
        if (!name) return 'U';
        const names = name.split(' ');
        const initials = names.map(n => n[0]).join('');
        return initials.slice(0, 2).toUpperCase();
    };
    
    if (isLoading) {
        return (
            <div className={styles.menuContainer}>
                <div className={styles.avatarButton}>
                    <div className={styles.avatarFallback}>...</div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className={styles.menuContainer}>
                <div className={styles.avatarButton}>
                    <div className={styles.avatarFallback}>!</div>
                </div>
            </div>
        );
    }
    
    if (!userData) return null;
    
    return (
        <div className={styles.menuContainer} ref={menuRef}>
            <button 
                className={styles.avatarButton} 
                onClick={toggleMenu}
                aria-label="User menu"
                aria-expanded={isMenuOpen}
            >
                {userData.profile_picture ? (
                    <Image 
                        src={userData.profile_picture} 
                        alt="Profile" 
                        width={32} 
                        height={32} 
                        className={styles.avatar} 
                    />
                ) : (
                    <div className={styles.avatarFallback}>
                        {getInitials(userData.name)}
                    </div>
                )}
            </button>
            
            <div className={`${styles.dropdown} ${isMenuOpen ? styles.dropdownOpen : ''}`}>
                <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownName}>{userData.name}</p>
                    <p className={styles.dropdownEmail}>{userData.email}</p>
                </div>
                <a href="/dashboard/profile" className={styles.dropdownItem}>
                    <User size={14} /> My Profile
                </a>
                <SignOutButton />
            </div>
        </div>
    );
}