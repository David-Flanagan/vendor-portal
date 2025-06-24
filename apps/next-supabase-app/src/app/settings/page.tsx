'use client';

import { useAuth } from '@/lib/auth';
import { GeneralSettingsForm } from '@/components/settings/GeneralSettingsForm';
import { CompanyBrandingForm } from '@/components/settings/CompanyBrandingForm';
import { UsageLimitsDisplay } from '@/components/settings/UsageLimitsDisplay';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@beach-box/unify-ui';
import { Settings, Palette, BarChart3, Shield, Key, FileText } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { currentCompany, hasRole } = useAuth();

  if (!hasRole(['owner', 'admin'])) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Access Denied</h2>
        <p className="mt-2 text-gray-600">
          You need owner or admin permissions to access company settings.
        </p>
      </div>
    );
  }

  if (!currentCompany) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Settings className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">No Company Selected</h2>
        <p className="mt-2 text-gray-600">
          Please select a company to manage its settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
        <p className="text-gray-600">
          Manage your company's general settings, branding, and configuration
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Branding</span>
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Usage</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span>API</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Audit</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Update your company's basic information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GeneralSettingsForm company={currentCompany} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding & Appearance</CardTitle>
              <CardDescription>
                Customize your company's visual identity and branding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyBrandingForm company={currentCompany} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Usage & Limits</CardTitle>
              <CardDescription>
                Monitor your current usage and subscription limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsageLimitsDisplay company={currentCompany} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security policies and authentication requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Coming Soon</h3>
                <p className="mt-2 text-gray-600">
                  Advanced security settings will be available in a future update.
                </p>
                <Link
                  href="/settings/security"
                  className="mt-4 inline-block text-blue-600 hover:text-blue-500"
                >
                  Learn more about security features →
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Management</CardTitle>
              <CardDescription>
                Manage API keys and integrations for your company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Key className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Coming Soon</h3>
                <p className="mt-2 text-gray-600">
                  API management features will be available in a future update.
                </p>
                <Link
                  href="/settings/api"
                  className="mt-4 inline-block text-blue-600 hover:text-blue-500"
                >
                  Learn more about API features →
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>
                View security events and activity logs for your company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Coming Soon</h3>
                <p className="mt-2 text-gray-600">
                  Audit log features will be available in a future update.
                </p>
                <Link
                  href="/settings/audit"
                  className="mt-4 inline-block text-blue-600 hover:text-blue-500"
                >
                  Learn more about audit features →
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}