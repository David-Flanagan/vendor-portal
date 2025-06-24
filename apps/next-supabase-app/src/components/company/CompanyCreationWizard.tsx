'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Alert,
  AlertDescription,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Badge
} from '@beach-box/unify-ui';
import { useAuth } from '@/lib/auth';
import { Building, Users, CreditCard, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  industry: z.string().min(1, 'Please select an industry'),
  companySize: z.string().min(1, 'Please select company size'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  subscriptionTier: z.string().min(1, 'Please select a subscription tier'),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyCreationWizardProps {
  onComplete?: (company: any) => void;
  className?: string;
}

export function CompanyCreationWizard({
  onComplete,
  className
}: CompanyCreationWizardProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { createCompany } = useAuth();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    getValues,
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    mode: 'onChange',
  });

  const watchedName = watch('name');
  const watchedTier = watch('subscriptionTier');

  // Auto-generate slug from company name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Update slug when name changes
  React.useEffect(() => {
    if (watchedName) {
      setValue('slug', generateSlug(watchedName));
    }
  }, [watchedName, setValue]);

  const industries = [
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
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-1000', label: '201-1000 employees' },
    { value: '1000+', label: '1000+ employees' },
  ];

  const subscriptionTiers = [
    {
      value: 'starter',
      label: 'Starter',
      price: '$29/month',
      features: ['Up to 5 users', '10GB storage', 'Basic analytics', 'Email support'],
      badge: 'Most Popular',
      badgeColor: 'blue' as const
    },
    {
      value: 'professional',
      label: 'Professional',
      price: '$99/month',
      features: ['Up to 25 users', '100GB storage', 'Advanced analytics', 'Priority support', 'API access'],
      badge: 'Best Value',
      badgeColor: 'green' as const
    },
    {
      value: 'enterprise',
      label: 'Enterprise',
      price: '$299/month',
      features: ['Unlimited users', '1TB storage', 'Custom analytics', 'Dedicated support', 'SSO', 'Custom integrations'],
      badge: 'Premium',
      badgeColor: 'purple' as const
    },
  ];

  const onSubmit = async (values: CompanyFormValues) => {
    setLoading(true);
    setError('');

    try {
      const company = await createCompany({
        name: values.name,
        slug: values.slug,
        description: values.description,
        // Additional metadata can be stored in settings
        settings: {
          industry: values.industry,
          companySize: values.companySize,
          website: values.website,
          subscriptionTier: values.subscriptionTier,
        }
      });

      onComplete?.(company);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof CompanyFormValues)[] = [];

    if (step === 1) {
      fieldsToValidate = ['name', 'slug', 'description'];
    } else if (step === 2) {
      fieldsToValidate = ['industry', 'companySize', 'website'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Building className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">Company Information</h3>
              <p className="text-sm text-muted-foreground">
                Let's start with the basics about your company
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your company name"
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
                  placeholder="your-company-slug"
                  {...register('slug')}
                />
                <p className="text-xs text-muted-foreground">
                  This will be used in your company URL. Only lowercase letters, numbers, and hyphens.
                </p>
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your company (optional)"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">Company Details</h3>
              <p className="text-sm text-muted-foreground">
                Help us understand your business better
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select onValueChange={(value) => setValue('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p className="text-sm text-red-500">{errors.industry.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size *</Label>
                <Select onValueChange={(value) => setValue('companySize', value)}>
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
                {errors.companySize && (
                  <p className="text-sm text-red-500">{errors.companySize.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://your-company.com (optional)"
                  {...register('website')}
                />
                {errors.website && (
                  <p className="text-sm text-red-500">{errors.website.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CreditCard className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">Choose Your Plan</h3>
              <p className="text-sm text-muted-foreground">
                Start with a 14-day free trial, no credit card required
              </p>
            </div>

            <div className="space-y-4">
              {subscriptionTiers.map((tier) => (
                <div
                  key={tier.value}
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                    watchedTier === tier.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setValue('subscriptionTier', tier.value)}
                >
                  {tier.badge && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-2 left-4 bg-blue-100 text-blue-800"
                    >
                      {tier.badge}
                    </Badge>
                  )}

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          value={tier.value}
                          checked={watchedTier === tier.value}
                          onChange={() => setValue('subscriptionTier', tier.value)}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <div>
                          <h4 className="text-lg font-semibold">{tier.label}</h4>
                          <p className="text-xl font-bold text-primary">{tier.price}</p>
                        </div>
                      </div>

                      <ul className="mt-3 space-y-1">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}

              {errors.subscriptionTier && (
                <p className="text-sm text-red-500">{errors.subscriptionTier.message}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle>Create Your Company</CardTitle>
        <CardDescription>
          Set up your organization in just a few steps
        </CardDescription>
        <div className="mt-4">
          <Progress value={progress} className="w-full" />
          <p className="mt-2 text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}

          <div className="flex justify-between pt-6">
            <div>
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating Company...' : 'Create Company'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}