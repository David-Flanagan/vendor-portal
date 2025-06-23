import * as React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  ReferenceLine,
  Brush,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface AreaChartData {
  name: string;
  [key: string]: any;
}

export interface AreaConfig {
  dataKey: string;
  color?: string;
  name?: string;
  stackId?: string;
  fillOpacity?: number;
  strokeWidth?: number;
  strokeDasharray?: string;
  gradient?: boolean;
  curved?: boolean;
}

export interface AreaChartProps {
  title?: string;
  description?: string;
  data: AreaChartData[];
  areas: AreaConfig[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showBrush?: boolean;
  className?: string;
  xAxisKey?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  formatYAxis?: (value: any) => string;
  formatXAxis?: (value: any) => string;
  formatTooltip?: (value: any) => string;
  stacked?: boolean;
  referenceLines?: Array<{
    y?: number;
    x?: string | number;
    label?: string;
    color?: string;
  }>;
  animate?: boolean;
  connectNulls?: boolean;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  formatTooltip,
}: TooltipProps<any, any> & { formatTooltip?: (value: any) => string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatTooltip ? formatTooltip(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const AreaChart = ({
  title,
  description,
  data,
  areas,
  height = 350,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showBrush = false,
  className,
  xAxisKey = 'name',
  yAxisLabel,
  xAxisLabel,
  formatYAxis,
  formatXAxis,
  formatTooltip,
  stacked = false,
  referenceLines = [],
  animate = true,
  connectNulls = false,
}: AreaChartProps) => {
  const chartId = React.useId();

  return (
    <Card className={cn('w-full', className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <RechartsAreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                {areas.map((area, index) => (
                  <linearGradient
                    key={index}
                    id={`gradient-${chartId}-${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={area.color || `hsl(var(--chart-${index + 1}))`}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={area.color || `hsl(var(--chart-${index + 1}))`}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
              </defs>

              {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}

              <XAxis
                dataKey={xAxisKey}
                tickFormatter={formatXAxis}
                label={
                  xAxisLabel
                    ? { value: xAxisLabel, position: 'insideBottom', offset: -5 }
                    : undefined
                }
                className="text-xs"
              />

              <YAxis
                tickFormatter={formatYAxis}
                label={
                  yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined
                }
                className="text-xs"
              />

              {showTooltip && <Tooltip content={<CustomTooltip formatTooltip={formatTooltip} />} />}

              {showLegend && <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="rect" />}

              {referenceLines.map((refLine, index) => (
                <ReferenceLine
                  key={index}
                  y={refLine.y}
                  x={refLine.x}
                  stroke={refLine.color || 'hsl(var(--destructive))'}
                  strokeDasharray="3 3"
                  label={refLine.label}
                />
              ))}

              {areas.map((area, index) => (
                <Area
                  key={area.dataKey}
                  type={area.curved !== false ? 'monotone' : 'linear'}
                  dataKey={area.dataKey}
                  stackId={stacked ? 'stack' : area.stackId}
                  stroke={area.color || `hsl(var(--chart-${index + 1}))`}
                  strokeWidth={area.strokeWidth || 2}
                  strokeDasharray={area.strokeDasharray}
                  fill={
                    area.gradient !== false
                      ? `url(#gradient-${chartId}-${index})`
                      : area.color || `hsl(var(--chart-${index + 1}))`
                  }
                  fillOpacity={area.gradient !== false ? 1 : area.fillOpacity || 0.6}
                  name={area.name || area.dataKey}
                  animationDuration={animate ? 1000 : 0}
                  connectNulls={connectNulls}
                />
              ))}

              {showBrush && <Brush dataKey={xAxisKey} height={30} stroke="hsl(var(--primary))" />}
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Pre-configured chart variants
export const StackedAreaChart = ({
  data,
  categories,
  ...props
}: Omit<AreaChartProps, 'areas' | 'stacked'> & {
  categories: Array<{ key: string; name: string; color?: string }>;
}) => {
  const areas: AreaConfig[] = categories.map((category, index) => ({
    dataKey: category.key,
    name: category.name,
    color: category.color || `hsl(var(--chart-${index + 1}))`,
    stackId: 'stack',
    gradient: true,
  }));

  return <AreaChart data={data} areas={areas} stacked={true} {...props} />;
};

export const SimpleAreaChart = ({
  data,
  dataKey,
  color = 'hsl(var(--primary))',
  showGradient = true,
  ...props
}: Omit<AreaChartProps, 'areas'> & {
  dataKey: string;
  color?: string;
  showGradient?: boolean;
}) => {
  const areas: AreaConfig[] = [
    {
      dataKey,
      color,
      gradient: showGradient,
    },
  ];

  return <AreaChart data={data} areas={areas} showLegend={false} {...props} />;
};

export const ComparisonAreaChart = ({
  data,
  currentKey,
  previousKey,
  currentLabel = 'Current Period',
  previousLabel = 'Previous Period',
  ...props
}: Omit<AreaChartProps, 'areas'> & {
  currentKey: string;
  previousKey: string;
  currentLabel?: string;
  previousLabel?: string;
}) => {
  const areas: AreaConfig[] = [
    {
      dataKey: currentKey,
      name: currentLabel,
      color: 'hsl(var(--primary))',
      gradient: true,
      fillOpacity: 0.8,
    },
    {
      dataKey: previousKey,
      name: previousLabel,
      color: 'hsl(var(--muted-foreground))',
      gradient: true,
      fillOpacity: 0.3,
      strokeDasharray: '5 5',
    },
  ];

  return <AreaChart data={data} areas={areas} {...props} />;
};
