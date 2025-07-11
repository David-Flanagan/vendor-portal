import { NodeTemplate } from '../types';
import {
  Play,
  Calendar,
  Webhook,
  FileInput,
  MousePointer,
  Send,
  Database,
  Code,
  Mail,
  MessageSquare,
  GitBranch,
  Repeat,
  Clock,
  Zap,
  Server,
  Filter,
  Wand2,
  AlertCircle,
  CheckCircle,
  Users,
  Share2,
  Download,
  Upload,
  Key,
  Shield,
  Globe,
  Shuffle,
} from 'lucide-react';

export const defaultNodeTemplates: NodeTemplate[] = [
  // Triggers
  {
    type: 'trigger',
    category: 'Triggers',
    title: 'Manual Trigger',
    description: 'Start workflow manually with a button click',
    icon: MousePointer,
    defaultConfig: {
      triggerType: 'manual',
    },
    outputs: [{ type: 'output', position: 'right' }],
  },
  {
    type: 'trigger',
    category: 'Triggers',
    title: 'Schedule Trigger',
    description: 'Run workflow on a schedule (cron)',
    icon: Calendar,
    defaultConfig: {
      triggerType: 'schedule',
      schedule: '0 9 * * *', // Daily at 9 AM
    },
    outputs: [{ type: 'output', position: 'right' }],
  },
  {
    type: 'trigger',
    category: 'Triggers',
    title: 'Webhook Trigger',
    description: 'Trigger workflow via HTTP webhook',
    icon: Webhook,
    defaultConfig: {
      triggerType: 'webhook',
      method: 'POST',
    },
    outputs: [{ type: 'output', position: 'right' }],
  },
  {
    type: 'trigger',
    category: 'Triggers',
    title: 'File Upload Trigger',
    description: 'Trigger when a file is uploaded',
    icon: FileInput,
    defaultConfig: {
      triggerType: 'file',
      allowedTypes: ['*/*'],
    },
    outputs: [{ type: 'output', position: 'right' }],
  },

  // Actions
  {
    type: 'action',
    category: 'Actions',
    title: 'HTTP Request',
    description: 'Make an HTTP API call',
    icon: Globe,
    defaultConfig: {
      method: 'GET',
      headers: {},
    },
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [{ type: 'output', position: 'right' }],
  },
  {
    type: 'action',
    category: 'Actions',
    title: 'Send Email',
    description: 'Send an email notification',
    icon: Mail,
    defaultConfig: {
      from: '',
      to: '',
      subject: '',
      body: '',
    },
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [{ type: 'output', position: 'right' }],
  },
  {
    type: 'action',
    category: 'Actions',
    title: 'Database Query',
    description: 'Execute a database query',
    icon: Database,
    defaultConfig: {
      connection: '',
      query: '',
    },
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [{ type: 'output', position: 'right' }],
  },
  {
    type: 'action',
    category: 'Actions',
    title: 'Transform Data',
    description: 'Transform data using JavaScript',
    icon: Wand2,
    defaultConfig: {
      code: '// Transform input data\nreturn input;',
    },
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [{ type: 'output', position: 'right' }],
  },
  {
    type: 'action',
    category: 'Actions',
    title: 'Send Slack Message',
    description: 'Post a message to Slack',
    icon: MessageSquare,
    defaultConfig: {
      channel: '',
      message: '',
    },
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [{ type: 'output', position: 'right' }],
  },

  // Logic
  {
    type: 'condition',
    category: 'Logic',
    title: 'If/Else Condition',
    description: 'Branch workflow based on condition',
    icon: GitBranch,
    defaultConfig: {
      field: '',
      operator: 'equals',
      value: '',
    },
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [
      { type: 'output', position: 'right', label: 'True' },
      { type: 'output', position: 'right', label: 'False' },
    ],
  },
  {
    type: 'loop',
    category: 'Logic',
    title: 'For Each Loop',
    description: 'Iterate over array items',
    icon: Repeat,
    defaultConfig: {
      items: '{{input.items}}',
    },
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [
      { type: 'output', position: 'right', label: 'Item' },
      { type: 'output', position: 'bottom', label: 'Complete' },
    ],
  },
  {
    type: 'action',
    category: 'Logic',
    title: 'Filter Array',
    description: 'Filter array based on conditions',
    icon: Filter,
    defaultConfig: {
      condition: '',
    },
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [{ type: 'output', position: 'right' }],
  },
  {
    type: 'parallel',
    category: 'Logic',
    title: 'Parallel Execution',
    description: 'Run multiple paths simultaneously',
    icon: Share2,
    defaultConfig: {
      branches: 2,
    },
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [
      { type: 'output', position: 'right', label: 'Branch 1' },
      { type: 'output', position: 'right', label: 'Branch 2' },
    ],
  },

  // Utilities
  {
    type: 'delay',
    category: 'Utilities',
    title: 'Delay/Wait',
    description: 'Wait for specified duration',
    icon: Clock,
    defaultConfig: {
      duration: 1000,
      unit: 'ms',
    },
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [{ type: 'output', position: 'right' }],
  },
  {
    type: 'action',
    category: 'Utilities',
    title: 'Log/Debug',
    description: 'Log data for debugging',
    icon: Code,
    defaultConfig: {
      logLevel: 'info',
    },
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [{ type: 'output', position: 'right' }],
  },
  {
    type: 'action',
    category: 'Utilities',
    title: 'Generate UUID',
    description: 'Generate a unique identifier',
    icon: Key,
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [{ type: 'output', position: 'right' }],
  },
  {
    type: 'action',
    category: 'Utilities',
    title: 'Random Choice',
    description: 'Randomly select from options',
    icon: Shuffle,
    defaultConfig: {
      options: [],
    },
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [{ type: 'output', position: 'right' }],
  },

  // Integration
  {
    type: 'action',
    category: 'Integration',
    title: 'Download File',
    description: 'Download file from URL',
    icon: Download,
    defaultConfig: {
      url: '',
    },
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [{ type: 'output', position: 'right' }],
  },
  {
    type: 'action',
    category: 'Integration',
    title: 'Upload File',
    description: 'Upload file to storage',
    icon: Upload,
    defaultConfig: {
      destination: '',
    },
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [{ type: 'output', position: 'right' }],
  },
  {
    type: 'action',
    category: 'Integration',
    title: 'Call Function',
    description: 'Call serverless function',
    icon: Zap,
    defaultConfig: {
      functionName: '',
      payload: {},
    },
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [{ type: 'output', position: 'right' }],
  },

  // Error Handling
  {
    type: 'action',
    category: 'Error Handling',
    title: 'Try/Catch',
    description: 'Handle errors gracefully',
    icon: Shield,
    inputs: [{ type: 'input', position: 'left' }],
    outputs: [
      { type: 'output', position: 'right', label: 'Success' },
      { type: 'output', position: 'right', label: 'Error' },
    ],
  },
  {
    type: 'action',
    category: 'Error Handling',
    title: 'Throw Error',
    description: 'Throw custom error',
    icon: AlertCircle,
    defaultConfig: {
      message: '',
      code: '',
    },
    inputs: [{ type: 'input', position: 'left' }],
  },
  {
    type: 'action',
    category: 'Error Handling',
    title: 'Success Response',
    description: 'Return success response',
    icon: CheckCircle,
    defaultConfig: {
      message: 'Success',
      data: {},
    },
    inputs: [{ type: 'input', position: 'left' }],
  },
];
