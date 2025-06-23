import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Home,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Menu,
  ChevronDown,
  Moon,
  Sun,
  Laptop,
  User,
} from 'lucide-react';

export interface DashboardShellProps {
  children: React.ReactNode;
  className?: string;
}

export interface DashboardHeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onSearch?: (query: string) => void;
  notifications?: number;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  showThemeToggle?: boolean;
  theme?: 'light' | 'dark' | 'system';
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
  className?: string;
}

export interface DashboardSidebarProps {
  navigation?: NavigationItem[];
  footer?: React.ReactNode;
  logo?: React.ReactNode;
  onNavigate?: (item: NavigationItem) => void;
  className?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: string | number;
  children?: NavigationItem[];
  active?: boolean;
}

const defaultNavigation: NavigationItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: <Home className="h-4 w-4" />,
    href: '/',
    active: true,
  },
  {
    id: 'users',
    label: 'Users',
    icon: <Users className="h-4 w-4" />,
    href: '/users',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="h-4 w-4" />,
    href: '/settings',
  },
];

export function DashboardShell({ children, className }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <div className={cn('flex h-screen overflow-hidden', className)}>
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto bg-muted/10">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function DashboardHeader({
  user = { name: 'John Doe', email: 'john@example.com' },
  onSearch,
  notifications = 0,
  onNotificationClick,
  onProfileClick,
  onLogout,
  showThemeToggle = true,
  theme = 'system',
  onThemeChange,
  className,
}: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className={cn('border-b bg-background', className)}>
      <div className="flex h-16 items-center gap-4 px-4">
        <SidebarTrigger />

        <div className="flex flex-1 items-center gap-4">
          {onSearch && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </form>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showThemeToggle && onThemeChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {theme === 'light' && <Sun className="h-4 w-4" />}
                  {theme === 'dark' && <Moon className="h-4 w-4" />}
                  {theme === 'system' && <Laptop className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onThemeChange('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onThemeChange('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onThemeChange('system')}>
                  <Laptop className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button variant="ghost" size="icon" className="relative" onClick={onNotificationClick}>
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {notifications > 9 ? '9+' : notifications}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="hidden text-left lg:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onProfileClick}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export function DashboardSidebar({
  navigation = defaultNavigation,
  footer,
  logo,
  onNavigate,
  className,
}: DashboardSidebarProps) {
  return (
    <Sidebar className={className}>
      <SidebarHeader>
        {logo || (
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">U</span>
            </div>
            <span className="font-semibold">Unify UI</span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate?.(item)}
                    isActive={item.active}
                    asChild={!!item.href}
                  >
                    {item.href ? (
                      <a href={item.href}>
                        {item.icon}
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </a>
                    ) : (
                      <>
                        {item.icon}
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {footer && <SidebarFooter>{footer}</SidebarFooter>}
    </Sidebar>
  );
}

// Simplified single component export
export function DashboardLayout({
  children,
  user,
  navigation,
  notifications,
  onSearch,
  onNotificationClick,
  onProfileClick,
  onLogout,
  onNavigate,
  logo,
  footer,
  showThemeToggle,
  theme,
  onThemeChange,
  className,
}: {
  children: React.ReactNode;
  user?: DashboardHeaderProps['user'];
  navigation?: NavigationItem[];
  notifications?: number;
  onSearch?: (query: string) => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  onNavigate?: (item: NavigationItem) => void;
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  showThemeToggle?: boolean;
  theme?: 'light' | 'dark' | 'system';
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
  className?: string;
}) {
  return (
    <SidebarProvider>
      <div className={cn('flex h-screen overflow-hidden', className)}>
        <DashboardSidebar
          navigation={navigation}
          footer={footer}
          logo={logo}
          onNavigate={onNavigate}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader
            user={user}
            onSearch={onSearch}
            notifications={notifications}
            onNotificationClick={onNotificationClick}
            onProfileClick={onProfileClick}
            onLogout={onLogout}
            showThemeToggle={showThemeToggle}
            theme={theme}
            onThemeChange={onThemeChange}
          />
          <main className="flex-1 overflow-y-auto bg-muted/10">
            <ScrollArea className="h-full">{children}</ScrollArea>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
