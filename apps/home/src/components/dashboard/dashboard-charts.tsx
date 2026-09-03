"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ─── 1. Responsive SVG Bar Chart (Signups & Daily Activity) ─────────────────
export type BarChartDataPoint = {
  label: string;
  value: number;
  secondaryValue?: number;
};

interface BarChartProps {
  data: BarChartDataPoint[];
  height?: number;
  className?: string;
  barColor?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  emptyText?: string;
}

export function SvgBarChart({
  data,
  height = 180,
  className,
  barColor = "#4f46e5", // Electric indigo
  valuePrefix = "",
  valueSuffix = "",
  emptyText = "No data recorded yet",
}: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-xs text-slate-400 font-medium",
          className,
        )}
        style={{ height }}
      >
        {emptyText}
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const chartHeight = height - 36; // leave room for labels

  return (
    <div className={cn("w-full flex flex-col justify-end", className)}>
      <div
        className="flex items-end gap-2 sm:gap-3 w-full justify-between"
        style={{ height: chartHeight }}
      >
        {data.map((item, idx) => {
          const barHeightPct = Math.max(
            (item.value / maxValue) * 100,
            item.value > 0 ? 8 : 2,
          );

          return (
            <div
              key={`${item.label}-${idx}`}
              className="group relative flex-1 flex flex-col items-center justify-end h-full"
            >
              {/* Tooltip */}
              <div className="absolute -top-9 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-10 bg-slate-900 text-white text-[11px] font-semibold py-1 px-2 rounded-md shadow-md whitespace-nowrap">
                {valuePrefix}
                {item.value.toLocaleString()}
                {valueSuffix}
              </div>

              {/* Bar */}
              <div
                className="w-full max-w-[36px] rounded-t-lg transition-all duration-300 hover:brightness-110 cursor-pointer shadow-xs"
                style={{
                  height: `${barHeightPct}%`,
                  backgroundColor: barColor,
                  opacity: item.value > 0 ? 0.9 : 0.25,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* X Axis Labels */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[10px] sm:text-xs font-semibold text-slate-400 select-none">
        {data.map((item, idx) => (
          <span
            key={`lbl-${item.label}-${idx}`}
            className="flex-1 text-center truncate"
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── 2. Responsive SVG Area Curve Chart (Revenue & Momentum) ────────────────
export type AreaChartDataPoint = {
  label: string;
  value: number;
};

interface AreaChartProps {
  data: AreaChartDataPoint[];
  height?: number;
  className?: string;
  strokeColor?: string;
  fillGradientStart?: string;
  fillGradientEnd?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  emptyText?: string;
}

export function SvgAreaChart({
  data,
  height = 180,
  className,
  strokeColor = "#4f46e5",
  fillGradientStart = "rgba(79, 70, 229, 0.28)",
  fillGradientEnd = "rgba(79, 70, 229, 0.01)",
  valuePrefix = "",
  valueSuffix = "",
  emptyText = "No revenue recorded yet",
}: AreaChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-xs text-slate-400 font-medium",
          className,
        )}
        style={{ height }}
      >
        {emptyText}
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue || 1;

  const width = 600;
  const paddingY = 16;
  const chartHeight = height - 36;

  // Calculate SVG coordinates
  const points = data.map((d, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * width;
    const y =
      chartHeight -
      ((d.value - minValue) / range) * (chartHeight - paddingY * 2) -
      paddingY;
    return { x, y, ...d };
  });

  // Construct smooth SVG path using Catmull-Rom or cubic Bezier
  const linePath = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (point.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (point.x - prev.x) / 2;
    const cpY2 = point.y;
    return `${acc} C ${cpX1},${cpY1} ${cpX2},${cpY2} ${point.x},${point.y}`;
  }, "");

  const areaPath = `${linePath} L ${width},${chartHeight} L 0,${chartHeight} Z`;

  return (
    <div className={cn("w-full flex flex-col", className)}>
      <div className="relative w-full" style={{ height: chartHeight }}>
        <svg
          viewBox={`0 0 ${width} ${chartHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="revenueAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillGradientStart} />
              <stop offset="100%" stopColor={fillGradientEnd} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1="0"
            y1={chartHeight / 3}
            x2={width}
            y2={chartHeight / 3}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
          />
          <line
            x1="0"
            y1={(chartHeight * 2) / 3}
            x2={width}
            y2={(chartHeight * 2) / 3}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
          />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#revenueAreaGradient)" />

          {/* Line Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((p, idx) => (
            <circle
              key={`dot-${idx}`}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#ffffff"
              stroke={strokeColor}
              strokeWidth="2"
              className="transition-all hover:r-6 cursor-pointer"
            >
              <title>
                {p.label}: {valuePrefix}
                {p.value.toLocaleString()}
                {valueSuffix}
              </title>
            </circle>
          ))}
        </svg>
      </div>

      {/* X Axis Labels */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[10px] sm:text-xs font-semibold text-slate-400 select-none">
        {data.map((item, idx) => (
          <span
            key={`arealbl-${item.label}-${idx}`}
            className="flex-1 text-center truncate"
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── 3. Category Breakdown Distribution (Retail, Wholesale, Services) ───────
export type CategoryItem = {
  label: string;
  count: number;
  color?: string;
};

interface CategoryBreakdownProps {
  categories: CategoryItem[];
  className?: string;
}

const DEFAULT_CATEGORY_COLORS = [
  "#4f46e5", // Electric Indigo
  "#10b981", // Emerald
  "#0284c7", // Sky blue
  "#f59e0b", // Amber
  "#8b5cf6", // Violet
  "#ec4899", // Pink
];

export function CategoryBreakdown({
  categories,
  className,
}: CategoryBreakdownProps) {
  const totalCount = categories.reduce((acc, c) => acc + c.count, 0);

  if (!categories || categories.length === 0 || totalCount === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        No business category data available yet.
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress Bar Ribbon */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 gap-0.5">
        {categories.map((cat, idx) => {
          const pct = Math.max((cat.count / totalCount) * 100, 2);
          const color =
            cat.color ||
            DEFAULT_CATEGORY_COLORS[idx % DEFAULT_CATEGORY_COLORS.length];
          return (
            <div
              key={cat.label}
              className="h-full rounded-full transition-all duration-300 first:rounded-l-full last:rounded-r-full"
              style={{ width: `${pct}%`, backgroundColor: color }}
              title={`${cat.label}: ${cat.count} (${pct.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      {/* Legend & Breakdown List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
        {categories.map((cat, idx) => {
          const pct = ((cat.count / totalCount) * 100).toFixed(1);
          const color =
            cat.color ||
            DEFAULT_CATEGORY_COLORS[idx % DEFAULT_CATEGORY_COLORS.length];

          return (
            <div
              key={cat.label}
              className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-slate-100/60 transition-colors"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {cat.label}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {cat.count.toLocaleString()} ({pct}%)
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 4. Tool Adoption Comparative Progress Meter ───────────────────────────
export type ToolUsageItem = {
  toolKey: string;
  name: string;
  events: number;
  subscriptions: number;
  color?: string;
};

interface ToolAdoptionMeterProps {
  tools: ToolUsageItem[];
  className?: string;
}

export function ToolAdoptionMeter({ tools, className }: ToolAdoptionMeterProps) {
  if (!tools || tools.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        No tool adoption data recorded yet.
      </div>
    );
  }

  const maxEvents = Math.max(...tools.map((t) => t.events), 1);

  return (
    <div className={cn("space-y-4", className)}>
      {tools.map((tool, idx) => {
        const pct = Math.min(Math.round((tool.events / maxEvents) * 100), 100);
        const color =
          tool.color ||
          DEFAULT_CATEGORY_COLORS[idx % DEFAULT_CATEGORY_COLORS.length];

        return (
          <div key={tool.toolKey} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 uppercase tracking-wider">
                {tool.name || tool.toolKey}
              </span>
              <span className="text-slate-500 font-medium">
                {tool.events.toLocaleString()} events ·{" "}
                <span className="text-indigo-600 font-semibold">
                  {tool.subscriptions} active
                </span>
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(pct, 4)}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
