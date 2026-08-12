import Link from 'next/link';
import { createEvent } from '@/app/admin/actions';
import EventForm from '@/components/admin/EventForm';
import { cardCls, headingCls, microLabelCls } from '@/components/admin/ui';

export default function NewEventPage() {
  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/admin/events"
          className="font-mono text-xs uppercase tracking-widest text-white/45 hover:text-cyan"
        >
          Back to Events
        </Link>
        <p className={`${microLabelCls} mt-4`}>New Event</p>
        <h1 className={headingCls}>
          <span className="text-cyan">New</span>{' '}
          <span className="text-white">Wave</span>
        </h1>
      </header>

      <div className={`${cardCls} p-6 sm:p-8`}>
        <EventForm action={createEvent} submitLabel="Create Event" />
      </div>
    </div>
  );
}
