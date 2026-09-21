import Link from "next/link";
import Image from "next/image";
import { LogOut, Package, MapPin, User as UserIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ordersForEmail } from "@/lib/services/orders-service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { logoutCustomerAction } from "./actions";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default async function AccountPage() {
  const session = await getCurrentUser("customer");
  const orders = session ? await ordersForEmail(session.email) : [];
  const paid = orders.filter((o) => o.status !== "failed" && o.status !== "cancelled");
  const totalSpent = Math.round(paid.reduce((sum, o) => sum + o.total, 0) * 100) / 100;
  const customer = orders.length
    ? {
        ordersCount: paid.length,
        totalSpent,
        averageOrderValue: paid.length ? Math.round((totalSpent / paid.length) * 100) / 100 : 0,
        addresses: orders
          .map((o) => o.shippingAddress)
          .filter((a, i, all) => all.findIndex((b) => b.line1 === a.line1 && b.city === a.city) === i),
      }
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Hi, {session?.name.split(" ")[0]}</h1>
          <p className="mt-1 text-[13.5px] text-ink-3">{session?.email}</p>
        </div>
        <form action={logoutCustomerAction}>
          <Button type="submit" variant="ghost" size="sm" className="gap-2">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </Button>
        </form>
      </div>

      {customer && (
        <div className="mb-8 grid grid-cols-3 divide-x divide-line rounded-md border border-line bg-paper-raised">
          <div className="px-5 py-4">
            <p className="text-[11px] uppercase tracking-wider text-ink-3">Orders</p>
            <p className="mt-1 text-xl font-medium text-ink">{customer.ordersCount}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-[11px] uppercase tracking-wider text-ink-3">Total Spent</p>
            <p className="mt-1 text-xl font-medium text-ink">{formatCurrency(customer.totalSpent)}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-[11px] uppercase tracking-wider text-ink-3">Avg. Order</p>
            <p className="mt-1 text-xl font-medium text-ink">{formatCurrency(customer.averageOrderValue)}</p>
          </div>
        </div>
      )}

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="pt-6">
          {orders.length === 0 ? (
            <EmptyState icon={Package} title="No orders yet" description="Your order history will show up here." action={<Button asChild className="mt-2"><Link href="/shop">Start Shopping</Link></Button>} />
          ) : (
            <div className="flex flex-col divide-y divide-line">
              {orders.map((order) => (
                <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-xs bg-surface">
                      <Image src={order.items[0].image} alt="" fill sizes="48px" className="object-cover" />
                    </div>
                    <div>
                      <p className="text-[13.5px] font-medium text-ink">{order.number}</p>
                      <p className="text-[12.5px] text-ink-3">{formatDate(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <OrderStatusBadge status={order.status} />
                    <p className="w-16 text-right text-[13.5px] font-medium text-ink">{formatCurrency(order.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="addresses" className="pt-6">
          {customer && customer.addresses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {customer.addresses.map((addr, i) => (
                <div key={i} className="rounded-md border border-line bg-paper-raised p-4">
                  <p className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
                    <MapPin className="h-3.5 w-3.5 text-ink-3" /> {addr.fullName}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
                    {addr.line1}
                    {addr.line2 && <>, {addr.line2}</>}
                    <br />
                    {addr.city}, {addr.country} {addr.postalCode}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={MapPin} title="No saved addresses" />
          )}
        </TabsContent>

        <TabsContent value="profile" className="pt-6">
          <div className="max-w-sm rounded-md border border-line bg-paper-raised p-5">
            <p className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
              <UserIcon className="h-3.5 w-3.5 text-ink-3" /> Account details
            </p>
            <div className="mt-3 flex flex-col gap-2 text-[13.5px] text-ink-2">
              <p>Name: {session?.name}</p>
              <p>Email: {session?.email}</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
