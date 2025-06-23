import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './calendar';

const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Calendar mode="single" selected={new Date()} className="rounded-md border" {...args} />
  ),
};
