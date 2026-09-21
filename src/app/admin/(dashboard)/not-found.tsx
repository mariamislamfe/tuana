import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="font-display text-5xl text-ink">404</p>
      <h1 className="mt-4 text-[15px] font-medium text-ink">This admin page doesn&apos;t exist.</h1>
      <Button asChild className="mt-6">
        <Link href="/admin">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
