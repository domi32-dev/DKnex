'use client';

import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, Tooltip, ResponsiveContainer, XAxis } from 'recharts';

type KPIProps = {
  title: string;
  value: string;
  trend: string;
  trendColor?: string;
  chartData?: { label?: string; value: number }[]; // includes label for tooltip
  isNegative?: boolean;
};

const CustomTooltip = ({
  active,
  payload,
  label,
  coordinate,
}: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  label?: string;
  coordinate?: { x: number; y: number };
}) => {
  if (!active || !payload || !payload.length || !coordinate) return null;

  return (
    <div
      className="absolute top-0 z-50 rounded-lg border bg-card p-2 text-xs shadow-lg w-24"
      style={{
        left: `${coordinate.x - 85}px`,
        top: `${coordinate.y - 10}px`,
      }}
    >
      <div className="text-center text-muted-foreground text-sm">{label}</div>
      <div className="flex items-center justify-center gap-2 mt-1">
        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span className="font-medium text-foreground">{payload[0].value}</span>
      </div>
    </div>
  );
};

export const KPI = ({
  title,
  value,
  trend,
  trendColor,
  chartData = [],
  isNegative = false,
}: KPIProps) => {
  const arrowIcon = isNegative ? (
    <ArrowDownRight className="w-4 h-4" />
  ) : (
    <ArrowUpRight className="w-4 h-4" />
  );
  const dynamicTrendColor = trendColor || (isNegative ? 'text-destructive' : 'text-accent');

  return (
    <Card className="w-full px-6 py-5 shadow-sm hover:shadow-md transition-all rounded-2xl">
      <div className="flex flex-col justify-between h-full gap-y-4">
        {/* Top label */}
        <p className="text-sm text-muted-foreground">{title}</p>

        {/* Middle row: number + chart */}
        <div className="flex items-center justify-between relative">
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          <div className="w-24 h-12 flex items-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="label" hide />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'transparent' }}
                  wrapperStyle={{ zIndex: 50 }}
                />
                <Bar 
                  dataKey="value" 
                  fill="var(--accent)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={4}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom trend */}
        <div className={`flex items-center gap-1 text-xs ${dynamicTrendColor}`}>
          {arrowIcon}
          <span className="font-medium">{trend}</span>
          <span className="text-muted-foreground ml-1">last 7 days</span>
        </div>
      </div>
    </Card>
  );
};

