import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'fw_session';
const SESSION_DAYS = 7;

function secretKey() {
  return new TextEncoder().encode(process.env.AUTH_SECRET!);
}

export function verifyCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() ===
      (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase() &&
    password === process.env.ADMIN_PASSWORD
  );
}

export async function createSession(email: string): Promise<void> {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: '/',
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getSession(): Promise<{ email: string } | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return { email: payload.email as string };
  } catch {
    return null;
  }
}

/** Server-component guard: redirects to /admin/login when not signed in. */
export async function requireAdmin(): Promise<{ email: string }> {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}
