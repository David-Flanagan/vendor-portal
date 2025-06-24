'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Button,
  Input,
  Label,
  Alert,
  AlertDescription,
  Card,
  CardContent,
  Separator,
} from '@beach-box/unify-ui';
import { Upload, Save, AlertTriangle, Image } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { CompanyWithMembership } from '@/types/supabase';

const brandingSchema = z.object({
  logoUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
});

type BrandingFormValues = z.infer<typeof brandingSchema>;

interface CompanyBrandingFormProps {
  company: CompanyWithMembership;
}

export function CompanyBrandingForm({ company }: CompanyBrandingFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      logoUrl: company.logo_url || '',
      primaryColor: company.settings?.primaryColor || '#3b82f6',
      secondaryColor: company.settings?.secondaryColor || '#6b7280',
      accentColor: company.settings?.accentColor || '#10b981',
    },
  });

  const watchedLogoUrl = watch('logoUrl');
  const watchedPrimaryColor = watch('primaryColor');
  const watchedSecondaryColor = watch('secondaryColor');
  const watchedAccentColor = watch('accentColor');

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${company.id}-logo-${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('company-assets')
        .getPublicUrl(fileName);

      setValue('logoUrl', publicUrl);
      toast.success('Logo uploaded successfully!');
    } catch (err: any) {
      console.error('Error uploading logo:', err);
      toast.error(err.message || 'Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const onSubmit = async (values: BrandingFormValues) => {
    setLoading(true);
    setError('');

    try {
      const updateData = {
        logo_url: values.logoUrl || null,
        settings: {
          ...company.settings,
          primaryColor: values.primaryColor,
          secondaryColor: values.secondaryColor,
          accentColor: values.accentColor,
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

      toast.success('Branding settings updated successfully!');

      // Refresh the page to show updated data
      window.location.reload();
    } catch (err: any) {
      console.error('Error updating branding settings:', err);
      setError(err.message || 'Failed to update branding settings. Please try again.');
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

      {/* Logo Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Company Logo</h3>

        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <Label htmlFor="logo">Logo Image</Label>
            <div className="mt-2 flex items-center space-x-4">
              {watchedLogoUrl ? (
                <img
                  src={watchedLogoUrl}
                  alt="Company logo"
                  className="h-16 w-16 object-contain border border-gray-200 rounded-md bg-white p-2"
                />
              ) : (
                <div className="h-16 w-16 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center">
                  <Image className="h-6 w-6 text-gray-400" />
                </div>
              )}

              <div>
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingLogo}
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  {uploadingLogo ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </>
                  )}
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Recommended: Square image, max 2MB, PNG or JPG format
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL (Alternative)</Label>
          <Input
            id="logoUrl"
            placeholder="https://example.com/logo.png"
            {...register('logoUrl')}
          />
          <p className="text-xs text-gray-500">
            You can also provide a direct URL to your logo image
          </p>
        </div>
      </div>

      <Separator />

      {/* Color Scheme Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Color Scheme</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="primaryColor"
                {...register('primaryColor')}
                className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
              />
              <Input
                placeholder="#3b82f6"
                value={watchedPrimaryColor}
                onChange={(e) => setValue('primaryColor', e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              Main brand color used for buttons and highlights
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="secondaryColor"
                {...register('secondaryColor')}
                className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
              />
              <Input
                placeholder="#6b7280"
                value={watchedSecondaryColor}
                onChange={(e) => setValue('secondaryColor', e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              Secondary color for text and subtle elements
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="accentColor"
                {...register('accentColor')}
                className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
              />
              <Input
                placeholder="#10b981"
                value={watchedAccentColor}
                onChange={(e) => setValue('accentColor', e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              Accent color for success states and highlights
            </p>
          </div>
        </div>

        {/* Color Preview */}
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-semibold mb-3">Color Preview</h4>
            <div className="flex items-center space-x-4">
              <div
                className="h-12 w-12 rounded-md border"
                style={{ backgroundColor: watchedPrimaryColor }}
                title="Primary Color"
              />
              <div
                className="h-12 w-12 rounded-md border"
                style={{ backgroundColor: watchedSecondaryColor }}
                title="Secondary Color"
              />
              <div
                className="h-12 w-12 rounded-md border"
                style={{ backgroundColor: watchedAccentColor }}
                title="Accent Color"
              />
              <div className="text-sm text-gray-600">
                Preview of your color scheme
              </div>
            </div>
          </CardContent>
        </Card>
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
              Save Branding
            </>
          )}
        </Button>
      </div>
    </form>
  );
}