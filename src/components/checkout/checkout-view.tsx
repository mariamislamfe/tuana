"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { calculateTotals, EXPRESS_SHIPPING, type PricingRules } from "@/lib/services/pricing";
import { placeOrderAction } from "@/app/(storefront)/checkout/actions";
import { toast } from "@/lib/store/toast-store";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EmptyState } from "@/components/ui/empty-state";

type ShippingMethod = "standard" | "express";
type PaymentMethod = "card" | "paypal" | "apple_pay";

export function CheckoutView({ rules, brandName }: { rules: PricingRules; brandName: string }) {
  const router = useRouter();
  const { items, coupon, clear } = useCartStore();
  const mounted = useMounted();

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [placing, setPlacing] = useState(false);

  const totals = calculateTotals(items, coupon, rules);
  const shipping = shippingMethod === "express" ? EXPRESS_SHIPPING : totals.shipping;
  const total = Math.round((totals.subtotal - totals.discount + shipping + totals.tax) * 100) / 100;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }
    const form = new FormData(formEl);
    setPlacing(true);

    const result = await placeOrderAction({
      items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
      couponCode: coupon?.code ?? null,
      shippingMethod,
      paymentMethod,
      email: String(form.get("email")),
      phone: String(form.get("phone")),
      firstName: String(form.get("firstName")),
      lastName: String(form.get("lastName")),
      address: String(form.get("address")),
      city: String(form.get("city")),
      postal: String(form.get("postal")),
      country: String(form.get("country")),
    });

    if (!result.ok) {
      setPlacing(false);
      toast({ title: "We couldn't place your order", description: result.message, variant: "danger" });
      return;
    }

    sessionStorage.setItem("tuana-last-order", JSON.stringify(result.order));
    clear();
    router.push("/checkout/confirmation");
  }

  if (!mounted) return <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10" />;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10">
        <EmptyState
          title="Nothing to check out"
          description="Your bag is empty — add a few things first."
          action={
            <Button asChild className="mt-2">
              <Link href="/shop">Shop the Collection</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="font-display text-xl text-ink">{brandName}</Link>
        <p className="flex items-center gap-1.5 text-[12.5px] text-ink-3">
          <Lock className="h-3.5 w-3.5" /> Secure Checkout
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="mb-4 text-[15px] font-semibold text-ink">Contact</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="you@email.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" required placeholder="(555) 010-0000" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-[15px] font-semibold text-ink">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" name="firstName" required />
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" name="lastName" required />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" required placeholder="Street address" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required />
              </div>
              <div>
                <Label htmlFor="postal">Postal code</Label>
                <Input id="postal" name="postal" required />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" required defaultValue="United States" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-[15px] font-semibold text-ink">Shipping Method</h2>
            <RadioGroup value={shippingMethod} onValueChange={(v) => setShippingMethod(v as ShippingMethod)}>
              {[
                { value: "standard", label: "Standard Shipping", desc: "3–7 business days", price: totals.shipping },
                { value: "express", label: "Express Shipping", desc: "1–2 business days", price: EXPRESS_SHIPPING },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-sm border px-4 py-3.5",
                    shippingMethod === opt.value ? "border-ink" : "border-line-strong"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <RadioGroupItem value={opt.value} />
                    <span>
                      <span className="block text-[13.5px] font-medium text-ink">{opt.label}</span>
                      <span className="block text-[12.5px] text-ink-3">{opt.desc}</span>
                    </span>
                  </span>
                  <span className="text-[13.5px] text-ink">{opt.price === 0 ? "Free" : formatCurrency(opt.price)}</span>
                </label>
              ))}
            </RadioGroup>
          </section>

          <section>
            <h2 className="mb-4 text-[15px] font-semibold text-ink">Payment</h2>
            <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
              {[
                { value: "card", label: "Credit / Debit Card" },
                { value: "paypal", label: "PayPal" },
                { value: "apple_pay", label: "Apple Pay" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-sm border px-4 py-3.5",
                    paymentMethod === opt.value ? "border-ink" : "border-line-strong"
                  )}
                >
                  <RadioGroupItem value={opt.value} />
                  <span className="text-[13.5px] font-medium text-ink">{opt.label}</span>
                </label>
              ))}
            </RadioGroup>

            {paymentMethod === "card" && (
              <div className="mt-4 grid grid-cols-1 gap-4 rounded-sm border border-line bg-paper-raised p-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="cardNumber">Card number</Label>
                  <Input id="cardNumber" name="cardNumber" required inputMode="numeric" placeholder="4242 4242 4242 4242" maxLength={19} />
                </div>
                <div>
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input id="expiry" name="expiry" required placeholder="MM / YY" maxLength={7} />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" name="cvc" required inputMode="numeric" placeholder="123" maxLength={4} />
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="h-fit rounded-md border border-line bg-paper-raised p-6">
          <h2 className="mb-4 text-[15px] font-semibold text-ink">Order Summary</h2>
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li key={item.variantId} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xs bg-surface">
                  <NextImage src={item.image} alt={item.title} fill sizes="56px" className="object-cover" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-paper">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-[13px] text-ink">{item.title}</p>
                  {item.variantTitle && <p className="text-[12px] text-ink-3">{item.variantTitle}</p>}
                </div>
                <p className="text-[13px] text-ink">{formatCurrency(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5 text-[13.5px]">
            <div className="flex justify-between text-ink-2">
              <span>Subtotal</span>
              <span className="text-ink">{formatCurrency(totals.subtotal)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-ink-2">
                <span>Discount {coupon && `(${coupon.code})`}</span>
                <span className="text-success">-{formatCurrency(totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink-2">
              <span>Shipping</span>
              <span className="text-ink">{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between text-ink-2">
              <span>Estimated tax</span>
              <span className="text-ink">{formatCurrency(totals.tax)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="text-[15px] font-medium text-ink">Total</span>
            <span className="text-xl font-medium text-ink">{formatCurrency(total)}</span>
          </div>

          <Button type="submit" size="lg" className="mt-5 w-full" disabled={placing}>
            {placing ? "Placing Order..." : `Pay ${formatCurrency(total)}`}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-ink-3">
            <ShieldCheck className="h-3.5 w-3.5" /> Payments are encrypted and secure
          </p>
        </div>
      </form>
    </div>
  );
}
