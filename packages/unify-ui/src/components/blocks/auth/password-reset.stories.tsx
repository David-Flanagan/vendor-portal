import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PasswordResetRequest, PasswordResetForm } from './password-reset';

const meta = {
  title: 'Blocks/Auth/PasswordReset',
  component: PasswordResetRequest,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PasswordResetRequest>;

export default meta;
type Story = StoryObj<typeof meta>;

// PasswordResetRequest stories
export const RequestDefault: Story = {
  args: {
    onSubmit: (values) => console.log('Submit:', values),
    onBack: () => console.log('Back clicked'),
  },
};

export const RequestLoading: Story = {
  args: {
    ...RequestDefault.args,
    loading: true,
  },
};

export const RequestWithError: Story = {
  args: {
    ...RequestDefault.args,
    error: 'Failed to send verification code. Please try again.',
  },
};

export const RequestCustomTitle: Story = {
  args: {
    ...RequestDefault.args,
    title: 'Forgot your password?',
    description: "We'll help you reset it. Just enter your email below.",
  },
};

export const RequestWithoutBack: Story = {
  args: {
    onSubmit: (values) => console.log('Submit:', values),
  },
};

export const RequestWithCustomClassName: Story = {
  args: {
    ...RequestDefault.args,
    className: 'border-2 border-blue-500',
  },
};

// PasswordResetForm stories
export const FormDefault: Story = {
  render: () => (
    <PasswordResetForm
      onSubmit={(values) => console.log('Submit:', values)}
      onResendCode={() => console.log('Resend code')}
      onBack={() => console.log('Back clicked')}
      email="user@example.com"
    />
  ),
};

export const FormLoading: Story = {
  render: () => (
    <PasswordResetForm
      onSubmit={(values) => console.log('Submit:', values)}
      onResendCode={() => console.log('Resend code')}
      onBack={() => console.log('Back clicked')}
      email="user@example.com"
      loading={true}
    />
  ),
};

export const FormResending: Story = {
  render: () => (
    <PasswordResetForm
      onSubmit={(values) => console.log('Submit:', values)}
      onResendCode={() => console.log('Resend code')}
      onBack={() => console.log('Back clicked')}
      email="user@example.com"
      resending={true}
    />
  ),
};

export const FormWithError: Story = {
  render: () => (
    <PasswordResetForm
      onSubmit={(values) => console.log('Submit:', values)}
      onResendCode={() => console.log('Resend code')}
      onBack={() => console.log('Back clicked')}
      email="user@example.com"
      error="Invalid verification code. Please try again."
    />
  ),
};

export const FormCustomTitle: Story = {
  render: () => (
    <PasswordResetForm
      onSubmit={(values) => console.log('Submit:', values)}
      onResendCode={() => console.log('Resend code')}
      onBack={() => console.log('Back clicked')}
      email="user@example.com"
      title="Set New Password"
      description="Enter the 6-digit code and your new password"
    />
  ),
};

export const FormWithoutResend: Story = {
  render: () => (
    <PasswordResetForm
      onSubmit={(values) => console.log('Submit:', values)}
      onBack={() => console.log('Back clicked')}
      email="user@example.com"
    />
  ),
};

export const FormWithoutBack: Story = {
  render: () => (
    <PasswordResetForm
      onSubmit={(values) => console.log('Submit:', values)}
      onResendCode={() => console.log('Resend code')}
      email="user@example.com"
    />
  ),
};

export const FormWithoutEmail: Story = {
  render: () => (
    <PasswordResetForm
      onSubmit={(values) => console.log('Submit:', values)}
      onResendCode={() => console.log('Resend code')}
      onBack={() => console.log('Back clicked')}
    />
  ),
};

export const FormWithCustomClassName: Story = {
  render: () => (
    <PasswordResetForm
      onSubmit={(values) => console.log('Submit:', values)}
      onResendCode={() => console.log('Resend code')}
      onBack={() => console.log('Back clicked')}
      email="user@example.com"
      className="border-2 border-blue-500"
    />
  ),
};

// Password validation examples
export const FormWithWeakPassword: Story = {
  render: () => (
    <PasswordResetForm
      onSubmit={(values) => console.log('Submit:', values)}
      onResendCode={() => console.log('Resend code')}
      onBack={() => console.log('Back clicked')}
      email="user@example.com"
      error="Password must be at least 8 characters and contain uppercase, lowercase, number, and special character."
    />
  ),
};

export const FormWithMismatchedPasswords: Story = {
  render: () => (
    <PasswordResetForm
      onSubmit={(values) => console.log('Submit:', values)}
      onResendCode={() => console.log('Resend code')}
      onBack={() => console.log('Back clicked')}
      email="user@example.com"
      error="Passwords don't match. Please try again."
    />
  ),
};

// Success state examples
export const RequestSuccess: Story = {
  args: {
    ...RequestDefault.args,
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Code sent successfully');
    },
  },
};

export const FormSuccess: Story = {
  render: () => (
    <PasswordResetForm
      onSubmit={async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Password reset successfully:', values);
      }}
      onResendCode={() => console.log('Resend code')}
      onBack={() => console.log('Back clicked')}
      email="user@example.com"
    />
  ),
};
