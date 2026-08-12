import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createSession, getSession, verifyCredentials } from '@/lib/auth';
import { inputCls, labelCls } from '@/components/admin/ui';

export const metadata: Metadata = {
  title: 'Sign In — Frequency Wave Mission Control',
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getSession()) redirect('/admin');
  const { error } = await searchParams;

  async function login(formData: FormData) {
    'use server';
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    if (!verifyCredentials(email, password)) redirect('/admin/login?error=1');
    await createSession(email);
    redirect('/admin');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,#0a1340_0%,#040b24_55%,#02061a_100%)] px-4">
      <div className="neon-card w-full max-w-md p-8 sm:p-10 hover:transform-none">
        <div className="mb-8 text-center">
          <p className="font-display text-xl font-extrabold tracking-wide">
            ⚡ FREQUENCY WAVE
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">
            Mission Control
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-magenta/50 bg-magenta/10 px-4 py-3 text-sm text-magenta">
            ⚠ Invalid email or password. Try again.
          </div>
        )}

        <form action={login} className="space-y-5">
          <div>
            <label htmlFor="email" className={labelCls}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputCls}
              placeholder="you@frequencywave.africa"
            />
          </div>
          <div>
            <label htmlFor="password" className={labelCls}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={inputCls}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Enter Mission Control
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-white/30">
          Authorized crew only
        </p>
      </div>
    </main>
  );
}
