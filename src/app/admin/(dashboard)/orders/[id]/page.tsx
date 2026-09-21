import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, CreditCard, Truck } from "lucide-react";
import { getOrder } from "@/lib/services/orders-service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatusBadge, PaymentStatusBadge, FulfillmentStatusBadge, SupplierStatusBadge } from "@/components/admin/order-status-badge";
import { OrderTimeline } from "@/components/admin/order-timeline";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

export default async function AdminOrderDetailPage({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const order = (await getOrder(id));
  if (!order) notFound();

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <Link href="/admin/orders" className="flex items-center gap-1.5 text-[13px] text-ink-3 hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl text-ink">{order.number}</h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-[13px] text-ink-3">Placed {formatDate(order.createdAt)}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col divide-y divide-line px-5">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3.5 py-4">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xs bg-surface">
                      <Image src={item.image} alt={item.title} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13.5px] text-ink">{item.title}</p>
                      {item.variantTitle && <p className="text-[12.5px] text-ink-3">{item.variantTitle}</p>}
                      <p className="text-[12px] text-ink-3">SKU: {item.sku} · Qty {item.quantity}</p>
                    </div>
                    <p className="text-[13.5px] font-medium text-ink">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 border-t border-line px-5 py-4 text-[13px]">
                <div className="flex justify-between text-ink-2"><span>Subtotal</span><span className="text-ink">{formatCurrency(order.subtotal)}</span></div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-ink-2">
                    <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                    <span className="text-success">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ink-2"><span>Shipping</span><span className="text-ink">{order.shippingCost === 0 ? "Free" : formatCurrency(order.shippingCost)}</span></div>
                <div className="flex justify-between text-ink-2"><span>Tax</span><span className="text-ink">{formatCurrency(order.tax)}</span></div>
                <div className="flex justify-between border-t border-line pt-2.5 text-[14.5px] font-medium text-ink"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline events={order.timeline} />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar name={order.customerName} />
                <div>
                  <p className="text-[13.5px] font-medium text-ink">{order.customerName}</p>
                  <p className="text-[12.5px] text-ink-3">{order.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-3" />
                <span>
                  {order.shippingAddress.fullName}
                  <br />
                  {order.shippingAddress.line1}
                  {order.shippingAddress.line2 && <>, {order.shippingAddress.line2}</>}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.country}
                  <br />
                  {order.shippingAddress.phone}
                </span>
              </p>
              <p className="mt-3 flex items-center gap-2 text-[13px] text-ink-2">
                <Truck className="h-3.5 w-3.5 text-ink-3" /> {order.shippingMethod}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              <p className="flex items-center gap-2 text-[13px] text-ink-2">
                <CreditCard className="h-3.5 w-3.5 text-ink-3" /> {order.paymentMethod}
              </p>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-ink-3">Payment status</span>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-ink-3">Fulfillment</span>
                <FulfillmentStatusBadge status={order.fulfillmentStatus} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supplier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-ink-3">Fulfillment source</span>
                <span className="text-ink">Tager</span>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[13px]">
                <span className="text-ink-3">Status</span>
                <SupplierStatusBadge status={order.supplierStatus} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
