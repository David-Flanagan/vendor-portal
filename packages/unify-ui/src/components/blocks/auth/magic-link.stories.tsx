import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MagicLinkForm, MagicLinkVerification } from './magic-link';

const meta = {
  title: 'Blocks/Auth/MagicLink',
  component: MagicLinkForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MagicLinkForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (values) => console.log('Submit:', values),
    onBack: () => console.log('Back clicked'),
    onResend: () => console.log('Resend clicked'),
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const Resending: Story = {
  args: {
    ...Default.args,
    resending: true,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: 'Failed to send magic link. Please try again.',
  },
};

export const CustomTitle: Story = {
  args: {
    ...Default.args,
    title: 'Login with Magic Link',
    description: 'Enter your email to receive a secure login link',
  },
};

export const WithoutIcon: Story = {
  args: {
    ...Default.args,
    showIcon: false,
  },
};

export const CustomSuccessMessage: Story = {
  args: {
    ...Default.args,
    successMessage: 'Your magic link is on its way! Check your inbox.',
  },
};

export const WithoutBackButton: Story = {
  args: {
    onSubmit: (values) => console.log('Submit:', values),
    onResend: () => console.log('Resend clicked'),
  },
};

export const WithoutResend: Story = {
  args: {
    onSubmit: (values) => console.log('Submit:', values),
    onBack: () => console.log('Back clicked'),
  },
};

export const WithCustomClassName: Story = {
  args: {
    ...Default.args,
    className: 'border-2 border-blue-500',
  },
};

// MagicLinkVerification stories
export const VerificationDefault: Story = {
  render: () => (
    <MagicLinkVerification
      onVerify={() => console.log('Verify clicked')}
      onResend={() => console.log('Resend clicked')}
      onCancel={() => console.log('Cancel clicked')}
      token="sample-token"
      email="user@example.com"
    />
  ),
};

export const VerificationLoading: Story = {
  render: () => (
    <MagicLinkVerification
      onVerify={() => console.log('Verify clicked')}
      onResend={() => console.log('Resend clicked')}
      onCancel={() => console.log('Cancel clicked')}
      token="sample-token"
      email="user@example.com"
      loading={true}
    />
  ),
};

export const VerificationWithError: Story = {
  render: () => (
    <MagicLinkVerification
      onVerify={() => console.log('Verify clicked')}
      onResend={() => console.log('Resend clicked')}
      onCancel={() => console.log('Cancel clicked')}
      token="sample-token"
      email="user@example.com"
      error="Invalid or expired token. Please request a new magic link."
    />
  ),
};

export const VerificationWithoutCancel: Story = {
  render: () => (
    <MagicLinkVerification
      onVerify={() => console.log('Verify clicked')}
      onResend={() => console.log('Resend clicked')}
      token="sample-token"
      email="user@example.com"
    />
  ),
};

export const VerificationWithoutResend: Story = {
  render: () => (
    <MagicLinkVerification
      onVerify={() => console.log('Verify clicked')}
      onCancel={() => console.log('Cancel clicked')}
      token="sample-token"
      email="user@example.com"
    />
  ),
};

export const VerificationWithCustomClassName: Story = {
  render: () => (
    <MagicLinkVerification
      onVerify={() => console.log('Verify clicked')}
      onResend={() => console.log('Resend clicked')}
      onCancel={() => console.log('Cancel clicked')}
      token="sample-token"
      email="user@example.com"
      className="border-2 border-blue-500"
    />
  ),
};
