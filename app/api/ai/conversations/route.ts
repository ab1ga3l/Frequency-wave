import { NextRequest, NextResponse } from 'next/server';
import { db, aiConversations, type AiTranscriptMessage } from '@/lib/db';

const MAX_MESSAGES = 200;
const MAX_TEXT = 4000;

/** Upserts an AI-widget conversation transcript keyed by visitorId. */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { visitorId, externalId, mode, status, messages } = (body ?? {}) as {
    visitorId?: string;
    externalId?: string | null;
    mode?: string;
    status?: string;
    messages?: unknown;
  };

  if (
    typeof visitorId !== 'string' ||
    visitorId.length < 8 ||
    visitorId.length > 64 ||
    !Array.isArray(messages) ||
    messages.length === 0
  ) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const clean: AiTranscriptMessage[] = messages
    .slice(0, MAX_MESSAGES)
    .flatMap((m): AiTranscriptMessage[] => {
      const msg = m as Partial<AiTranscriptMessage>;
      if (
        (msg.role !== 'user' && msg.role !== 'agent') ||
        typeof msg.text !== 'string' ||
        !msg.text.trim()
      ) {
        return [];
      }
      return [
        {
          role: msg.role,
          text: msg.text.slice(0, MAX_TEXT),
          timestamp:
            typeof msg.timestamp === 'string'
              ? msg.timestamp
              : new Date().toISOString(),
        },
      ];
    });

  if (clean.length === 0) {
    return NextResponse.json({ error: 'No valid messages' }, { status: 400 });
  }

  const values = {
    visitorId,
    externalId: typeof externalId === 'string' ? externalId : null,
    mode: mode === 'voice' ? 'voice' : 'text',
    status: status === 'ended' ? 'ended' : 'active',
    messages: clean,
    updatedAt: new Date(),
  };

  await db
    .insert(aiConversations)
    .values(values)
    .onConflictDoUpdate({
      target: aiConversations.visitorId,
      set: {
        externalId: values.externalId,
        mode: values.mode,
        status: values.status,
        messages: values.messages,
        updatedAt: values.updatedAt,
      },
    });

  return NextResponse.json({ ok: true });
}
