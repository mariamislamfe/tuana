"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { formatCurrency } from "@/lib/utils";

const SERIES_HUE = "#2a78d6";

export function CategoryBarChart({ data }: { data: { category: string; revenue: number }[] }) {
  const height = Math.max(data.length * 42, 120);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 44, left: 4, bottom: 4 }} barCategoryGap={14}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="category"
          axisLine={false}
          tickLine={false}
          width={128}
          tick={{ fill: "var(--color-ink-2)", fontSize: 12.5 }}
        />
        <Tooltip
          cursor={{ fill: "var(--color-surface)" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="rounded-sm border border-line bg-paper-raised px-3 py-2 text-[12.5px] shadow-md">
                <p className="font-medium text-ink">{formatCurrency(Number(payload[0].value))}</p>
              </div>
            );
          }}
        />
        <Bar dataKey="revenue" radius={[0, 4, 4, 0]} maxBarSize={22}>
          {data.map((d) => (
            <Cell key={d.category} fill={SERIES_HUE} />
          ))}
          <LabelList
            dataKey="revenue"
            position="right"
            formatter={(v: React.ReactNode) => formatCurrency(Number(v))}
            style={{ fill: "var(--color-ink-2)", fontSize: 12 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
