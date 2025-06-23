import * as React from 'react';
import { BaseNode, BaseNodeProps } from './base-node';
import { WorkflowNode } from '../types';
import { GitBranch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface ConditionNodeData extends WorkflowNode {
  condition?: string;
  operator?: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  value?: any;
}

export function ConditionNode(props: BaseNodeProps) {
  const conditionData = props.data as ConditionNodeData;

  // Override the icon with condition-specific icon
  const nodeData = {
    ...props.data,
    icon: GitBranch,
  };

  return (
    <>
      <BaseNode {...props} data={nodeData} />
      {conditionData.condition && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <Badge variant="secondary" className="text-xs font-mono">
            {conditionData.condition} {conditionData.operator} {conditionData.value}
          </Badge>
        </div>
      )}
    </>
  );
}
