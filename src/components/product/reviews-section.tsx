"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { RatingStars } from "./rating-stars";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/input";
import { toast } from "@/lib/store/toast-store";
import { BadgeCheck, Star } from "lucide-react";

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2.5 text-[12.5px] text-ink-3">
      <span className="w-8">{stars} star</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
        <div className="h-full bg-ink" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-7 text-right">{count}</span>
    </div>
  );
}

export function ReviewsSection({ product }: { product: Product }) {
  const [writeOpen, setWriteOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");

  const counts = [5, 4, 3, 2, 1].map((s) => ({ stars: s, count: product.reviews.filter((r) => r.rating === s).length }));

  function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setWriteOpen(false);
    setBody("");
    setRating(5);
    toast({ title: "Review submitted", description: "Thanks — it'll appear after a quick moderation pass.", variant: "success" });
  }

  return (
    <section id="reviews" className="border-t border-line py-14">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[300px_1fr]">
        <div>
          <h2 className="font-display text-2xl text-ink">Customer Reviews</h2>
          <div className="mt-4 flex items-center gap-3">
            <span className="font-display text-4xl text-ink">{product.rating}</span>
            <div>
              <RatingStars rating={product.rating} size={16} />
              <p className="mt-1 text-[13px] text-ink-3">Based on {product.reviewCount} reviews</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2">
            {counts.map((c) => (
              <RatingBar key={c.stars} stars={c.stars} count={c.count} total={product.reviews.length} />
            ))}
          </div>
          <Button variant="outline" className="mt-6 w-full" onClick={() => setWriteOpen(true)}>
            Write a Review
          </Button>
        </div>

        <div className="flex flex-col divide-y divide-line">
          {product.reviews.length === 0 ? (
            <p className="py-6 text-sm text-ink-3">No written reviews yet — be the first.</p>
          ) : (
            product.reviews.map((r) => (
              <div key={r.id} className="py-5 first:pt-0">
                <div className="flex items-center justify-between">
                  <RatingStars rating={r.rating} size={13} />
                  <span className="text-[12.5px] text-ink-3">{formatDate(r.date)}</span>
                </div>
                <p className="mt-2.5 text-[14.5px] font-medium text-ink">{r.title}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{r.body}</p>
                <div className="mt-2.5 flex items-center gap-1.5 text-[12px] text-ink-3">
                  {r.verified && <BadgeCheck className="h-3.5 w-3.5 text-success" />}
                  {r.author}
                  {r.verified && " · Verified purchase"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={writeOpen} onOpenChange={setWriteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a review</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitReview}>
            <DialogBody className="flex flex-col gap-4">
              <div>
                <p className="mb-2 text-[13px] font-medium text-ink-2">Your rating</p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setRating(s)} aria-label={`${s} star`}>
                      <Star
                        width={22}
                        height={22}
                        className={s <= rating ? "fill-ink text-ink" : "fill-transparent text-line-strong"}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[13px] font-medium text-ink-2">Your review</p>
                <Textarea required value={body} onChange={(e) => setBody(e.target.value)} placeholder={`What did you think of ${product.title}?`} />
              </div>
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setWriteOpen(false)}>Cancel</Button>
              <Button type="submit">Submit Review</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
