'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import NewInvoiceForm from './new-invoice-form';

export default function NewInvoicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Starting NewInvoicePage render");
        setIsLoading(true);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("No session, redirecting to signin");
          router.push('/signin');
          return;
        }

        const { data: orgMemberships, error: membersError } = await supabase
          .from('org_members')
          .select('id, org_id, user_id, role')
          .eq('user_id', session.user.id);

        console.log("Org memberships:", orgMemberships);

        if (membersError) {
          console.error("Error fetching org memberships:", membersError);
          setError("Failed to fetch organization memberships");
          return;
        }

        if (!orgMemberships || orgMemberships.length === 0) {
          console.log("No org memberships, attempting to create default org");

          try {
            const { data: newOrg, error: createOrgError } = await supabase
              .from('organizations')
              .insert({ name: `${session.user.email?.split('@')[0]}'s Organization` })
              .select()
              .single();

            if (createOrgError) {
              console.error("Error creating org:", createOrgError);
              router.push('/dashboard');
              return;
            }

            if (newOrg) {
              const { error: createMemberError } = await supabase
                .from('org_members')
                .insert({
                  org_id: newOrg.id,
                  user_id: session.user.id,
                  role: 'admin',
                });

              if (createMemberError) {
                console.error("Error creating org membership:", createMemberError);
                setError("Failed to create organization membership");
                return;
              } else {
                console.log("Created new org and membership");
                // Continue with the new org instead of redirecting
                const { data: organization } = await supabase
                  .from('organizations')
                  .select('*')
                  .eq('id', newOrg.id)
                  .single();

                if (organization) {
                  setOrganization(organization);
                  setIsLoading(false);
                  return;
                }
              }
            }

            router.push('/dashboard');
            return;
          } catch (error) {
            console.error("Error in org creation:", error);
            router.push('/dashboard');
            return;
          }
        }

        // Get the organization details
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', orgMemberships[0].org_id)
          .single();

        if (orgError) {
          console.error("Error fetching organization:", orgError);
          setError("Failed to fetch organization details");
          return;
        }

        if (!org) {
          console.log("No organization found, redirecting to dashboard");
          router.push('/dashboard');
          return;
        }

        console.log("Organization found:", org);
        setOrganization(org);
      } catch (error) {
        console.error("Unexpected error in NewInvoicePage:", error);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Unable to load organization. <button onClick={() => router.push('/dashboard')} className="text-blue-600">Return to dashboard</button></p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Create New Invoice</h1>
        <p className="text-gray-600">
          Create a new invoice for {organization.name}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <NewInvoiceForm orgId={organization.id} />
      </div>
    </div>
  );
}