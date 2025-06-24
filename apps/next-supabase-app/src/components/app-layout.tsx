'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import {
  AppShell,
  AppSidebar,
  AppNavbar,
  AppContent,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ThemeToggle,
} from '@beach-box/unify-ui';
import {
  Building2,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  Shield,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Plus,
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const {
    user,
    profile,
    currentCompany,
    companies,
    membership,
    switchCompany,
    signOut,
    isSystemAdmin,
    hasRole,
  } = useAuth();
  const router = useRouter();

  // Navigation items based on user role
  const getNavigationItems = () => {
    const items = [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: BarChart3,
      },
      {
        title: 'Team',
        href: '/team',
        icon: Users,
        badge: currentCompany?.current_user_count || 0,
      },
    ];

    // Add billing for owners and admins
    if (hasRole(['owner', 'admin'])) {
      items.push({
        title: 'Billing',
        href: '/billing',
        icon: CreditCard,
        badge: currentCompany?.subscription_status === 'trial' ? 'Trial' : undefined,
      });
    }

    // Add settings for owners and admins
    if (hasRole(['owner', 'admin'])) {
      items.push({
        title: 'Settings',
        href: '/settings',
        icon: Settings,
      });
    }

    // Add system admin panel
    if (isSystemAdmin) {
      items.push({
        title: 'Admin Panel',
        href: '/admin',
        icon: Shield,
        badge: 'Admin',
      });
    }

    return items;
  };

  const handleCompanySwitch = (companyId: string) => {
    switchCompany(companyId);
  };

  const handleCreateCompany = () => {
    router.push('/companies/new');
  };

  const userInitials = profile
    ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <AppShell>
      {/* Top Navigation Bar */}
      <AppNavbar className="border-b">
        <div className="flex items-center justify-between w-full px-6">
          {/* Company Selector */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">SaaS Starter</span>
            </div>

            {currentCompany && (
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">|</span>
                <Select value={currentCompany.id} onValueChange={handleCompanySwitch}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {currentCompany.name[0]?.toUpperCase()}
                          </span>
                        </div>
                        <span className="truncate">{currentCompany.name}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {company.name[0]?.toUpperCase()}
                            </span>
                          </div>
                          <span>{company.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {company.membership.role}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                    <DropdownMenuSeparator />
                    <div className="p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleCreateCompany}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Company
                      </Button>
                    </div>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Trial Badge */}
            {currentCompany?.subscription_status === 'trial' && (
              <Badge variant="secondary">
                Trial - {currentCompany.trial_ends_at ?
                  Math.max(0, Math.ceil((new Date(currentCompany.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                  : 0} days left
              </Badge>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ''} alt={profile?.first_name || user?.email || ''} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.first_name && profile?.last_name
                        ? `${profile.first_name} ${profile.last_name}`
                        : user?.email
                      }
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </AppNavbar>

      {/* Sidebar Navigation */}
      <AppSidebar>
        <div className="flex flex-col h-full">
          <div className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {getNavigationItems().map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push(item.href)}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  <span className="flex-1 text-left">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </nav>
          </div>

          {/* Company Info Footer */}
          {currentCompany && (
            <div className="border-t p-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {currentCompany.name[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{currentCompany.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {membership?.role} • {currentCompany.subscription_tier}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </AppSidebar>

      {/* Main Content */}
      <AppContent>
        {children}
      </AppContent>
    </AppShell>
  );
}