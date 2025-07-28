'use client';

import Image from "next/image";
import Link from "next/link";
import styles from './UserProfileMenu.module.css';
import { User, LogOut } from 'lucide-react';
import { signOut } from "next-auth/react";
import { getSession } from "@/lib/session";
import SignOutButton from "../SignOutButton";
import { useSessionContext } from "@/contexts/SessionContext";
import { useEffect, useState } from "react";
import { api } from "@/lib/api.client";
import { getCookie } from "@/lib/cookieUtils";

export default function UserProfileMenu() { 
    const session = getCookie("accessToken");   
    const [userData, setUserData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserData = async () => {
        console.log(session)
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
        if (session) {
            fetchUserData();
        } else {
            setUserData(null);
            setIsLoading(false);
            setError(null);
        }
    }, [session]);
 
    if (!session) return null;

    const getInitials = (name: string) => {
        const names = name.split(' ');
        const initials = names.map(n => n[0]).join('');
        return initials.slice(0, 2).toUpperCase();
    };
 
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!userData) return null;

    return (
        <div className={styles.menuContainer}>
            <button className={styles.avatarButton}>
                {userData.profile_picture ? (
                    <Image src={userData.profile_picture} alt="Profile" width={32} height={32} className={styles.avatar} />
                ) : (
                    <div className={styles.avatarFallback}>{getInitials(userData.name || 'U')}</div>
                )}
            </button>
            <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownName}>{userData.name}</p>
                    <p className={styles.dropdownEmail}>{userData.email}</p>
                </div>
                <a href="/dashboard/profile" className={styles.dropdownItem}><User size={14} /> My Profile</a>
                <SignOutButton />
            </div>
        </div>
    );
}
