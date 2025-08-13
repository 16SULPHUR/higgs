'use client';

import { useEffect, useState } from 'react';
import { useSessionContext } from '@/contexts/SessionContext';
import { api } from '@/lib/api.client';
import MemberList from '@/components/member-book/MemberList';

type UserBase = { id: string; name: string };

export default function MemberBookClient({ initialUsers }: { initialUsers: UserBase[] }) {
  const session = useSessionContext();
  const [users, setUsers] = useState<any[]>(initialUsers || []);

  useEffect(() => {
    if (!session) return;
    let isCancelled = false;
    api
      .get(session, '/api/users/member-book')
      .then((fullList) => {
        if (isCancelled) return;
        if (Array.isArray(fullList)) {
          setUsers(fullList);
        }
      })
      .catch(() => {});
    return () => {
      isCancelled = true;
    };
  }, [session]);

  return <MemberList initialUsers={users} />;
}


