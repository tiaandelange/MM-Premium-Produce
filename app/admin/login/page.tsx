import { loginAction } from "@/app/admin/actions";
import { getAdminSession } from "@/lib/auth/session";
import { paths } from "@/lib/routes";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign in",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const session = await getAdminSession();
  if (session) redirect(paths.admin);
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <header>
        <h1 className="text-page-title">Admin sign in</h1>
        <p className="mt-3 text-muted">
          Sign in to manage the catalogue, SEO fields, media and redirects.
        </p>
      </header>
      {params.error ? (
        <p className="rounded-card border border-line bg-notice px-4 py-3 text-sm">
          Email or password is incorrect.
        </p>
      ) : null}
      <form action={loginAction} className="card-surface space-y-4 p-6">
        <input type="hidden" name="next" value={params.next ?? paths.admin} />
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="username"
            className="w-full rounded-control border border-line bg-surface px-3 py-2 text-ink"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="current-password"
            className="w-full rounded-control border border-line bg-surface px-3 py-2 text-ink"
          />
        </label>
        <button type="submit" className="btn-primary w-full">
          Sign in
        </button>
      </form>
    </div>
  );
}
