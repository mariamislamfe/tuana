import { DollarSign, ShoppingBag, Users, TrendingUp, Percent, AlertCircle } from "lucide-react";
import {
  dashboardSummary,
  dashboardDeltas,
  revenueOverTime,
  topProducts,
  salesByCategory,
  orderStatusDistribution,
  recentOrders,
  type DateRangeKey,
} from "@/lib/services/analytics-service";
import { StatCard } from "@/components/admin/stat-card";
import { DateRangeSelect } from "@/components/admin/date-range-select";
import { RevenueChart } from "@/components/admin/charts/revenue-chart";
import { CategoryBarChart } from "@/components/admin/charts/category-bar-chart";
import { OrderStatusBreakdown } from "@/components/admin/order-status-breakdown";
import { TopProductsList } from "@/components/admin/top-products-list";
import { RecentOrdersTable } from "@/components/admin/recent-orders-table";
import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function AdminDashboardPage({ searchParams }: PageProps<"/admin">) {
  const sp = await searchParams;
  const range = (typeof sp.range === "string" ? sp.range : "30d") as DateRangeKey;

  const summary = (await dashboardSummary(range));
  const deltas = (await dashboardDeltas(range));
  const revenue = (await revenueOverTime(range));
  const top = (await topProducts(range, 5));
  const categories = (await salesByCategory(range));
  const statusDist = (await orderStatusDistribution(range));
  const recent = (await recentOrders(6));

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink">Dashboard</h1>
          <p className="mt-0.5 text-[13px] text-ink-3">A snapshot of how the store is performing.</p>
        </div>
        <DateRangeSelect />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Revenue" value={formatCurrency(summary.totalRevenue)} delta={deltas.revenue} icon={DollarSign} />
        <StatCard label="Orders" value={String(summary.ordersCount)} delta={deltas.orders} icon={ShoppingBag} />
        <StatCard label="Avg. Order Value" value={formatCurrency(summary.aov)} icon={TrendingUp} />
        <StatCard label="Est. Profit" value={formatCurrency(summary.estimatedProfit)} icon={DollarSign} />
        <StatCard label="Conversion Rate" value={`${summary.conversionRate}%`} icon={Percent} />
        <StatCard label="New Customers" value={String(summary.newCustomers)} icon={Users} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-md border border-line bg-paper-raised px-4 py-3">
          <p className="text-[11.5px] text-ink-3">Pending Orders</p>
          <p className="mt-1 text-lg font-medium text-ink">{summary.pendingOrders}</p>
        </div>
        <div className="rounded-md border border-line bg-paper-raised px-4 py-3">
          <p className="text-[11.5px] text-ink-3">Failed Orders</p>
          <p className="mt-1 flex items-center gap-1.5 text-lg font-medium text-ink">
            {summary.failedOrders > 0 && <AlertCircle className="h-3.5 w-3.5 text-danger" />}
            {summary.failedOrders}
          </p>
        </div>
        <div className="rounded-md border border-line bg-paper-raised px-4 py-3">
          <p className="text-[11.5px] text-ink-3">Returned Orders</p>
          <p className="mt-1 text-lg font-medium text-ink">{summary.returnedOrders}</p>
        </div>
        <div className="rounded-md border border-line bg-paper-raised px-4 py-3">
          <p className="text-[11.5px] text-ink-3">Active Products</p>
          <p className="mt-1 text-lg font-medium text-ink">{summary.productsCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenue} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusBreakdown data={statusDist} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrdersTable orders={recent} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProductsList data={top} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryBarChart data={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
