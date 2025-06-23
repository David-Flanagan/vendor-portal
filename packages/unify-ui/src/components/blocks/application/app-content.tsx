import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export interface AppBreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface AppContentProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: AppBreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function AppContent({
  children,
  title,
  description,
  breadcrumbs,
  actions,
  className,
  contentClassName,
  maxWidth = '2xl',
  padding = 'md',
}: AppContentProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  return (
    <div className={cn('flex-1', className)}>
      {/* Page Header */}
      {(breadcrumbs || title || description || actions) && (
        <div className={cn('border-b bg-background', paddingClasses[padding])}>
          <div className={cn('mx-auto', maxWidthClasses[maxWidth])}>
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumb className="mb-4">
                <BreadcrumbList>
                  {breadcrumbs.map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {index === breadcrumbs.length - 1 ? (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        ) : item.href ? (
                          <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                        ) : (
                          <BreadcrumbLink onClick={item.onClick} className="cursor-pointer">
                            {item.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}

            {/* Title, Description & Actions */}
            {(title || description || actions) && (
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  {title && (
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
                  )}
                  {description && <p className="text-muted-foreground">{description}</p>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={cn(paddingClasses[padding], contentClassName)}>
        <div className={cn('mx-auto', maxWidthClasses[maxWidth])}>{children}</div>
      </div>
    </div>
  );
}

// Convenience component for page headers
export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: AppBreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : item.href ? (
                    <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbLink onClick={item.onClick} className="cursor-pointer">
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
