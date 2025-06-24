'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Alert,
  AlertDescription,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@beach-box/unify-ui';
import { MoreHorizontal, Mail, Calendar, Shield, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { RoleSelector } from './RoleSelector';
import { toast } from 'react-hot-toast';

interface TeamMember {
  id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'manager' | 'member' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  joined_at: string;
  user_profiles: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
  auth_users: {
    email: string;
  } | null;
}

interface TeamMembersListProps {
  companyId: string;
}

export function TeamMembersList({ companyId }: TeamMembersListProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [updatingMember, setUpdatingMember] = useState<string | null>(null);
  const { user, hasRole, membership } = useAuth();

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_memberships')
        .select(`
          id,
          user_id,
          role,
          status,
          joined_at,
          user_profiles (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('company_id', companyId)
        .order('joined_at', { ascending: false });

      if (error) throw error;

      // Get user emails from auth.users (need to use a function or RPC)
      const userIds = data?.map(m => m.user_id) || [];
      const { data: userEmails, error: emailError } = await supabase.rpc(
        'get_user_emails_for_members',
        { user_ids: userIds }
      );

      if (emailError) {
        console.warn('Could not fetch user emails:', emailError);
      }

      const membersWithEmails = data?.map(member => ({
        ...member,
        auth_users: userEmails?.find((u: any) => u.id === member.user_id) || null
      })) || [];

      setMembers(membersWithEmails);
    } catch (err: any) {
      setError(err.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [companyId]);

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      setUpdatingMember(memberId);

      const { error } = await supabase
        .from('company_memberships')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      // Update local state
      setMembers(members.map(member =>
        member.id === memberId
          ? { ...member, role: newRole as TeamMember['role'] }
          : member
      ));

      toast.success('Member role updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update member role');
    } finally {
      setUpdatingMember(null);
    }
  };

  const handleRemoveMember = async (memberId: string, memberEmail: string) => {
    if (!confirm(`Are you sure you want to remove ${memberEmail} from the team?`)) {
      return;
    }

    try {
      setUpdatingMember(memberId);

      const { error } = await supabase
        .from('company_memberships')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      // Update local state
      setMembers(members.filter(member => member.id !== memberId));

      toast.success('Member removed successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove member');
    } finally {
      setUpdatingMember(null);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner':
        return 'destructive';
      case 'admin':
        return 'default';
      case 'manager':
        return 'secondary';
      case 'member':
        return 'outline';
      case 'viewer':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'inactive':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const canManageMember = (memberRole: string, memberId: string) => {
    // Can't manage yourself
    if (members.find(m => m.id === memberId)?.user_id === user?.id) {
      return false;
    }

    // Only owners and admins can manage members
    if (!hasRole(['owner', 'admin'])) {
      return false;
    }

    // Owners can manage everyone except other owners
    if (membership?.role === 'owner') {
      return memberRole !== 'owner';
    }

    // Admins can only manage members and viewers
    if (membership?.role === 'admin') {
      return ['member', 'viewer'].includes(memberRole);
    }

    return false;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Team Members ({members.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const displayName = member.user_profiles?.first_name && member.user_profiles?.last_name
                ? `${member.user_profiles.first_name} ${member.user_profiles.last_name}`
                : member.auth_users?.email || 'Unknown User';

              const initials = member.user_profiles?.first_name && member.user_profiles?.last_name
                ? `${member.user_profiles.first_name[0]}${member.user_profiles.last_name[0]}`
                : member.auth_users?.email?.[0]?.toUpperCase() || 'U';

              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.user_profiles?.avatar_url || ''} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{displayName}</div>
                        <div className="text-sm text-gray-500">
                          {member.auth_users?.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(member.status)}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(member.joined_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    {canManageMember(member.role, member.id) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={updatingMember === member.id}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Manage Member</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          <RoleSelector
                            currentRole={member.role}
                            onRoleChange={(newRole) => handleRoleChange(member.id, newRole)}
                            disabled={updatingMember === member.id}
                          />

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleRemoveMember(member.id, member.auth_users?.email || displayName)}
                          >
                            Remove from team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {members.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No team members found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}