import Link from 'next/link';
import { createEvent } from '@/app/admin/actions';
import EventForm from '@/components/admin/EventForm';
import { cardCls } from '@/components/admin/ui';

export default function NewEventPage() {
  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/admin/events"
          className="font-mono text-xs uppercase tracking-widest text-white/45 hover:text-cyan"
        >
          ← Events
        </Link>
        <p className="eyebrow mt-4">New Event</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold">Drop a New Wave</h1>
      </header>

      <div className={cardCls + ' p-6 sm:p-8'}>
        <EventForm action={createEvent} submitLabel="Create Event" />
      </div>
    </div>
  );
}
