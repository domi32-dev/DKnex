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
      className="absolute top-0 z-50 rounded-xl border border-[#1E293B] bg-[#1E293B] p-3 text-xs text-white shadow w-24 space-y-2"
      style={{
        left: `${coordinate.x - 85}px`,
        top: `${coordinate.y - 10}px`,
      }}
    >
      <div className="text-center text-muted-foreground text-sm font-medium">{label}</div>
      <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="font-semibold">{payload[0].value}</span>
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
  const dynamicTrendColor = trendColor || (isNegative ? 'text-red-500' : 'text-green-500');

  return (
    <Card className="w-full px-6 py-5 shadow-sm">
      <div className="flex flex-col justify-between h-full gap-y-4">
        {/* Top label */}
        <p className="text-sm text-muted-foreground">{title}</p>

        {/* Middle row: number + chart */}
        <div className="flex items-center justify-between relative">
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          <div className="w-20 h-12 flex items-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="label" hide />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'transparent' }}
                  wrapperStyle={{ zIndex: 50 }}
                />
                <Bar dataKey="value" fill="var(--kpi-bar)" radius={[4, 4, 0, 0]} barSize={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom trend */}
        <div className={`flex items-center gap-1 text-xs ${dynamicTrendColor}`}>
          {arrowIcon}
          <span className="font-semibold">{trend}</span>
          <span className="text-muted-foreground ml-1">last 7 days</span>
        </div>
      </div>
    </Card>
  );
};

