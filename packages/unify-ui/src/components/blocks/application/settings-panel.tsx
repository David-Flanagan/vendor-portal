import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  Save,
  RotateCcw,
  History,
  Settings,
  Shield,
  Bell,
  Database,
  Globe,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface SettingField {
  id: string;
  label: string;
  description?: string;
  type:
    | 'text'
    | 'number'
    | 'select'
    | 'switch'
    | 'textarea'
    | 'slider'
    | 'email'
    | 'password'
    | 'url';
  value: any;
  options?: Array<{ label: string; value: string }>;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: (value: any) => string | null;
}

export interface SettingSection {
  id: string;
  title: string;
  description?: string;
  icon?: React.ElementType;
  fields: SettingField[];
}

export interface SettingsTab {
  id: string;
  label: string;
  icon?: React.ElementType;
  sections: SettingSection[];
}

export interface SettingsPanelProps {
  tabs: SettingsTab[];
  onSave?: (values: Record<string, any>) => void | Promise<void>;
  onReset?: () => void;
  onChange?: (fieldId: string, value: any) => void;
  showHistory?: boolean;
  isDirty?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function SettingsPanel({
  tabs,
  onSave,
  onReset,
  onChange,
  showHistory = false,
  isDirty = false,
  isLoading = false,
  className,
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.id);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<Record<string, any>>(() => {
    const initialValues: Record<string, any> = {};
    tabs.forEach((tab) => {
      tab.sections.forEach((section) => {
        section.fields.forEach((field) => {
          initialValues[field.id] = field.value;
        });
      });
    });
    return initialValues;
  });

  const handleFieldChange = (
    fieldId: string,
    value: any,
    validation?: (value: any) => string | null
  ) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));

    // Run validation
    if (validation) {
      const error = validation(value);
      setErrors((prev) => {
        if (error) {
          return { ...prev, [fieldId]: error };
        } else {
          const { [fieldId]: _, ...rest } = prev;
          return rest;
        }
      });
    }

    onChange?.(fieldId, value);
  };

  const handleSave = async () => {
    // Validate all fields
    const newErrors: Record<string, string> = {};
    tabs.forEach((tab) => {
      tab.sections.forEach((section) => {
        section.fields.forEach((field) => {
          if (field.validation) {
            const error = field.validation(values[field.id]);
            if (error) {
              newErrors[field.id] = error;
            }
          }
          if (field.required && !values[field.id]) {
            newErrors[field.id] = 'This field is required';
          }
        });
      });
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSave?.(values);
  };

  const renderField = (field: SettingField) => {
    const error = errors[field.id];
    const value = values[field.id] ?? field.value;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'url':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value, field.validation)}
              placeholder={field.placeholder}
              disabled={field.disabled}
              className={cn(error && 'border-destructive')}
            />
            {field.description && !error && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              value={value}
              onChange={(e) =>
                handleFieldChange(field.id, Number(e.target.value), field.validation)
              }
              placeholder={field.placeholder}
              disabled={field.disabled}
              min={field.min}
              max={field.max}
              step={field.step}
              className={cn(error && 'border-destructive')}
            />
            {field.description && !error && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => handleFieldChange(field.id, val, field.validation)}
              disabled={field.disabled}
            >
              <SelectTrigger className={cn(error && 'border-destructive')}>
                <SelectValue placeholder={field.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.description && !error && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'switch':
        return (
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
            </div>
            <Switch
              id={field.id}
              checked={value}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked, field.validation)}
              disabled={field.disabled}
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value, field.validation)}
              placeholder={field.placeholder}
              disabled={field.disabled}
              className={cn(error && 'border-destructive')}
              rows={4}
            />
            {field.description && !error && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <span className="text-sm text-muted-foreground">{value}</span>
            </div>
            <Slider
              id={field.id}
              value={[value]}
              onValueChange={([val]) => handleFieldChange(field.id, val, field.validation)}
              min={field.min || 0}
              max={field.max || 100}
              step={field.step || 1}
              disabled={field.disabled}
              className="py-4"
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                  {Icon && <Icon className="h-4 w-4" />}
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="flex items-center gap-2">
            {isDirty && (
              <Badge variant="secondary" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Unsaved changes
              </Badge>
            )}
            {showHistory && (
              <Button variant="ghost" size="sm">
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
            )}
            {onReset && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                disabled={!isDirty || isLoading}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
            {onSave && (
              <Button size="sm" onClick={handleSave} disabled={!isDirty || isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-6">
            {tab.sections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <Card key={section.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {SectionIcon && <SectionIcon className="h-5 w-5" />}
                      {section.title}
                    </CardTitle>
                    {section.description && (
                      <CardDescription>{section.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {section.fields.map((field) => (
                      <div key={field.id}>{renderField(field)}</div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>

      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please fix the errors above before saving.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
