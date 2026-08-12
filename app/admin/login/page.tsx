import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createSession, getSession, verifyCredentials } from '@/lib/auth';
import { cardCls, errorBannerCls, inputCls, labelCls } from '@/components/admin/ui';
import LogoMark from '@/components/site/LogoMark';

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
    <main className="relative flex min-h-screen items-center justify-center bg-[#030818] px-4">
      {/* Faint fixed grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,248,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(107,0,245,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className={`${cardCls} relative w-full max-w-md p-8 sm:p-10`}>
        <div className="mb-8 text-center">
          <p className="flex items-center justify-center gap-2.5 font-display text-3xl italic tracking-wide">
            <LogoMark className="h-8 w-auto" />
            <span>
              <span className="text-cyan">Frequency</span>{' '}
              <span className="text-white">Wave</span>
            </span>
          </p>
          <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-cyan/80">
            Mission Control
          </p>
        </div>

        {error && (
          <div className={`${errorBannerCls} mb-5`}>
            Invalid email or password. Try again.
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
              placeholder="Password"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Enter Mission Control
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-[0.62rem] uppercase tracking-[0.25em] text-white/30">
          Authorized crew only
        </p>
      </div>
    </main>
  );
}
