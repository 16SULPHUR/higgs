import { ReactNode } from 'react';
import UserProfileMenu from '@/components/common/UserProfileMenu';
import MemberLayoutClient from './MemberLayoutClient'; // We will create this next

export default async function MemberPortalLayout({ children }: { children: ReactNode }) {
    return (
        <MemberLayoutClient
            userProfileMenu={<UserProfileMenu />} // Pass the Server Component as a prop
        >
            {children}
        </MemberLayoutClient>
    );
}