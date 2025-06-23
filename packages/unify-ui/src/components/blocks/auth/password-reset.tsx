import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Loader2,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';

// Request reset schema
const requestResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type RequestResetValues = z.infer<typeof requestResetSchema>;

// Reset password schema
const resetPasswordSchema = z
  .object({
    code: z.string().min(6, 'Verification code must be 6 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export interface PasswordResetRequestProps {
  onSubmit: (values: RequestResetValues) => void | Promise<void>;
  onBack?: () => void;
  error?: string;
  loading?: boolean;
  className?: string;
  title?: string;
  description?: string;
}

export interface PasswordResetFormProps {
  onSubmit: (values: Omit<ResetPasswordValues, 'confirmPassword'>) => void | Promise<void>;
  onResendCode?: () => void | Promise<void>;
  onBack?: () => void;
  email?: string;
  error?: string;
  loading?: boolean;
  resending?: boolean;
  className?: string;
  title?: string;
  description?: string;
}

export function PasswordResetRequest({
  onSubmit,
  onBack,
  error,
  loading = false,
  className,
  title = 'Reset your password',
  description = "Enter your email address and we'll send you a verification code",
}: PasswordResetRequestProps) {
  const [success, setSuccess] = React.useState(false);

  const form = useForm<RequestResetValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (values: RequestResetValues) => {
    await onSubmit(values);
    if (!error) {
      setSuccess(true);
    }
  };

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && !success && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success ? (
          <Alert className="mb-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              We've sent a verification code to your email address. Please check your inbox.
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="name@example.com"
                          className="pl-9"
                          disabled={loading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  'Send verification code'
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>

      {onBack && (
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={onBack} disabled={loading}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export function PasswordResetForm({
  onSubmit,
  onResendCode,
  onBack,
  email,
  error,
  loading = false,
  resending = false,
  className,
  title = 'Create new password',
  description = 'Enter the verification code we sent to your email',
}: PasswordResetFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (values: ResetPasswordValues) => {
    const { confirmPassword, ...submitValues } = values;
    await onSubmit(submitValues);
    if (!error) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <Card className={cn('w-full max-w-md', className)}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Password reset successful</h3>
              <p className="text-sm text-muted-foreground">
                Your password has been successfully reset. You can now sign in with your new
                password.
              </p>
            </div>
            {onBack && (
              <Button onClick={onBack} className="w-full">
                Back to sign in
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>
          {description}
          {email && <span className="block mt-1 font-medium">{email}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter 6-digit code"
                      className="font-mono text-center text-lg"
                      maxLength={6}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        className="pl-9 pr-9"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        className="pl-9 pr-9"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting password...
                </>
              ) : (
                'Reset password'
              )}
            </Button>

            {onResendCode && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={onResendCode}
                disabled={loading || resending}
              >
                {resending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Didn't receive the code? Resend"
                )}
              </Button>
            )}
          </form>
        </Form>
      </CardContent>

      {onBack && (
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={onBack} disabled={loading}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
