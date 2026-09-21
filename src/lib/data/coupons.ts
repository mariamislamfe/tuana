import type { Coupon } from "@/lib/types";

const DAY = 1000 * 60 * 60 * 24;
const now = new Date("2026-08-28T12:00:00Z").getTime();
const daysAgo = (n: number) => new Date(now - n * DAY).toISOString();
const daysFromNow = (n: number) => new Date(now + n * DAY).toISOString();

export const seedCoupons = (): Coupon[] => [
  { id: "coupon-1", code: "WELCOME10", type: "percentage", value: 10, minOrderValue: 0, appliesTo: "all", startsAt: daysAgo(180), usedCount: 342, status: "active" },
  { id: "coupon-2", code: "FREESHIP", type: "free_shipping", value: 0, minOrderValue: 2500, appliesTo: "all", startsAt: daysAgo(90), usedCount: 198, status: "active" },
  { id: "coupon-3", code: "SKIN25", type: "percentage", value: 25, minOrderValue: 5000, appliesTo: "category", appliesToIds: ["cat-skincare"], startsAt: daysAgo(10), endsAt: daysFromNow(4), usageLimit: 500, usedCount: 128, status: "active" },
  { id: "coupon-4", code: "TAKE20", type: "fixed", value: 1000, minOrderValue: 6000, appliesTo: "all", startsAt: daysAgo(5), endsAt: daysFromNow(9), usageLimit: 1000, usedCount: 61, status: "active" },
  { id: "coupon-5", code: "VIP15", type: "percentage", value: 15, appliesTo: "all", startsAt: daysFromNow(3), endsAt: daysFromNow(30), usedCount: 0, status: "scheduled" },
  { id: "coupon-6", code: "SUMMER22", type: "percentage", value: 22, minOrderValue: 3000, appliesTo: "all", startsAt: daysAgo(120), endsAt: daysAgo(30), usedCount: 415, status: "expired" },
  { id: "coupon-7", code: "STAFF50", type: "percentage", value: 50, appliesTo: "all", startsAt: daysAgo(200), usedCount: 12, status: "disabled" },
];

export interface CouponInput {
  code: string;
  type: Coupon["type"];
  value: number;
  minOrderValue?: number;
  endsAt?: string;
}
