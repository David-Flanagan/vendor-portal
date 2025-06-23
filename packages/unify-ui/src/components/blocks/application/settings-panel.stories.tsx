import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SettingsPanel } from './settings-panel';
import { Settings, Shield, Bell, Database, Globe, User, Mail, Lock } from 'lucide-react';

const meta = {
  title: 'Blocks/Application/SettingsPanel',
  component: SettingsPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SettingsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample settings tabs
const sampleTabs = [
  {
    id: 'general',
    label: 'General',
    icon: Settings,
    sections: [
      {
        id: 'appearance',
        title: 'Appearance',
        description: 'Customize the look and feel of the application',
        icon: Globe,
        fields: [
          {
            id: 'theme',
            label: 'Theme',
            description: 'Choose your preferred theme',
            type: 'select',
            value: 'light',
            options: [
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
              { label: 'System', value: 'system' },
            ],
          },
          {
            id: 'fontSize',
            label: 'Font Size',
            description: 'Adjust the base font size',
            type: 'slider',
            value: 16,
            min: 12,
            max: 24,
            step: 1,
          },
          {
            id: 'animations',
            label: 'Enable Animations',
            description: 'Show animations and transitions',
            type: 'switch',
            value: true,
          },
        ],
      },
      {
        id: 'language',
        title: 'Language & Region',
        description: 'Set your preferred language and regional settings',
        fields: [
          {
            id: 'language',
            label: 'Language',
            type: 'select',
            value: 'en',
            options: [
              { label: 'English', value: 'en' },
              { label: 'Spanish', value: 'es' },
              { label: 'French', value: 'fr' },
              { label: 'German', value: 'de' },
            ],
          },
          {
            id: 'timezone',
            label: 'Timezone',
            type: 'select',
            value: 'UTC',
            options: [
              { label: 'UTC', value: 'UTC' },
              { label: 'EST', value: 'EST' },
              { label: 'PST', value: 'PST' },
              { label: 'GMT', value: 'GMT' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    icon: User,
    sections: [
      {
        id: 'profile',
        title: 'Profile',
        description: 'Manage your account information',
        fields: [
          {
            id: 'name',
            label: 'Full Name',
            type: 'text',
            value: 'John Doe',
            required: true,
            validation: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
          },
          {
            id: 'email',
            label: 'Email',
            type: 'email',
            value: 'john@example.com',
            required: true,
            validation: (value) => (!value.includes('@') ? 'Invalid email address' : null),
          },
          {
            id: 'bio',
            label: 'Bio',
            type: 'textarea',
            value: 'Software engineer and tech enthusiast',
            placeholder: 'Tell us about yourself',
          },
        ],
      },
      {
        id: 'security',
        title: 'Security',
        description: 'Manage your account security settings',
        icon: Shield,
        fields: [
          {
            id: 'twoFactor',
            label: 'Two-Factor Authentication',
            description: 'Add an extra layer of security to your account',
            type: 'switch',
            value: false,
          },
          {
            id: 'password',
            label: 'Change Password',
            type: 'password',
            value: '',
            placeholder: 'Enter new password',
            validation: (value) =>
              value.length < 8 ? 'Password must be at least 8 characters' : null,
          },
        ],
      },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    sections: [
      {
        id: 'email',
        title: 'Email Notifications',
        description: 'Configure your email notification preferences',
        icon: Mail,
        fields: [
          {
            id: 'marketing',
            label: 'Marketing Emails',
            description: 'Receive updates about new features and promotions',
            type: 'switch',
            value: true,
          },
          {
            id: 'security',
            label: 'Security Alerts',
            description: 'Get notified about important security updates',
            type: 'switch',
            value: true,
          },
          {
            id: 'frequency',
            label: 'Email Frequency',
            type: 'select',
            value: 'daily',
            options: [
              { label: 'Daily Digest', value: 'daily' },
              { label: 'Weekly Summary', value: 'weekly' },
              { label: 'Monthly Report', value: 'monthly' },
            ],
          },
        ],
      },
      {
        id: 'push',
        title: 'Push Notifications',
        description: 'Manage your push notification settings',
        fields: [
          {
            id: 'enabled',
            label: 'Enable Push Notifications',
            type: 'switch',
            value: true,
          },
          {
            id: 'sound',
            label: 'Notification Sound',
            type: 'switch',
            value: true,
          },
        ],
      },
    ],
  },
  {
    id: 'data',
    label: 'Data & Privacy',
    icon: Database,
    sections: [
      {
        id: 'privacy',
        title: 'Privacy Settings',
        description: 'Control your data and privacy preferences',
        icon: Lock,
        fields: [
          {
            id: 'dataCollection',
            label: 'Data Collection',
            description: 'Allow us to collect usage data to improve our services',
            type: 'switch',
            value: true,
          },
          {
            id: 'analytics',
            label: 'Analytics',
            description: 'Help us improve by sharing anonymous usage data',
            type: 'switch',
            value: true,
          },
          {
            id: 'retention',
            label: 'Data Retention',
            type: 'select',
            value: '30',
            options: [
              { label: '30 days', value: '30' },
              { label: '90 days', value: '90' },
              { label: '1 year', value: '365' },
            ],
          },
        ],
      },
    ],
  },
];

export const Default: Story = {
  args: {
    tabs: sampleTabs,
    onSave: (values) => console.log('Save settings:', values),
    onReset: () => console.log('Reset settings'),
    onChange: (fieldId, value) => console.log('Field changed:', fieldId, value),
  },
};

export const WithHistory: Story = {
  args: {
    tabs: sampleTabs,
    showHistory: true,
    onSave: (values) => console.log('Save settings:', values),
    onReset: () => console.log('Reset settings'),
    onChange: (fieldId, value) => console.log('Field changed:', fieldId, value),
  },
};

export const Loading: Story = {
  args: {
    tabs: sampleTabs,
    isLoading: true,
  },
};

export const Dirty: Story = {
  args: {
    tabs: sampleTabs,
    isDirty: true,
    onSave: (values) => console.log('Save settings:', values),
    onReset: () => console.log('Reset settings'),
    onChange: (fieldId, value) => console.log('Field changed:', fieldId, value),
  },
};

export const WithValidation: Story = {
  args: {
    tabs: [
      {
        id: 'validation',
        label: 'Validation',
        sections: [
          {
            id: 'fields',
            title: 'Form Fields',
            fields: [
              {
                id: 'required',
                label: 'Required Field',
                type: 'text',
                value: '',
                required: true,
              },
              {
                id: 'email',
                label: 'Email',
                type: 'email',
                value: 'invalid-email',
                validation: (value) => (!value.includes('@') ? 'Invalid email address' : null),
              },
              {
                id: 'url',
                label: 'Website',
                type: 'url',
                value: 'not-a-url',
                validation: (value) => (!value.startsWith('http') ? 'Invalid URL' : null),
              },
              {
                id: 'number',
                label: 'Number',
                type: 'number',
                value: 5,
                min: 1,
                max: 10,
                validation: (value) =>
                  value < 1 || value > 10 ? 'Value must be between 1 and 10' : null,
              },
            ],
          },
        ],
      },
    ],
    onSave: (values) => console.log('Save settings:', values),
    onReset: () => console.log('Reset settings'),
    onChange: (fieldId, value) => console.log('Field changed:', fieldId, value),
  },
};

export const WithDisabledFields: Story = {
  args: {
    tabs: [
      {
        id: 'disabled',
        label: 'Disabled Fields',
        sections: [
          {
            id: 'fields',
            title: 'Form Fields',
            fields: [
              {
                id: 'text',
                label: 'Text Field',
                type: 'text',
                value: 'Disabled text',
                disabled: true,
              },
              {
                id: 'select',
                label: 'Select Field',
                type: 'select',
                value: 'option1',
                options: [
                  { label: 'Option 1', value: 'option1' },
                  { label: 'Option 2', value: 'option2' },
                ],
                disabled: true,
              },
              {
                id: 'switch',
                label: 'Switch Field',
                type: 'switch',
                value: true,
                disabled: true,
              },
            ],
          },
        ],
      },
    ],
  },
};

export const WithCustomClassName: Story = {
  args: {
    tabs: sampleTabs,
    className: 'border-2 border-blue-500 rounded-lg',
  },
};
