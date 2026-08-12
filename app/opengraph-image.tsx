/** SEO featured image: FW logo on midnight navy. */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Frequency Wave — Where Web3 Meets Music & Culture';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const logo = await readFile(join(process.cwd(), 'public/images/fw-mark.png'));
  const src = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#040B24',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 50% 40%, rgba(38,91,255,0.28), transparent 58%), radial-gradient(ellipse at 78% 72%, rgba(107,0,245,0.22), transparent 50%)',
          }}
        />
        <img
          src={src}
          width={720}
          height={280}
          alt=""
          style={{ objectFit: 'contain' }}
        />
        <div
          style={{
            display: 'flex',
            fontSize: 42,
            color: 'white',
            marginTop: 28,
            letterSpacing: 2,
          }}
        >
          Frequency Wave
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            color: '#00F8FF',
            marginTop: 10,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          Where Web3 Meets Music & Culture
        </div>
      </div>
    ),
    { ...size },
  );
}
