'use client';

import { useState } from 'react';
import {
  DropdownMenuItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@beach-box/unify-ui';

interface RoleSelectorProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  disabled?: boolean;
}

const roles = [
  { value: 'viewer', label: 'Viewer', description: 'Can view content only' },
  { value: 'member', label: 'Member', description: 'Can view and edit content' },
  { value: 'manager', label: 'Manager', description: 'Can manage team members' },
  { value: 'admin', label: 'Admin', description: 'Full administrative access' },
];

export function RoleSelector({ currentRole, onRoleChange, disabled }: RoleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="px-2 py-1">
      <Select
        value={currentRole}
        onValueChange={onRoleChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              <div>
                <div className="font-medium">{role.label}</div>
                <div className="text-xs text-gray-500">{role.description}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}