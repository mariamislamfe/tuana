import Link from "next/link";
import { getSiteContent } from "@/lib/content/site-content";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default async function AdminLoginPage() {
  const { brand } = await getSiteContent();

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-2 font-display text-2xl text-ink">
            {brand.mark && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.mark} alt="" className="h-16 w-auto rounded-md" />
            )}
            {brand.name}
          </Link>
          <p className="mt-1.5 text-[13px] text-ink-3">Admin Dashboard</p>
        </div>

        <AdminLoginForm />

        <Link href="/" className="mt-5 block text-center text-[13px] text-ink-3 hover:text-ink">
          &larr; Back to store
        </Link>
      </div>
    </div>
  );
}
