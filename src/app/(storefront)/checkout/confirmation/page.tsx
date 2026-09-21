"use client";

import { useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface LastOrder {
  number: string;
  email: string;
  name: string;
  items: { title: string; variantTitle: string; quantity: number; price: number; image: string }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

const subscribe = () => () => {};
// The snapshot must be a stable value (a string), so parse it separately.
const readRawOrder = () => sessionStorage.getItem("tuana-last-order");
const getServerSnapshot = () => null;

export default function ConfirmationPage() {
  const raw = useSyncExternalStore(subscribe, readRawOrder, getServerSnapshot);
  const order = useMemo(() => (raw ? (JSON.parse(raw) as LastOrder) : null), [raw]);
  const checked = useSyncExternalStore(subscribe, () => true, () => false);

  if (!checked) return <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6" />;

  if (!order) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <p className="text-[15px] text-ink-2">No recent order found.</p>
        <Button asChild className="mt-5">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-11 w-11 text-success" strokeWidth={1.3} />
        <h1 className="mt-5 font-display text-3xl text-ink">Order Confirmed</h1>
        <p className="mt-2 max-w-sm text-[14.5px] text-ink-3">
          Thank you, {order.name.split(" ")[0]}. A confirmation has been sent to {order.email}.
        </p>
        <p className="mt-4 rounded-xs bg-surface px-3 py-1.5 text-[13px] font-medium text-ink">Order {order.number}</p>
      </div>

      <div className="mt-10 rounded-md border border-line bg-paper-raised p-6">
        <ul className="flex flex-col gap-4">
          {order.items.map((item, i) => (
            <li key={i} className="flex gap-3.5">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xs bg-surface">
                <Image src={item.image} alt={item.title} fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[13.5px] text-ink">{item.title}</p>
                {item.variantTitle && <p className="text-[12.5px] text-ink-3">{item.variantTitle}</p>}
                <p className="text-[12.5px] text-ink-3">Qty {item.quantity}</p>
              </div>
              <p className="text-[13.5px] text-ink">{formatCurrency(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-col gap-2 border-t border-line pt-5 text-[13.5px]">
          <div className="flex justify-between text-ink-2"><span>Subtotal</span><span className="text-ink">{formatCurrency(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-ink-2"><span>Discount</span><span className="text-success">-{formatCurrency(order.discount)}</span></div>}
          <div className="flex justify-between text-ink-2"><span>Shipping</span><span className="text-ink">{order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}</span></div>
          <div className="flex justify-between text-ink-2"><span>Tax</span><span className="text-ink">{formatCurrency(order.tax)}</span></div>
          <div className="mt-1 flex justify-between border-t border-line pt-3 text-[15px] font-medium text-ink">
            <span>Total</span><span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline" className="flex-1">
          <Link href="/account">View Order</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
