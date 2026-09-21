import type { Metadata } from "next";
import { DollarSign, TrendingUp, Percent, RotateCcw, UserPlus, Repeat } from "lucide-react";
import {
  dashboardSummary,
  dashboardDeltas,
  revenueOverTime,
  topProducts,
  salesByCategory,
  refundsSummary,
  customerAcquisition,
  type DateRangeKey,
} from "@/lib/services/analytics-service";
import { StatCard } from "@/components/admin/stat-card";
import { DateRangeSelect } from "@/components/admin/date-range-select";
import { RevenueChart } from "@/components/admin/charts/revenue-chart";
import { CategoryBarChart } from "@/components/admin/charts/category-bar-chart";
import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Analytics — Admin" };

export default async function AdminAnalyticsPage({ searchParams }: PageProps<"/admin/analytics">) {
  const sp = await searchParams;
  const range = (typeof sp.range === "string" ? sp.range : "30d") as DateRangeKey;

  const summary = (await dashboardSummary(range));
  const deltas = (await dashboardDeltas(range));
  const revenue = (await revenueOverTime(range));
  const top = (await topProducts(range, 10));
  const categories = (await salesByCategory(range));
  const refunds = (await refundsSummary(range));
  const acquisition = (await customerAcquisition(range));

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink">Analytics</h1>
          <p className="mt-0.5 text-[13px] text-ink-3">Deeper performance metrics for decision-making.</p>
        </div>
        <DateRangeSelect />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Revenue" value={formatCurrency(summary.totalRevenue)} delta={deltas.revenue} icon={DollarSign} />
        <StatCard label="Avg. Order Value" value={formatCurrency(summary.aov)} icon={TrendingUp} />
        <StatCard label="Conversion Rate" value={`${summary.conversionRate}%`} icon={Percent} />
        <StatCard label="Est. Profit" value={formatCurrency(summary.estimatedProfit)} icon={DollarSign} />
        <StatCard label="Refunds" value={formatCurrency(refunds.total)} icon={RotateCcw} />
        <StatCard label="Returning Rate" value={`${acquisition.returningRate}%`} icon={Repeat} />
      </div>

      <Card>
        <CardHeader><CardTitle>Revenue Over Time</CardTitle></CardHeader>
        <CardContent><RevenueChart data={revenue} /></CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Category Performance</CardTitle></CardHeader>
          <CardContent><CategoryBarChart data={categories} /></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Customer Acquisition</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <UserPlus className="h-4 w-4 text-ink-3" />
                <div className="flex-1">
                  <div className="flex justify-between text-[13px]"><span className="text-ink-2">New customer orders</span><span className="font-medium text-ink">{acquisition.newCustomerOrders}</span></div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface">
                    <div className="h-full bg-ink" style={{ width: `${100 - acquisition.returningRate}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Repeat className="h-4 w-4 text-ink-3" />
                <div className="flex-1">
                  <div className="flex justify-between text-[13px]"><span className="text-ink-2">Returning customer orders</span><span className="font-medium text-ink">{acquisition.returningCustomerOrders}</span></div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface">
                    <div className="h-full bg-ink/50" style={{ width: `${acquisition.returningRate}%` }} />
                  </div>
                </div>
              </div>
              <p className="text-[12.5px] text-ink-3">{acquisition.returningRate}% of orders this period came from returning customers.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Product Performance</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[560px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wider text-ink-3">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Units Sold</th>
                  <th className="px-5 py-3 font-medium">Revenue</th>
                  <th className="px-5 py-3 font-medium">Avg. Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {top.map((p) => (
                  <tr key={p.productId}>
                    <td className="px-5 py-3 text-ink">{p.title}</td>
                    <td className="px-5 py-3 text-ink-2">{p.units}</td>
                    <td className="px-5 py-3 font-medium text-ink">{formatCurrency(p.revenue)}</td>
                    <td className="px-5 py-3 text-ink-2">{formatCurrency(p.revenue / p.units)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
