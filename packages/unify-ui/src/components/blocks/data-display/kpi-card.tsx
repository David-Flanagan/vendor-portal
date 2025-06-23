import * as React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

export interface KPIData {
  value: number;
  label?: string;
}

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  description?: string;
  data?: KPIData[];
  dataKey?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  comparison?: {
    value: string | number;
    label: string;
  };
  icon?: LucideIcon;
  chartType?: 'line' | 'area' | 'bar';
  chartColor?: string;
  chartHeight?: number;
  showChart?: boolean;
  className?: string;
  format?: (value: any) => string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  };
}

const SparklineChart = ({
  data,
  dataKey = 'value',
  type = 'line',
  color = 'hsl(var(--primary))',
  height = 50,
}: {
  data: KPIData[];
  dataKey?: string;
  type?: 'line' | 'area' | 'bar';
  color?: string;
  height?: number;
}) => {
  const chartId = React.useId();

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${chartId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${chartId})`}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <YAxis hide />
          <Bar dataKey={dataKey} fill={color} animationDuration={1000} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <YAxis hide />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
          animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const KPICard = ({
  title,
  value,
  subtitle,
  description,
  data = [],
  dataKey = 'value',
  trend,
  comparison,
  icon: Icon,
  chartType = 'line',
  chartColor = 'hsl(var(--primary))',
  chartHeight = 50,
  showChart = true,
  className,
  format,
  badge,
}: KPICardProps) => {
  const formattedValue = format ? format(value) : value;

  const TrendIcon = trend?.isPositive ? TrendingUp : TrendingDown;
  const trendColor = trend?.isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      {badge && (
        <div className="absolute top-4 right-4">
          <Badge variant={badge.variant || 'secondary'} className="text-xs">
            {badge.text}
          </Badge>
        </div>
      )}

      <CardHeader className={cn('pb-2', badge && 'pr-20')}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-1">
          <div className="flex items-baseline space-x-3">
            <div className="text-2xl font-bold">{formattedValue}</div>
            {trend && (
              <div className={cn('flex items-center text-sm', trendColor)}>
                <TrendIcon className="h-3 w-3 mr-1" />
                <span className="font-medium">
                  {trend.value > 0 ? '+' : ''}
                  {trend.value}%
                </span>
                {trend.label && <span className="text-muted-foreground ml-1">{trend.label}</span>}
              </div>
            )}
          </div>

          {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}

          {comparison && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">{comparison.value}</span> {comparison.label}
            </div>
          )}

          {description && <CardDescription className="text-xs mt-1">{description}</CardDescription>}
        </div>

        {showChart && data.length > 0 && (
          <div className="mt-3">
            <SparklineChart
              data={data}
              dataKey={dataKey}
              type={chartType}
              color={chartColor}
              height={chartHeight}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Pre-configured variants
export const MetricCard = ({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  ...props
}: Omit<KPICardProps, 'trend'> & {
  change: number;
  changeLabel?: string;
}) => {
  return (
    <KPICard
      title={title}
      value={value}
      trend={{
        value: change,
        isPositive: change >= 0,
        label: changeLabel,
      }}
      showChart={false}
      {...props}
    />
  );
};

export const SparklineCard = ({
  title,
  value,
  data,
  sparklineColor,
  sparklineType = 'area',
  ...props
}: Omit<KPICardProps, 'chartType' | 'chartColor' | 'showChart'> & {
  sparklineColor?: string;
  sparklineType?: 'line' | 'area' | 'bar';
}) => {
  return (
    <KPICard
      title={title}
      value={value}
      data={data}
      chartType={sparklineType}
      chartColor={sparklineColor}
      showChart={true}
      {...props}
    />
  );
};

export const ComparisonCard = ({
  title,
  currentValue,
  previousValue,
  previousLabel = 'Previous period',
  format,
  ...props
}: Omit<KPICardProps, 'value' | 'comparison'> & {
  currentValue: string | number;
  previousValue: string | number;
  previousLabel?: string;
  format?: (value: any) => string;
}) => {
  const current =
    typeof currentValue === 'number' ? currentValue : parseFloat(currentValue as string);
  const previous =
    typeof previousValue === 'number' ? previousValue : parseFloat(previousValue as string);
  const change = previous !== 0 ? ((current - previous) / previous) * 100 : 0;

  return (
    <KPICard
      title={title}
      value={currentValue}
      trend={{
        value: Math.round(change),
        isPositive: change >= 0,
      }}
      comparison={{
        value: format ? format(previousValue) : previousValue,
        label: previousLabel,
      }}
      format={format}
      {...props}
    />
  );
};
