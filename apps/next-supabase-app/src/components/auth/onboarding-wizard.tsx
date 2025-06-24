'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Alert, AlertDescription, Progress, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@beach-box/unify-ui';
import { useAuth } from '@/lib/auth';
import { Building, Users, Target, CheckCircle, ArrowRight } from 'lucide-react';

const onboardingSchema = z.object({
  companySize: z.string().min(1, 'Please select company size'),
  industry: z.string().min(1, 'Please select industry'),
  role: z.string().min(1, 'Please select your role'),
  goals: z.array(z.string()).min(1, 'Please select at least one goal'),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

interface OnboardingWizardProps {
  onComplete?: () => void;
  onSkip?: () => void;
  className?: string;
}

export function OnboardingWizard({
  onComplete,
  onSkip,
  className
}: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      goals: [],
    },
  });

  const companySizes = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-1000', label: '201-1000 employees' },
    { value: '1000+', label: '1000+ employees' },
  ];

  const industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'other', label: 'Other' },
  ];

  const roles = [
    { value: 'founder', label: 'Founder/CEO' },
    { value: 'manager', label: 'Manager' },
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'marketer', label: 'Marketer' },
    { value: 'sales', label: 'Sales' },
    { value: 'other', label: 'Other' },
  ];

  const goalOptions = [
    { id: 'team_collaboration', label: 'Improve team collaboration' },
    { id: 'project_management', label: 'Better project management' },
    { id: 'automation', label: 'Automate workflows' },
    { id: 'analytics', label: 'Track and analyze data' },
    { id: 'customer_management', label: 'Manage customers' },
    { id: 'growth', label: 'Scale the business' },
  ];

  const watchedGoals = watch('goals');

  const handleGoalToggle = (goalId: string) => {
    const currentGoals = getValues('goals') || [];
    const updatedGoals = currentGoals.includes(goalId)
      ? currentGoals.filter(id => id !== goalId)
      : [...currentGoals, goalId];
    setValue('goals', updatedGoals);
  };

  const onSubmit = async (values: OnboardingFormValues) => {
    setLoading(true);
    setError('');

    try {
      // Update user profile with onboarding data
      await updateProfile({
        preferences: {
          onboarding_completed: true,
          company_size: values.companySize,
          industry: values.industry,
          role: values.role,
          goals: values.goals,
        },
      });

      onComplete?.();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      router.push('/dashboard');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Building className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">Tell us about your company</h3>
              <p className="text-sm text-muted-foreground">
                This helps us customize your experience
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companySize">Company size</Label>
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
                <Label htmlFor="industry">Industry</Label>
                <Select onValueChange={(value) => setValue('industry', value)}>
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
                {errors.industry && (
                  <p className="text-sm text-red-500">{errors.industry.message}</p>
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
              <h3 className="mt-4 text-lg font-semibold">What's your role?</h3>
              <p className="text-sm text-muted-foreground">
                Help us understand how you'll use our platform
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Your role</Label>
              <Select onValueChange={(value) => setValue('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">What are your goals?</h3>
              <p className="text-sm text-muted-foreground">
                Select all that apply to get personalized recommendations
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {goalOptions.map((goal) => (
                <Button
                  key={goal.id}
                  variant={watchedGoals?.includes(goal.id) ? "default" : "outline"}
                  className="justify-start h-auto p-4"
                  onClick={() => handleGoalToggle(goal.id)}
                  type="button"
                >
                  {watchedGoals?.includes(goal.id) && (
                    <CheckCircle className="mr-3 h-4 w-4" />
                  )}
                  {goal.label}
                </Button>
              ))}
            </div>
            {errors.goals && (
              <p className="text-sm text-red-500">{errors.goals.message}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle>Welcome to our platform!</CardTitle>
        <CardDescription>
          Let's set up your account in just a few steps
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
                  Back
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
                disabled={loading}
              >
                Skip for now
              </Button>
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
                  {loading ? 'Completing...' : 'Complete setup'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}