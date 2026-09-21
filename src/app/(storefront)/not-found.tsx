import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center sm:px-6">
      <p className="font-display text-6xl text-ink">404</p>
      <h1 className="mt-4 text-[17px] font-medium text-ink">We couldn&apos;t find that page.</h1>
      <p className="mt-2 text-[14px] text-ink-3">It may have been moved, or the link might be out of date.</p>
      <Button asChild className="mt-7">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
