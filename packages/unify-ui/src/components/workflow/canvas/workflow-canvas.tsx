import * as React from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Panel,
  Node,
  Edge,
  Connection as FlowConnection,
  NodeChange,
  EdgeChange,
  OnConnect,
  BackgroundVariant,
  SelectionMode,
  PanOnScrollMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from '@/lib/utils';
import { WorkflowNode, Connection, CanvasState, WorkflowSettings } from '../types';
import { nodeTypes } from '../nodes/node-registry';
import { edgeTypes } from '../connections/edge-registry';

export interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  connections: Connection[];
  settings?: WorkflowSettings;
  canvasState?: Partial<CanvasState>;
  onNodesChange?: (changes: NodeChange[]) => void;
  onEdgesChange?: (changes: EdgeChange[]) => void;
  onConnect?: OnConnect;
  onCanvasClick?: () => void;
  onNodeClick?: (node: WorkflowNode) => void;
  onNodeDoubleClick?: (node: WorkflowNode) => void;
  onEdgeClick?: (edge: Connection) => void;
  onSelectionChange?: (selectedNodeIds: string[]) => void;
  className?: string;
  children?: React.ReactNode;
}

function WorkflowCanvasInner({
  nodes,
  connections,
  settings = {},
  canvasState,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onCanvasClick,
  onNodeClick,
  onNodeDoubleClick,
  onEdgeClick,
  onSelectionChange,
  className,
  children,
}: WorkflowCanvasProps) {
  // Memoize node and edge types to prevent re-renders
  const memoizedNodeTypes = React.useMemo(() => nodeTypes, []);
  const memoizedEdgeTypes = React.useMemo(() => edgeTypes, []);

  // Convert our nodes/connections to React Flow format
  const flowNodes = React.useMemo(() => {
    const convertedNodes = nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node as any, // React Flow expects any object as data
      selected: node.isSelected,
      draggable: !node.isLocked && !settings.readonly,
    }));
    console.log('WorkflowCanvas: Converting nodes to React Flow format:', convertedNodes);
    return convertedNodes;
  }, [nodes, settings.readonly]);

  const flowEdges = React.useMemo(() => {
    const convertedEdges = connections.map((conn) => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      sourceHandle: conn.sourcePort,
      targetHandle: conn.targetPort,
      type: conn.type || 'default',
      animated: conn.animated,
      label: conn.label,
      data: conn.data || {},
    }));
    console.log('WorkflowCanvas: Converting connections to React Flow format:', convertedEdges);
    return convertedEdges;
  }, [connections]);

  // Handle selection changes
  const handleSelectionChange = React.useCallback(
    ({ nodes }: { nodes: Node[] }) => {
      const selectedIds = nodes.map((n) => n.id);
      onSelectionChange?.(selectedIds);
    },
    [onSelectionChange]
  );

  return (
    <ReactFlow
      nodes={flowNodes}
      edges={flowEdges}
      nodeTypes={memoizedNodeTypes}
      edgeTypes={memoizedEdgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onPaneClick={onCanvasClick}
      onNodeClick={(event: React.MouseEvent, node: Node) => {
        const workflowNode = node.data as unknown as WorkflowNode;
        onNodeClick?.(workflowNode);
      }}
      onNodeDoubleClick={(event: React.MouseEvent, node: Node) => {
        const workflowNode = node.data as unknown as WorkflowNode;
        onNodeDoubleClick?.(workflowNode);
      }}
      onEdgeClick={(event: React.MouseEvent, edge: Edge) => {
        const connection: Connection = {
          id: edge.id,
          source: edge.source,
          sourcePort: edge.sourceHandle || '',
          target: edge.target,
          targetPort: edge.targetHandle || '',
          type: edge.type as Connection['type'],
          label: edge.label as string | undefined,
          animated: edge.animated,
          data: edge.data,
        };
        onEdgeClick?.(connection);
      }}
      onSelectionChange={handleSelectionChange}
      snapToGrid={settings.snapToGrid}
      snapGrid={[settings.gridSize || 20, settings.gridSize || 20]}
      panOnScroll={settings.allowPan !== false}
      zoomOnScroll={settings.allowZoom !== false}
      minZoom={settings.minZoom || 0.1}
      maxZoom={settings.maxZoom || 2}
      selectionMode={SelectionMode.Partial}
      panOnScrollMode={PanOnScrollMode.Free}
      deleteKeyCode={settings.readonly ? null : (['Delete', 'Backspace'] as any)}
      className={cn('bg-background', className)}
    >
      <Background
        variant={settings.showGrid !== false ? BackgroundVariant.Dots : undefined}
        gap={settings.gridSize || 20}
        className="bg-muted/30"
      />

      <Controls
        showZoom={settings.allowZoom !== false}
        showFitView
        showInteractive
        className="bg-background border-border"
      />

      <MiniMap
        nodeColor={(node: Node) => {
          const workflowNode = node.data as unknown as WorkflowNode;
          switch (workflowNode.status) {
            case 'running':
              return 'rgb(59, 130, 246)'; // blue
            case 'success':
              return 'rgb(34, 197, 94)'; // green
            case 'error':
              return 'rgb(239, 68, 68)'; // red
            case 'warning':
              return 'rgb(251, 146, 60)'; // orange
            default:
              return 'rgb(107, 114, 128)'; // gray
          }
        }}
        className="bg-background border-border"
        maskColor="rgb(0, 0, 0, 0.1)"
      />

      {children}
    </ReactFlow>
  );
}

export function WorkflowCanvas(props: WorkflowCanvasProps) {
  return (
    <div className="w-full h-full">
      <WorkflowCanvasInner {...props} />
    </div>
  );
}
