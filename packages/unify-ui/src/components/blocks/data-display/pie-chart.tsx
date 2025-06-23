import * as React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  Label,
  LabelList,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  title?: string;
  description?: string;
  data: PieChartData[];
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  cornerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  colors?: string[];
  labelType?: 'value' | 'percent' | 'name' | 'custom';
  labelPosition?: 'inside' | 'outside' | 'center';
  formatLabel?: (value: any, entry: any) => string;
  formatTooltip?: (value: any) => string;
  centerLabel?: {
    value: string;
    subtitle?: string;
  };
  animate?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  value,
  name,
  labelType,
  formatLabel,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  let label = value;
  if (labelType === 'percent') {
    label = `${(percent * 100).toFixed(0)}%`;
  } else if (labelType === 'name') {
    label = name;
  } else if (formatLabel) {
    label = formatLabel(value, { name, percent });
  }

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="fill-white text-xs font-medium"
    >
      {label}
    </text>
  );
};

const CustomTooltip = ({
  active,
  payload,
  formatTooltip,
}: TooltipProps<any, any> & { formatTooltip?: (value: any) => string }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <p className="text-sm font-medium">{data.name}</p>
        <p className="text-sm" style={{ color: data.payload.fill }}>
          Value: {formatTooltip ? formatTooltip(data.value) : data.value}
        </p>
        <p className="text-xs text-muted-foreground">
          {((data.payload?.percent || 0) * 100).toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

export const PieChart = ({
  title,
  description,
  data,
  height = 350,
  showLegend = true,
  showTooltip = true,
  className,
  innerRadius = 0,
  outerRadius = 80,
  paddingAngle = 0,
  cornerRadius = 0,
  startAngle = 90,
  endAngle = -270,
  colors,
  labelType = 'percent',
  labelPosition = 'inside',
  formatLabel,
  formatTooltip,
  centerLabel,
  animate = true,
  legendPosition = 'bottom',
}: PieChartProps) => {
  const defaultColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  const chartColors = colors || defaultColors;

  const processedData = data.map((item, index) => ({
    ...item,
    fill: item.color || chartColors[index % chartColors.length],
  }));

  const renderCenterLabel = (props: any) => {
    if (!centerLabel) return null;

    return (
      <text x={props.cx} y={props.cy} textAnchor="middle" dominantBaseline="middle">
        <tspan x={props.cx} dy="-0.1em" className="text-2xl font-bold fill-foreground">
          {centerLabel.value}
        </tspan>
        {centerLabel.subtitle && (
          <tspan x={props.cx} dy="1.4em" className="text-sm fill-muted-foreground">
            {centerLabel.subtitle}
          </tspan>
        )}
      </text>
    );
  };

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
            <RechartsPieChart>
              {showTooltip && <Tooltip content={<CustomTooltip formatTooltip={formatTooltip} />} />}

              {showLegend && (
                <Legend
                  verticalAlign={
                    legendPosition === 'top' || legendPosition === 'bottom'
                      ? legendPosition
                      : 'middle'
                  }
                  align={
                    legendPosition === 'left' || legendPosition === 'right'
                      ? legendPosition
                      : 'center'
                  }
                  wrapperStyle={{
                    paddingTop: legendPosition === 'bottom' ? '20px' : '0',
                    paddingBottom: legendPosition === 'top' ? '20px' : '0',
                  }}
                  iconType="circle"
                />
              )}

              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={
                  labelPosition === 'inside'
                    ? (props: any) => renderCustomizedLabel({ ...props, labelType, formatLabel })
                    : false
                }
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                paddingAngle={paddingAngle}
                cornerRadius={cornerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill="#8884d8"
                animationDuration={animate ? 1000 : 0}
                dataKey="value"
              >
                {labelPosition === 'outside' && (
                  <LabelList
                    dataKey="value"
                    position="outside"
                    formatter={(value: any, props?: any) => {
                      // Recharts passes the props differently, so we need to extract the data safely
                      const entry = props?.payload || props;
                      const percent = entry?.percent || 0;
                      const name = entry?.name || '';

                      if (labelType === 'percent' && percent !== undefined) {
                        return `${(percent * 100).toFixed(0)}%`;
                      } else if (labelType === 'name' && name) {
                        return name;
                      } else if (formatLabel && entry) {
                        return formatLabel(value, entry);
                      }
                      return value;
                    }}
                    className="fill-foreground text-xs"
                  />
                )}

                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}

                {centerLabel && innerRadius > 0 && (
                  <Label content={renderCenterLabel} position="center" />
                )}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Pre-configured chart variants
export const DonutChart = ({
  centerValue,
  centerSubtitle,
  ...props
}: PieChartProps & {
  centerValue?: string;
  centerSubtitle?: string;
}) => {
  return (
    <PieChart
      {...props}
      innerRadius={60}
      outerRadius={80}
      centerLabel={centerValue ? { value: centerValue, subtitle: centerSubtitle } : undefined}
    />
  );
};

export const HalfDonutChart = ({
  centerValue,
  centerSubtitle,
  ...props
}: PieChartProps & {
  centerValue?: string;
  centerSubtitle?: string;
}) => {
  return (
    <PieChart
      {...props}
      innerRadius={60}
      outerRadius={80}
      startAngle={180}
      endAngle={0}
      centerLabel={centerValue ? { value: centerValue, subtitle: centerSubtitle } : undefined}
    />
  );
};

export const SimplePieChart = (props: PieChartProps) => {
  return (
    <PieChart
      {...props}
      showLegend={true}
      labelPosition="outside"
      paddingAngle={2}
      cornerRadius={4}
    />
  );
};
