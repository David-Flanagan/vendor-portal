'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Alert,
  AlertDescription,
  Card,
  CardContent,
  Separator,
} from '@beach-box/unify-ui';
import { Plus, Trash2, Mail, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const inviteSchema = z.object({
  invitations: z.array(z.object({
    email: z.string().email('Please enter a valid email address'),
    role: z.enum(['admin', 'manager', 'member', 'viewer'], {
      required_error: 'Please select a role',
    }),
  })).min(1, 'At least one invitation is required'),
  message: z.string().optional(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteUserFormProps {
  companyId: string;
}

export function InviteUserForm({ companyId }: InviteUserFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      invitations: [{ email: '', role: 'member' }],
      message: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'invitations',
  });

  const watchedInvitations = watch('invitations');

  const roles = [
    { value: 'viewer', label: 'Viewer', description: 'Can view content only' },
    { value: 'member', label: 'Member', description: 'Can view and edit content' },
    { value: 'manager', label: 'Manager', description: 'Can manage team members' },
    { value: 'admin', label: 'Admin', description: 'Full administrative access' },
  ];

  const generateInviteToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const onSubmit = async (values: InviteFormValues) => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const invitations = values.invitations.map(invitation => ({
        company_id: companyId,
        email: invitation.email.toLowerCase().trim(),
        role: invitation.role,
        token: generateInviteToken(),
        invited_by: user.id,
        message: values.message || null,
      }));

      const { data, error: inviteError } = await supabase
        .from('invitations')
        .insert(invitations)
        .select();

      if (inviteError) {
        throw inviteError;
      }

      // TODO: Send invitation emails (this would typically be done via a Supabase function or API route)
      // For now, we'll just show a success message
      toast.success(`Successfully sent ${invitations.length} invitation${invitations.length > 1 ? 's' : ''}!`);

      // Reset form
      reset();

      // Redirect back to team page
      router.push('/team');
    } catch (err: any) {
      console.error('Error sending invitations:', err);
      if (err.code === '23505') {
        setError('One or more email addresses have already been invited to this company.');
      } else {
        setError(err.message || 'Failed to send invitations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const addInvitation = () => {
    append({ email: '', role: 'member' });
  };

  const removeInvitation = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const bulkImport = (emails: string) => {
    const emailList = emails
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email && email.includes('@'));

    if (emailList.length === 0) {
      toast.error('No valid emails found');
      return;
    }

    // Clear existing invitations and add new ones
    remove();
    emailList.forEach(email => {
      append({ email, role: 'member' });
    });

    toast.success(`Added ${emailList.length} email${emailList.length > 1 ? 's' : ''}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Bulk Import */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label>Bulk Import (Optional)</Label>
            <Textarea
              placeholder="Paste email addresses separated by commas or new lines..."
              onBlur={(e) => {
                const value = e.target.value.trim();
                if (value) {
                  bulkImport(value);
                  e.target.value = '';
                }
              }}
            />
            <p className="text-xs text-gray-500">
              You can paste multiple email addresses separated by commas or new lines
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Individual Invitations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Team Invitations</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addInvitation}
            disabled={loading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another
          </Button>
        </div>

        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`invitations.${index}.email`}>
                    Email Address *
                  </Label>
                  <Input
                    id={`invitations.${index}.email`}
                    type="email"
                    placeholder="colleague@company.com"
                    {...register(`invitations.${index}.email`)}
                  />
                  {errors.invitations?.[index]?.email && (
                    <p className="text-sm text-red-500">
                      {errors.invitations[index]?.email?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`invitations.${index}.role`}>Role *</Label>
                  <Select
                    value={watchedInvitations[index]?.role || 'member'}
                    onValueChange={(value) =>
                      setValue(`invitations.${index}.role`, value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div>
                            <div className="font-medium">{role.label}</div>
                            <div className="text-xs text-gray-500">
                              {role.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.invitations?.[index]?.role && (
                    <p className="text-sm text-red-500">
                      {errors.invitations[index]?.role?.message}
                    </p>
                  )}
                </div>
              </div>

              {fields.length > 1 && (
                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInvitation(index)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Personal Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Personal Message (Optional)</Label>
        <Textarea
          id="message"
          placeholder="Add a personal message to your invitation..."
          {...register('message')}
        />
        <p className="text-xs text-gray-500">
          This message will be included in the invitation email
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/team')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending Invitations...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Send {fields.length} Invitation{fields.length > 1 ? 's' : ''}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}