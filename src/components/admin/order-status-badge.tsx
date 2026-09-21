import { Badge } from "@/components/ui/badge";
import type { OrderStatus, PaymentStatus, FulfillmentStatus, SupplierOrderStatus } from "@/lib/types";

const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }> = {
  pending: { label: "Pending", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "info" },
  processing: { label: "Processing", variant: "info" },
  shipped: { label: "Shipped", variant: "accent" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "neutral" },
  returned: { label: "Returned", variant: "warning" },
  failed: { label: "Failed", variant: "danger" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = ORDER_STATUS_MAP[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

const PAYMENT_STATUS_MAP: Record<PaymentStatus, { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }> = {
  paid: { label: "Paid", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  refunded: { label: "Refunded", variant: "neutral" },
  failed: { label: "Failed", variant: "danger" },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_STATUS_MAP[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

const FULFILLMENT_STATUS_MAP: Record<FulfillmentStatus, { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }> = {
  unfulfilled: { label: "Unfulfilled", variant: "neutral" },
  processing: { label: "Processing", variant: "info" },
  shipped: { label: "Shipped", variant: "accent" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "neutral" },
  returned: { label: "Returned", variant: "warning" },
};

export function FulfillmentStatusBadge({ status }: { status: FulfillmentStatus }) {
  const cfg = FULFILLMENT_STATUS_MAP[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

const SUPPLIER_STATUS_MAP: Record<SupplierOrderStatus, { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }> = {
  not_sent: { label: "Not Sent", variant: "neutral" },
  sent: { label: "Sent", variant: "info" },
  acknowledged: { label: "Acknowledged", variant: "info" },
  shipped: { label: "Shipped", variant: "accent" },
  error: { label: "Error", variant: "danger" },
};

export function SupplierStatusBadge({ status }: { status: SupplierOrderStatus }) {
  const cfg = SUPPLIER_STATUS_MAP[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
