"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency, formatDate } from "@/lib/utils";

const SERIES_HUE = "#2a78d6";

export function RevenueChart({ data }: { data: { date: string; revenue: number; orders: number }[] }) {
  const showEveryNth = Math.max(Math.ceil(data.length / 8), 1);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SERIES_HUE} stopOpacity={0.14} />
            <stop offset="100%" stopColor={SERIES_HUE} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--color-line)" strokeDasharray="0" />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--color-ink-3)", fontSize: 11.5 }}
          tickFormatter={(v, i) => (i % showEveryNth === 0 ? formatDate(v, { month: "short", day: "numeric" }) : "")}
          interval={0}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--color-ink-3)", fontSize: 11.5 }}
          tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)}
          width={48}
        />
        <Tooltip
          cursor={{ stroke: "var(--color-line-strong)", strokeWidth: 1 }}
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="rounded-sm border border-line bg-paper-raised px-3 py-2 text-[12.5px] shadow-md">
                <p className="text-ink-3">{formatDate(String(label))}</p>
                <p className="mt-0.5 font-medium text-ink">{formatCurrency(Number(payload[0].value))}</p>
                <p className="text-ink-3">{payload[0].payload.orders} orders</p>
              </div>
            );
          }}
        />
        <Area type="monotone" dataKey="revenue" stroke={SERIES_HUE} strokeWidth={2} fill="url(#revenueFill)" activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--color-paper-raised)" }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
