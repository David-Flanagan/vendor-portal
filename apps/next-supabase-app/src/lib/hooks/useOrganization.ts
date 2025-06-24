import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

export function useOrganization() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['organization', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data: orgMemberships, error: membersError } = await supabase
        .from('org_members')
        .select('id, org_id, user_id, role')
        .eq('user_id', user.id);

      if (membersError) throw membersError;
      if (!orgMemberships || orgMemberships.length === 0) return null;

      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgMemberships[0].org_id)
        .single();

      if (orgError) throw orgError;
      return org;
    },
    enabled: !!user,
  });
}