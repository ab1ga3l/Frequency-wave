import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { count, eq } from 'drizzle-orm';
import { db, messages } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import Sidebar from '@/components/admin/Sidebar';
import PageBackdrop from '@/components/site/PageBackdrop';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mission Control — Frequency Wave',
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  const [{ unread }] = await db
    .select({ unread: count() })
    .from(messages)
    .where(eq(messages.read, false));

  return (
    <div className="relative min-h-screen">
      <PageBackdrop />
      <Sidebar unread={unread} />
      <main className="relative z-10 px-4 py-6 sm:px-8 sm:py-10 md:ml-60">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
