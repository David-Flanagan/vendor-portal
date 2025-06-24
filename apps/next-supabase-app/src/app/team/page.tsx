'use client';

import { useAuth } from '@/lib/auth';
import { TeamMembersList } from '@/components/team/TeamMembersList';
import { Button } from '@beach-box/unify-ui';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function TeamPage() {
  const { currentCompany, hasRole } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">
            Manage your team members, roles, and permissions
          </p>
        </div>

        {hasRole(['owner', 'admin']) && (
          <Link href="/team/invite">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Members
            </Button>
          </Link>
        )}
      </div>

      {currentCompany && (
        <TeamMembersList companyId={currentCompany.id} />
      )}
    </div>
  );
}