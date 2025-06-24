'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  Separator,
} from '@beach-box/unify-ui';
import { Save, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { CompanyWithMembership } from '@/types/supabase';

const settingsSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  domain: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface GeneralSettingsFormProps {
  company: CompanyWithMembership;
}

export function GeneralSettingsForm({ company }: GeneralSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: company.name || '',
      slug: company.slug || '',
      description: company.description || '',
      website: company.website || '',
      industry: company.settings?.industry || '',
      companySize: company.settings?.companySize || '',
      domain: company.domain || '',
    },
  });

  const watchedName = watch('name');

  // Auto-generate slug from company name
  React.useEffect(() => {
    if (watchedName && watchedName !== company.name) {
      const newSlug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', newSlug);
    }
  }, [watchedName, setValue, company.name]);

  const industries = [
    { value: '', label: 'Select an industry' },
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'other', label: 'Other' },
  ];

  const companySizes = [
    { value: '', label: 'Select company size' },
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-1000', label: '201-1000 employees' },
    { value: '1000+', label: '1000+ employees' },
  ];

  const onSubmit = async (values: SettingsFormValues) => {
    setLoading(true);
    setError('');

    try {
      // Prepare the update data
      const updateData = {
        name: values.name,
        slug: values.slug,
        description: values.description || null,
        website: values.website || null,
        domain: values.domain || null,
        settings: {
          ...company.settings,
          industry: values.industry || null,
          companySize: values.companySize || null,
        },
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', company.id);

      if (updateError) {
        throw updateError;
      }

      toast.success('Company settings updated successfully!');

      // Refresh the page to show updated data
      window.location.reload();
    } catch (err: any) {
      console.error('Error updating company settings:', err);
      if (err.code === '23505') {
        if (err.message.includes('slug')) {
          setError('This company slug is already taken. Please choose a different one.');
        } else if (err.message.includes('domain')) {
          setError('This domain is already associated with another company.');
        } else {
          setError('A company with these details already exists.');
        }
      } else {
        setError(err.message || 'Failed to update company settings. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              placeholder="Enter company name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Company Slug *</Label>
            <Input
              id="slug"
              placeholder="company-slug"
              {...register('slug')}
            />
            <p className="text-xs text-gray-500">
              Used in URLs and must be unique
            </p>
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Brief description of your company"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://your-company.com"
              {...register('website')}
            />
            {errors.website && (
              <p className="text-sm text-red-500">{errors.website.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Custom Domain</Label>
            <Input
              id="domain"
              placeholder="company.yourdomain.com"
              {...register('domain')}
            />
            <p className="text-xs text-gray-500">
              Optional custom domain for your company
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Company Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Company Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select
              value={watch('industry') || ''}
              onValueChange={(value) => setValue('industry', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry.value} value={industry.value}>
                    {industry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companySize">Company Size</Label>
            <Select
              value={watch('companySize') || ''}
              onValueChange={(value) => setValue('companySize', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                {companySizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading || !isDirty}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}