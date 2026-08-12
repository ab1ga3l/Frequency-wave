import { NextResponse } from 'next/server';

/**
 * Mints an ElevenLabs Conversational AI signed URL for the site's own agent.
 * The agent ID is never accepted from the client — accepting one would let
 * anyone spend our API credits on arbitrary agents.
 */
export async function GET() {
  const agentId =
    process.env.ELEVENLABS_AGENT_ID ||
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY || process.env.XI_API_KEY;

  if (!agentId || !apiKey) {
    return NextResponse.json(
      { error: 'ElevenLabs is not configured yet' },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${encodeURIComponent(agentId)}`,
      { headers: { 'xi-api-key': apiKey }, cache: 'no-store' },
    );

    const data = (await response.json().catch(() => null)) as {
      signed_url?: string;
      signedUrl?: string;
    } | null;

    const signedUrl = data?.signed_url ?? data?.signedUrl;
    if (!response.ok || !signedUrl) {
      console.error('ElevenLabs signed URL error:', response.status);
      return NextResponse.json(
        { error: 'Failed to create ElevenLabs signed URL' },
        { status: 502 },
      );
    }

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error('ElevenLabs signed URL request failed:', error);
    return NextResponse.json(
      { error: 'Failed to connect to ElevenLabs' },
      { status: 502 },
    );
  }
}
