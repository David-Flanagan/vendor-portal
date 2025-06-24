'use client';

import { useAuth } from '@/lib/auth';
import { InviteUserForm } from '@/components/team/InviteUserForm';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@beach-box/unify-ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function InviteTeamPage() {
  const { currentCompany } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/team">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Team
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invite Team Members</h1>
          <p className="text-gray-600">
            Send invitations to new team members to join your organization
          </p>
        </div>
      </div>

      {currentCompany && (
        <Card>
          <CardHeader>
            <CardTitle>Invite New Members</CardTitle>
          </CardHeader>
          <CardContent>
            <InviteUserForm companyId={currentCompany.id} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}