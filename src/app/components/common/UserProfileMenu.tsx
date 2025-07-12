
import Image from "next/image";
import Link from "next/link";
import styles from './UserProfileMenu.module.css';
import { User, LogOut } from 'lucide-react';
import { signOut } from "next-auth/react";
import { getSession } from "@/lib/session";
import SignOutButton from "../SignOutButton";

export default async function UserProfileMenu() {
    const session = await getSession();
    if (!session || !session.user) return null;

    console.log(session)
    const getInitials = (name: string) => {

        const names = name.split(' ');
        const initials = names.map(n => n[0]).join('');
        return initials.slice(0, 2).toUpperCase();
    };

    return (
        <div className={styles.menuContainer}>
            <button className={styles.avatarButton}>
                {session.user.profile_picture ? (
                    <Image src={session.user.profile_picture} alt="Profile" width={32} height={32} className={styles.avatar} />
                ) : (
                    <div className={styles.avatarFallback}>{getInitials(session.user.name || 'U')}</div>
                )}
            </button>
            <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownName}>{session.user.name}</p>
                    <p className={styles.dropdownEmail}>{session.user.email}</p>
                </div>
                <Link href="/dashboard/profile" className={styles.dropdownItem}><User size={14} /> My Profile</Link>
                <SignOutButton />
            </div>
        </div>
    );
}