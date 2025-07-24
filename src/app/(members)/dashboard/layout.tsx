import { ReactNode } from 'react';
import UserProfileMenu from '@/components/common/UserProfileMenu';
import MemberLayoutClient from './MemberLayoutClient';

// This layout is now simpler. It doesn't need to be async.
export default function MemberPortalLayout({ children }: { children: ReactNode }) {
    return (
        // It just renders the client part, passing the server-rendered menu.
        <MemberLayoutClient
            userProfileMenu={<UserProfileMenu />}
        >
            {children}
        </MemberLayoutClient>
    );
}