"use client";

import { useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { createCouponAction } from "@/app/admin/(dashboard)/marketing/actions";
import { toast } from "@/lib/store/toast-store";

export function CouponFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createCouponAction(formData);
      toast({ title: "Coupon created", variant: "success" });
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Coupon</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit}>
          <DialogBody className="flex flex-col gap-4">
            <div>
              <Label htmlFor="code">Code</Label>
              <Input id="code" name="code" required placeholder="SUMMER20" className="uppercase" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Discount type</Label>
                <Select name="type" defaultValue="percentage">
                  <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="free_shipping">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="value">Value</Label>
                <Input id="value" name="value" type="number" min="0" step="0.01" defaultValue={10} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minOrderValue">Min. order value</Label>
                <Input id="minOrderValue" name="minOrderValue" type="number" min="0" step="0.01" placeholder="Optional" />
              </div>
              <div>
                <Label htmlFor="endsAt">Expires</Label>
                <Input id="endsAt" name="endsAt" type="date" />
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Creating..." : "Create Coupon"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
