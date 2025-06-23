import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon | React.ReactNode;
  badge?: string | number;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  active?: boolean;
  disabled?: boolean;
  children?: NavItem[];
}

export interface NavGroup {
  id: string;
  label?: string;
  items: NavItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export interface AppSidebarProps {
  logo?: React.ReactNode;
  navigation: NavGroup[];
  footer?: React.ReactNode;
  onNavigate?: (item: NavItem) => void;
  className?: string;
  collapsible?: boolean;
  variant?: 'default' | 'floating' | 'inset';
}

export function AppSidebar({
  logo,
  navigation,
  footer,
  onNavigate,
  className,
  collapsible = true,
  variant = 'default',
}: AppSidebarProps) {
  const sidebarVariants = {
    default: '',
    floating: 'm-2 rounded-lg shadow-lg',
    inset: 'm-2',
  };

  return (
    <Sidebar
      collapsible={collapsible ? 'icon' : 'none'}
      className={cn(sidebarVariants[variant], className)}
    >
      {logo && (
        <SidebarHeader>
          <div className="flex items-center px-2 py-1.5">{logo}</div>
        </SidebarHeader>
      )}

      <SidebarContent>
        <ScrollArea className="flex-1">
          {navigation.map((group, groupIndex) => (
            <React.Fragment key={group.id}>
              {groupIndex > 0 && <SidebarSeparator />}
              <SidebarGroup>
                {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <NavMenuItem key={item.id} item={item} onNavigate={onNavigate} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </React.Fragment>
          ))}
        </ScrollArea>
      </SidebarContent>

      {footer && <SidebarFooter>{footer}</SidebarFooter>}
    </Sidebar>
  );
}

function renderNavIcon(icon: LucideIcon | React.ReactNode | undefined) {
  if (!icon) return null;

  if (React.isValidElement(icon)) {
    return icon;
  }

  const Icon = icon as LucideIcon;
  return <Icon className="h-4 w-4" />;
}

function NavMenuItem({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: (item: NavItem) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (!hasChildren && !item.disabled) {
      onNavigate?.(item);
      item.onClick?.();
    }
  };

  if (hasChildren) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className={cn(
                'w-full',
                item.active && 'bg-accent text-accent-foreground',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
              disabled={item.disabled}
            >
              {renderNavIcon(item.icon)}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant={item.badgeVariant || 'secondary'} className="ml-auto">
                  {item.badge}
                </Badge>
              )}
              <ChevronRight className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-90')} />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children?.map((child) => (
                <SidebarMenuSubItem key={child.id}>
                  {child.href ? (
                    <SidebarMenuSubButton
                      asChild
                      className={cn(
                        child.active && 'bg-accent text-accent-foreground',
                        child.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                      )}
                    >
                      <a
                        href={child.href}
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          if (child.disabled) {
                            e.preventDefault();
                            return;
                          }
                          onNavigate?.(child);
                          child.onClick?.();
                        }}
                        aria-disabled={child.disabled}
                      >
                        {renderNavIcon(child.icon)}
                        <span>{child.label}</span>
                        {child.badge && (
                          <Badge variant={child.badgeVariant || 'secondary'} className="ml-auto">
                            {child.badge}
                          </Badge>
                        )}
                      </a>
                    </SidebarMenuSubButton>
                  ) : (
                    <SidebarMenuSubButton
                      onClick={() => {
                        if (!child.disabled) {
                          onNavigate?.(child);
                          child.onClick?.();
                        }
                      }}
                      className={cn(
                        child.active && 'bg-accent text-accent-foreground',
                        child.disabled && 'opacity-50 cursor-not-allowed'
                      )}
                      disabled={child.disabled}
                    >
                      {renderNavIcon(child.icon)}
                      <span>{child.label}</span>
                      {child.badge && (
                        <Badge variant={child.badgeVariant || 'secondary'} className="ml-auto">
                          {child.badge}
                        </Badge>
                      )}
                    </SidebarMenuSubButton>
                  )}
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      {item.href ? (
        <SidebarMenuButton
          asChild
          className={cn(
            item.active && 'bg-accent text-accent-foreground',
            item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
          )}
        >
          <a
            href={item.href}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              if (item.disabled) {
                e.preventDefault();
                return;
              }
              handleClick();
            }}
            aria-disabled={item.disabled}
          >
            {renderNavIcon(item.icon)}
            <span>{item.label}</span>
            {item.badge && (
              <Badge variant={item.badgeVariant || 'secondary'} className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </a>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          onClick={handleClick}
          className={cn(
            item.active && 'bg-accent text-accent-foreground',
            item.disabled && 'opacity-50 cursor-not-allowed'
          )}
          disabled={item.disabled}
        >
          {renderNavIcon(item.icon)}
          <span>{item.label}</span>
          {item.badge && (
            <Badge variant={item.badgeVariant || 'secondary'} className="ml-auto">
              {item.badge}
            </Badge>
          )}
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
}
