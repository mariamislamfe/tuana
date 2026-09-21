"use client";

import { useState, useTransition } from "react";
import type { StoreSettings } from "@/lib/data/store-settings";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { updateStoreSettingsAction } from "@/app/admin/(dashboard)/settings/actions";
import { toast } from "@/lib/store/toast-store";

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [pending, startTransition] = useTransition();
  const [orderNotifications, setOrderNotifications] = useState(settings.orderNotifications);
  const [lowStockNotifications, setLowStockNotifications] = useState(settings.lowStockNotifications);

  function handleSubmit(formData: FormData) {
    formData.set("orderNotifications", orderNotifications ? "on" : "off");
    formData.set("lowStockNotifications", lowStockNotifications ? "on" : "off");
    startTransition(async () => {
      await updateStoreSettingsAction(formData);
      toast({ title: "Settings saved", variant: "success" });
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-8">
      <section>
        <h2 className="mb-4 text-[14px] font-semibold text-ink">General</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="storeName">Store name</Label>
            <Input id="storeName" name="storeName" defaultValue={settings.storeName} />
          </div>
          <div>
            <Label htmlFor="supportEmail">Support email</Label>
            <Input id="supportEmail" name="supportEmail" type="email" defaultValue={settings.supportEmail} />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" name="currency" defaultValue={settings.currency} />
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" name="timezone" defaultValue={settings.timezone} />
          </div>
        </div>
      </section>

      <section className="border-t border-line pt-6">
        <h2 className="mb-4 text-[14px] font-semibold text-ink">Shipping &amp; Tax</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="freeShippingThreshold">Free shipping over ($)</Label>
            <Input id="freeShippingThreshold" name="freeShippingThreshold" type="number" step="0.01" defaultValue={settings.freeShippingThreshold} />
          </div>
          <div>
            <Label htmlFor="flatShippingRate">Flat shipping rate ($)</Label>
            <Input id="flatShippingRate" name="flatShippingRate" type="number" step="0.01" defaultValue={settings.flatShippingRate} />
          </div>
          <div>
            <Label htmlFor="taxRate">Tax rate (%)</Label>
            <Input id="taxRate" name="taxRate" type="number" step="0.01" defaultValue={settings.taxRate} />
          </div>
        </div>
      </section>

      <section className="border-t border-line pt-6">
        <h2 className="mb-4 text-[14px] font-semibold text-ink">Inventory</h2>
        <div className="max-w-xs">
          <Label htmlFor="lowStockThreshold">Low stock threshold (units)</Label>
          <Input id="lowStockThreshold" name="lowStockThreshold" type="number" defaultValue={settings.lowStockThreshold} />
        </div>
      </section>

      <section className="border-t border-line pt-6">
        <h2 className="mb-4 text-[14px] font-semibold text-ink">Notifications</h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center justify-between rounded-sm border border-line px-3.5 py-3">
            <div>
              <p className="text-[13.5px] text-ink">New order alerts</p>
              <p className="text-[12px] text-ink-3">Email the team when a new order comes in.</p>
            </div>
            <Switch checked={orderNotifications} onCheckedChange={setOrderNotifications} />
          </label>
          <label className="flex items-center justify-between rounded-sm border border-line px-3.5 py-3">
            <div>
              <p className="text-[13.5px] text-ink">Low stock alerts</p>
              <p className="text-[12px] text-ink-3">Notify when a variant drops below its threshold.</p>
            </div>
            <Switch checked={lowStockNotifications} onCheckedChange={setLowStockNotifications} />
          </label>
        </div>
      </section>

      <div>
        <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save Changes"}</Button>
      </div>
    </form>
  );
}
