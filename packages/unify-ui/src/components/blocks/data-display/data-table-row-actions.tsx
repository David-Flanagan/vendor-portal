import * as React from 'react';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Edit, Copy, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actions?: Array<{
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: (row: Row<TData>) => void;
    shortcut?: string;
    separator?: boolean;
    destructive?: boolean;
  }>;
}

export function DataTableRowActions<TData>({ row, actions = [] }: DataTableRowActionsProps<TData>) {
  const defaultActions = [
    {
      label: 'Edit',
      icon: Edit,
      onClick: (row: Row<TData>) => console.log('Edit', row.original),
      shortcut: '⌘E',
    },
    {
      label: 'Copy',
      icon: Copy,
      onClick: (row: Row<TData>) => console.log('Copy', row.original),
      shortcut: '⌘C',
    },
    {
      label: 'Delete',
      icon: Trash,
      onClick: (row: Row<TData>) => console.log('Delete', row.original),
      shortcut: '⌘D',
      separator: true,
      destructive: true,
    },
  ];

  const finalActions = actions.length > 0 ? actions : defaultActions;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {finalActions.map((action, index) => (
          <React.Fragment key={index}>
            {action.separator && index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={() => action.onClick(row)}
              className={action.destructive ? 'text-destructive' : ''}
            >
              {action.icon && <action.icon className="mr-2 h-3.5 w-3.5" />}
              {action.label}
              {action.shortcut && <DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
