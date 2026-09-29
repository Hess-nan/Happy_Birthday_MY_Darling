import { useState, useRef, useCallback, useEffect } from 'react'

// ── Static ambient data (deterministic, no Math.random in render) ──
const HEARTS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: ((i * 17 + 5) % 90) + 4,
  size: 10 + (i * 7 % 20),
  duration: 11 + (i * 3 % 9),
  delay: (i * 1.35) % 12,
  opacity: 0.18 + (i * 9 % 5) * 0.07,
  hue: 318 + (i * 11 % 35),
  lightness: 60 + (i * 7 % 20),
}))

const CONFETTI_COLORS = [
  '#ff1493', '#ffd700', '#ff69b4', '#ffffff',
  '#ff0080', '#ffe066', '#ff8cb4', '#ffb347',
]

const RAIN = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: ((i * 23 + 3) % 94) + 2,
  delay: (i * 0.72) % 9,
  duration: 7 + (i * 1.2 % 5),
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: 4 + (i * 2 % 5),
  round: i % 4 === 3,
  rotate: (i * 51) % 360,
}))

const STARS_BG = [
  { top: '14%', left: '4%', delay: 0, size: 13 },
  { top: '28%', right: '6%', delay: 0.6, size: 10 },
  { top: '42%', left: '3%', delay: 1.1, size: 11 },
  { top: '57%', right: '5%', delay: 1.7, size: 8 },
  { top: '71%', left: '7%', delay: 0.9, size: 15 },
  { top: '83%', right: '4%', delay: 0.4, size: 12 },
  { top: '92%', left: '12%', delay: 1.4, size: 9 },
]

const PHOTOS = [
  {
    id: 1,
    src: '/photos/WhatsApp Image 2026-09-29 at 13.57.47.jpeg',
    alt: 'Kenangan spesial bersama',
    caption: 'Our Sweet Moments',
  },
  {
    id: 2,
    src: '/photos/WhatsApp Image 2026-09-29 at 14.02.07.jpeg',
    alt: 'Momen bahagia bersama',
    caption: 'Together Forever',
  },
  {
    id: 3,
    src: '/photos/WhatsApp Image 2026-09-29 at 14.06.19.jpeg',
    alt: 'Kenangan penuh cinta',
    caption: 'My Happy Place',
  },
]

const SECRET_DATE = '30/09/2026'
// Add your chosen song as public/music.mp3. Files in public are served from '/'.
const MUSIC_SRC = '/music.mp3'
const MESSAGE_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxlBPu0wYcnGsn8sYGMdlNPGNRe5sg9_vCuYF0ylEfcb_imdkqVJUS2AbfsVkbtmw21/exec'

// Edit this object to personalize the letter shown between the cake and memories.
const LOVE_LETTER = {
  title: 'A Letter From Mahesa',
  subtitle: 'Written with all my heart',
  greeting: 'Untuk satu-satunya orang yang paling kucintai dalam hidupku,',
  paragraphs: [
    'Kehadiranmu selalu punya cara ajaib untuk membuat hari-hariku terasa jauh lebih cerah. Kamu menyadarkanku bahwa di hidup ini, masih ada tujuan yang jauh lebih indah.',
    'Dulu kukira tujuanku sudah selesai hanya dengan berhasil masuk universitas, tapi ternyata, kamulah yang memberiku alasan dan tujuan baru untuk terus melangkah ke depan.',
    'Kamu tahu? Dari dulu aku nggak pernah percaya pada yang namanya keberuntungan. Aku selalu cuma ngandelin diriku sendiri.',
    'Tapi untuk pertama kalinya aku sadar kalau keberuntungan itu nyata, dan wujud keberuntungan terbesar itu adalah kamu. Kamu adalah bentuk nyata dari semua kebahagiaanku.',
    'Terima kasih atas cintamu, kebaikan hatimu, dan karena selalu menjadi kebahagiaanku.',
    'Semoga ulang tahun ini memberimu kebahagiaan sebesar kebahagiaan yang kamu bawa ke dalam hidupku.'
  ],
  closing: 'Selamat ulang tahun sayangg! ♥',
  signature: 'Forever yours,\nMahesa',
}

// Deterministic confetti burst (angle from index, not Math.random)
function makeConfettiBurst() {
  return Array.from({ length: 52 }, (_, i) => {
    const angle = (i / 52) * Math.PI * 2
    const dist = 70 + (i * 19 % 90)
    return {
      id: i,
      bx: Math.cos(angle) * dist,
      by: Math.sin(angle) * dist - 10,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + (i * 3 % 8),
      round: i % 3 === 2,
      duration: 0.9 + (i * 0.022 % 0.55),
      delay: (i * 0.012 % 0.22),
      rotate: (i * 47 % 360),
    }
  })
}

type ConfettiBurstPiece = ReturnType<typeof makeConfettiBurst>[number]

// ── HeartParticles ───────────────────────────────────────────────
function HeartParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {HEARTS.map(h => (
        <div
          key={h.id}
          className="absolute bottom-0"
          style={{
            left: `${h.left}%`,
            opacity: h.opacity,
            animation: `floatHeart ${h.duration}s ${h.delay}s infinite ease-out`,
          }}
        >
          <svg width={h.size} height={h.size} viewBox="0 0 24 24">
            <path
              d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"
              fill={`hsl(${h.hue}, 100%, ${h.lightness}%)`}
            />
          </svg>
        </div>
      ))}
    </div>
  )
}

// ── AmbientConfetti ──────────────────────────────────────────────
function AmbientConfetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {RAIN.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: '-30px',
            width: p.size,
            height: p.round ? p.size : p.size * 1.6,
            backgroundColor: p.color,
            borderRadius: p.round ? '50%' : '2px',
            opacity: 0.18,
            transform: `rotate(${p.rotate}deg)`,
            animation: `confettiRain ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}

// ── StarAccents ──────────────────────────────────────────────────
function StarAccents() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {STARS_BG.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: s.top,
            left: 'left' in s ? (s as { left: string }).left : undefined,
            right: 'right' in s ? (s as { right: string }).right : undefined,
            animation: `sparkle 3.2s ${s.delay}s ease-in-out infinite`,
          }}
        >
          <svg width={s.size} height={s.size} viewBox="0 0 24 24">
            <path
              d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.62 20L12 17.27L7.38 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z"
              fill="#ffd700"
              opacity="0.75"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}

// ── BirthdayCake SVG ─────────────────────────────────────────────
function BirthdayCake() {
  return (
    <div
      className="relative mx-auto select-none"
      style={{ width: 300, height: 390, animation: 'float 5s ease-in-out infinite' }}
    >
      <svg width="300" height="390" viewBox="0 0 300 390" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ck-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ck-glow2" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="9" result="b2" />
            <feMerge><feMergeNode in="b2" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="ck-t1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a0030" />
            <stop offset="100%" stopColor="#1c0018" />
          </linearGradient>
          <linearGradient id="ck-t2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#450038" />
            <stop offset="100%" stopColor="#22001c" />
          </linearGradient>
          <linearGradient id="ck-t3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#500040" />
            <stop offset="100%" stopColor="#280020" />
          </linearGradient>
          <linearGradient id="ck-ped" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>
          <radialGradient id="ck-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff1493" stopOpacity="0.55" />
            <stop offset="65%" stopColor="#ff1493" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ff1493" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ck-flame" cx="50%" cy="65%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="18%" stopColor="#ffe066" />
            <stop offset="52%" stopColor="#ff8800" />
            <stop offset="100%" stopColor="#ff4400" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ck-candle" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffe4b5" />
            <stop offset="45%" stopColor="#fff8e7" />
            <stop offset="100%" stopColor="#ffd59e" />
          </linearGradient>
        </defs>

        {/* Ground halo */}
        <ellipse cx="150" cy="375" rx="135" ry="18" fill="url(#ck-halo)" />

        {/* Pedestal */}
        <rect x="82" y="337" width="136" height="13" rx="6.5" fill="url(#ck-ped)" />
        <ellipse cx="150" cy="337" rx="68" ry="5" fill="#ffd700" opacity="0.45" filter="url(#ck-glow)" />

        {/* Tier 1 body */}
        <rect x="26" y="259" width="248" height="78" rx="10" fill="url(#ck-t1)" />
        {/* Tier 1 frosting drips */}
        <path d="M26 271 Q55 258 84 268 Q112 257 140 266 Q168 257 196 266 Q224 257 248 266 Q262 259 274 267 L274 273 L26 273 Z" fill="#ff69b4" opacity="0.9" />
        {/* Tier 1 bottom gold band */}
        <rect x="26" y="325" width="248" height="5" rx="2.5" fill="#ffd700" opacity="0.6" filter="url(#ck-glow)" />
        {/* Tier 1 roses */}
        {[84, 150, 216].map((cx, i) => (
          <g key={i} filter="url(#ck-glow)">
            <circle cx={cx} cy="294" r="13" fill="#800030" opacity="0.6" />
            <circle cx={cx} cy="294" r="11" fill="#cc0050" opacity="0.85" />
            <circle cx={cx - 7} cy="289" r="8" fill="#ff1493" opacity="0.85" />
            <circle cx={cx + 7} cy="289" r="8" fill="#ff1493" opacity="0.85" />
            <circle cx={cx} cy="283" r="8" fill="#ff69b4" opacity="0.9" />
            <circle cx={cx} cy="283" r="4.5" fill="#ffb6c1" />
            <circle cx={cx} cy="294" r="3.5" fill="#ff1493" />
          </g>
        ))}
        {/* Pearl accent dots */}
        {[52, 118, 182, 248].map((cx, i) => (
          <circle key={i} cx={cx} cy="312" r="3" fill="#ffb6c1" opacity="0.65" />
        ))}

        {/* Tier 2 body */}
        <rect x="62" y="189" width="176" height="70" rx="9" fill="url(#ck-t2)" />
        <path d="M62 200 Q88 188 115 197 Q140 187 165 196 Q190 187 214 196 Q228 189 238 197 L238 202 L62 202 Z" fill="#ff69b4" opacity="0.9" />
        <rect x="62" y="248" width="176" height="5" rx="2.5" fill="#ffd700" opacity="0.6" filter="url(#ck-glow)" />
        {[113, 187].map((cx, i) => (
          <g key={i} filter="url(#ck-glow)">
            <circle cx={cx} cy="222" r="11" fill="#800030" opacity="0.6" />
            <circle cx={cx} cy="222" r="9" fill="#cc0050" opacity="0.85" />
            <circle cx={cx - 6} cy="217" r="6.5" fill="#ff1493" opacity="0.85" />
            <circle cx={cx + 6} cy="217" r="6.5" fill="#ff1493" opacity="0.85" />
            <circle cx={cx} cy="212" r="6.5" fill="#ff69b4" opacity="0.9" />
            <circle cx={cx} cy="212" r="3.5" fill="#ffb6c1" />
          </g>
        ))}

        {/* Tier 3 body */}
        <rect x="100" y="129" width="100" height="60" rx="8" fill="url(#ck-t3)" />
        <path d="M100 140 Q125 128 150 136 Q175 127 200 135 L200 141 L100 141 Z" fill="#ff69b4" opacity="0.9" />
        <rect x="100" y="181" width="100" height="4" rx="2" fill="#ffd700" opacity="0.6" filter="url(#ck-glow)" />
        <g filter="url(#ck-glow)">
          <circle cx="150" cy="157" r="10" fill="#800030" opacity="0.6" />
          <circle cx="150" cy="157" r="8.5" fill="#cc0050" opacity="0.85" />
          <circle cx="143" cy="152" r="6" fill="#ff1493" opacity="0.85" />
          <circle cx="157" cy="152" r="6" fill="#ff1493" opacity="0.85" />
          <circle cx="150" cy="147" r="6" fill="#ff69b4" opacity="0.9" />
          <circle cx="150" cy="147" r="3.5" fill="#ffb6c1" />
        </g>

        {/* Candle */}
        <rect x="143" y="83" width="14" height="48" rx="4" fill="url(#ck-candle)" />
        <rect x="143" y="83" width="14" height="48" rx="4" stroke="#ffd700" strokeWidth="0.5" strokeOpacity="0.4" fill="none" />
        <line x1="150" y1="83" x2="150" y2="77" stroke="#2a1a00" strokeWidth="1.5" strokeLinecap="round" />

        {/* Flame */}
        <g
          style={{
            animation: 'candleFlicker 1.9s ease-in-out infinite',
            transformOrigin: '150px 83px',
          }}
          filter="url(#ck-glow2)"
        >
          <ellipse cx="150" cy="62" rx="15" ry="21" fill="#ff8800" opacity="0.32" />
          <path d="M150 77 C141 66 137 53 146 42 C148 49 152 49 152 42 C161 53 159 66 150 77Z" fill="url(#ck-flame)" />
          <path d="M150 75 C146 66 143 57 147 50 C149 54 151 54 151 50 C155 57 154 66 150 75Z" fill="#ffef88" opacity="0.82" />
          <ellipse cx="150" cy="64" rx="3" ry="5" fill="white" opacity="0.65" />
        </g>
      </svg>
    </div>
  )
}

// ── ConfettiBurst ────────────────────────────────────────────────
function ConfettiBurst({ pieces }: { pieces: ConfettiBurstPiece[] }) {
  if (pieces.length === 0) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 20 }}>
      <div className="absolute" style={{ left: '50%', top: '42%' }}>
        {pieces.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translate(${p.bx}px, ${p.by}px)`,
            }}
          >
            <div
              style={{
                width: p.size,
                height: p.round ? p.size : p.size * 1.5,
                backgroundColor: p.color,
                borderRadius: p.round ? '50%' : '2px',
                transform: `rotate(${p.rotate}deg)`,
                animation: `confettiBurstFall ${p.duration}s ${p.delay}s ease-in forwards`,
                boxShadow: `0 0 5px ${p.color}88`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── PolaroidCard ─────────────────────────────────────────────────
function PolaroidCard({
  src, alt, caption, delay = 0,
}: {
  src: string; alt: string; caption: string; delay?: number
}) {
  return (
    <div
      className="relative group cursor-pointer"
      style={{ animation: `fadeSlideUp 0.7s ${delay}s ease-out both` }}
    >
      <div
        className="absolute -inset-3 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,20,147,0.25) 0%, transparent 72%)',
        }}
      />
      <div
        className="relative p-3 pb-14 transition-transform duration-400 group-hover:-translate-y-2"
        style={{
          background: 'linear-gradient(150deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 0 30px rgba(255,20,147,0.12), 0 20px 60px rgba(0,0,0,0.65)',
        }}
      >
        {/* Glowing heart corners */}
        {[
          'top-2 left-2',
          'top-2 right-2',
          'bottom-10 left-2',
          'bottom-10 right-2',
        ].map((pos, i) => (
          <div key={i} className={`absolute ${pos}`}>
            <svg width="10" height="10" viewBox="0 0 24 24">
              <path
                d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"
                fill="#ff1493"
                opacity="0.85"
              />
            </svg>
          </div>
        ))}
        {/* Photo */}
        <div className="overflow-hidden bg-pink-950" style={{ width: 196, height: 236 }}>
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover saturate-75 brightness-70 group-hover:brightness-90 group-hover:saturate-90 transition-all duration-500"
          />
        </div>
        {/* Caption */}
        <div className="absolute bottom-2 left-0 right-0 text-center px-2">
          <span
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: '1.15rem',
              color: '#ff69b4',
              textShadow: '0 0 10px rgba(255,105,180,0.55)',
            }}
          >
            {caption}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────────────
function HeartDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-4">
      <div className="h-px w-20 md:w-36" style={{ background: 'linear-gradient(to right, transparent, rgba(255,20,147,0.55))' }} />
      <svg width="12" height="12" viewBox="0 0 24 24">
        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#ff69b4" />
      </svg>
      <div className="h-px w-20 md:w-36" style={{ background: 'linear-gradient(to left, transparent, rgba(255,20,147,0.55))' }} />
    </div>
  )
}

// ── StarRow ───────────────────────────────────────────────────────
function StarRow({ count = 3, color = '#ffd700', baseDelay = 0 }: { count?: number; color?: string; baseDelay?: number }) {
  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" style={{ animation: `sparkle 2.4s ${baseDelay + i * 0.5}s ease-in-out infinite` }}>
          <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.62 20L12 17.27L7.38 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" fill={color} />
        </svg>
      ))}
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────
function LoveLetter() {
  return (
    <section className="relative px-4 py-16 md:py-24" style={{ zIndex: 10 }}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-1">
          <span style={{ color: '#ff1493' }}>♥</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#ffd0e5', fontSize: 'clamp(1.5rem, 4vw, 2.35rem)', textShadow: '0 0 15px rgba(255,20,147,0.4)' }}>
            {LOVE_LETTER.title}
          </h2>
          <span style={{ color: '#ff1493' }}>♥</span>
        </div>
        <p className="mb-6" style={{ color: '#c989a8', fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem', letterSpacing: '0.08em' }}>
          {LOVE_LETTER.subtitle}
        </p>
        <article className="love-letter relative overflow-hidden px-7 py-10 md:px-16 md:py-12">
          <span className="absolute top-4 left-5 text-3xl" style={{ color: 'rgba(255,20,147,0.65)' }}>♡</span>
          <span className="absolute top-4 right-5 text-3xl" style={{ color: 'rgba(255,20,147,0.65)' }}>♡</span>
          <div className="relative">
            <p className="mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#ffd2e5', fontStyle: 'italic', fontSize: '1rem' }}>{LOVE_LETTER.greeting}</p>
            <div className="space-y-1" style={{ fontFamily: "'Playfair Display', serif", color: '#f1c1d7', fontStyle: 'italic', lineHeight: 1.7, fontSize: 'clamp(0.88rem, 2vw, 1rem)' }}>
              {LOVE_LETTER.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            <p className="mt-6" style={{ fontFamily: "'Great Vibes', cursive", color: '#ff4da0', fontSize: 'clamp(1.55rem, 4vw, 2rem)', textShadow: '0 0 14px rgba(255,20,147,0.45)' }}>{LOVE_LETTER.closing}</p>
            <p className="mt-3 whitespace-pre-line" style={{ fontFamily: "'Great Vibes', cursive", color: '#e67bac', fontSize: '1.45rem', lineHeight: 1.15 }}>{LOVE_LETTER.signature}</p>
          </div>
        </article>
        <div className="mt-4 flex items-center justify-center gap-3" style={{ color: '#b83c72' }}>
          <span className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #b83c72)' }} />
          <span>♥</span>
          <span className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, #b83c72)' }} />
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [vaultInput, setVaultInput] = useState('')
  const [vaultState, setVaultState] = useState<'idle' | 'error' | 'success'>('idle')
  const [burst, setBurst] = useState<ConfettiBurstPiece[]>([])
  const [wishText, setWishText] = useState('')
  const [wishSent, setWishSent] = useState(false)
  const [wishFlying, setWishFlying] = useState(false)
  const [wishSendError, setWishSendError] = useState('')
  const [musicOn, setMusicOn] = useState(false)

  const vaultRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const errorTimerRef = useRef<number | undefined>(undefined)
  const burstTimerRef = useRef<number | undefined>(undefined)
  const scrollTimerRef = useRef<number | undefined>(undefined)
  const wishFlightTimerRef = useRef<number | undefined>(undefined)
  const wishResetTimerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => {
      window.clearTimeout(errorTimerRef.current)
      window.clearTimeout(burstTimerRef.current)
      window.clearTimeout(scrollTimerRef.current)
      window.clearTimeout(wishFlightTimerRef.current)
      window.clearTimeout(wishResetTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const syncPlaying = () => setMusicOn(true)
    const syncPaused = () => setMusicOn(false)
    const tryAutoplay = () => {
      audio.play().catch(() => {
        // Most browsers require a user interaction before audible playback.
        setMusicOn(false)
      })
    }

    audio.addEventListener('play', syncPlaying)
    audio.addEventListener('pause', syncPaused)
    tryAutoplay()

    return () => {
      audio.removeEventListener('play', syncPlaying)
      audio.removeEventListener('pause', syncPaused)
    }
  }, [])

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      audio.play().catch(() => setMusicOn(false))
    } else {
      audio.pause()
    }
  }, [])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^\d]/g, '')
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2)
    if (v.length > 5) v = v.slice(0, 5) + '/' + v.slice(5)
    setVaultInput(v.slice(0, 10))
    setVaultState('idle')
  }

  const handleUnlock = useCallback(() => {
    if (vaultInput === SECRET_DATE) {
      window.clearTimeout(errorTimerRef.current)
      window.clearTimeout(burstTimerRef.current)
      window.clearTimeout(scrollTimerRef.current)
      setVaultState('success')
      setBurst(makeConfettiBurst())
      burstTimerRef.current = window.setTimeout(() => setBurst([]), 2600)
      scrollTimerRef.current = window.setTimeout(
        () => galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        650,
      )
    } else {
      setVaultState('error')
      window.clearTimeout(errorTimerRef.current)
      errorTimerRef.current = window.setTimeout(() => setVaultState('idle'), 1600)
    }
  }, [vaultInput])

  const handleSendWish = useCallback(() => {
    if (!wishText.trim() || wishFlying) return
    const message = wishText.trim()
    window.clearTimeout(wishFlightTimerRef.current)
    window.clearTimeout(wishResetTimerRef.current)
    setWishSendError('')
    setWishFlying(true)

    // Apps Script returns through a redirected URL, so this is intentionally
    // a no-cors request. The message still reaches doPost(e) in Apps Script.
    void fetch(MESSAGE_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ message, sentAt: new Date().toISOString() }),
    }).catch(() => {
      window.clearTimeout(wishFlightTimerRef.current)
      window.clearTimeout(wishResetTimerRef.current)
      setWishFlying(false)
      setWishSendError('Pesan belum terkirim. Periksa koneksi internet lalu coba lagi.')
    })

    wishFlightTimerRef.current = window.setTimeout(() => {
      setWishFlying(false)
      setWishSent(true)
      setWishText('')
    }, 3100)
    wishResetTimerRef.current = window.setTimeout(() => setWishSent(false), 6300)
  }, [wishText, wishFlying])

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ backgroundColor: '#07000f', fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Ambient layers */}
      <HeartParticles />
      <AmbientConfetti />
      <StarAccents />
      <audio ref={audioRef} src={MUSIC_SRC} autoPlay loop preload="auto" />

      {/* Music note — top right */}
      <button
        onClick={toggleMusic}
        className="fixed top-5 right-5 p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          zIndex: 50,
          background: 'rgba(255,20,147,0.1)',
          border: '1px solid rgba(255,20,147,0.45)',
          animation: 'glowPulse 2.2s ease-in-out infinite',
          boxShadow: musicOn
            ? '0 0 24px rgba(255,20,147,0.7), 0 0 48px rgba(255,20,147,0.35)'
            : undefined,
        }}
        aria-label={musicOn ? 'Pause music' : 'Play music'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={musicOn ? '#ffd700' : '#ff69b4'} strokeWidth="2" strokeLinecap="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </button>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center" style={{ zIndex: 10 }}>
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 30%, rgba(255,20,147,0.11) 0%, transparent 70%)' }}
        />

        {/* Happy Birthday */}
        <h1
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: 'clamp(3.5rem, 10vw, 7.5rem)',
            lineHeight: 1.1,
            color: '#ff1493',
            textShadow: '0 0 30px #ff1493, 0 0 65px #ff0080, 0 0 110px rgba(255,0,128,0.4)',
            animation: 'fadeSlideUp 0.9s ease-out both',
          }}
        >
          Happy Birthday
        </h1>

        {/* Name */}
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.9rem, 5vw, 3.6rem)',
            fontStyle: 'italic',
            color: '#ffd700',
            textShadow: '0 0 22px rgba(255,215,0,0.65), 0 0 44px rgba(255,215,0,0.28)',
            letterSpacing: '0.07em',
            marginBottom: '1.6rem',
            animation: 'fadeSlideUp 0.9s 0.18s ease-out both',
          }}
        >
          My Darling
        </h2>

        {/* Divider */}
        <div style={{ animation: 'fadeSlideUp 0.9s 0.3s ease-out both' }}>
          <HeartDivider />
        </div>

        {/* Cake */}
        <div style={{ animation: 'fadeSlideUp 0.9s 0.42s ease-out both', marginTop: '1rem', marginBottom: '0.5rem' }}>
          <BirthdayCake />
        </div>

        {/* Romantic text */}
        <div
          className="max-w-lg mx-auto mt-4 mb-10 px-4"
          style={{ animation: 'fadeSlideUp 0.9s 0.58s ease-out both' }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(0.88rem, 2vw, 1.08rem)',
              fontStyle: 'italic',
              color: '#ffb3d9',
              lineHeight: 1.9,
              textShadow: '0 0 12px rgba(255,100,180,0.28)',
            }}
          >
            Thank you for being my happiness, my love, and my everything...
          </p>
          <p
            className="mt-3"
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)',
              color: '#ff69b4',
              textShadow: '0 0 18px rgba(255,105,180,0.6)',
            }}
          >
            Forever Yours, My Love
          </p>
        </div>

        {/* CTA */}
        <div style={{ animation: 'fadeSlideUp 0.9s 0.74s ease-out both' }}>
          <button
            onClick={() => vaultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="relative px-9 py-4 text-white font-medium uppercase tracking-widest text-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:brightness-125"
            style={{
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.22em',
              background: 'linear-gradient(135deg, rgba(255,20,147,0.22), rgba(255,0,128,0.1))',
              border: '1px solid rgba(255,20,147,0.7)',
              boxShadow: '0 0 22px rgba(255,20,147,0.42), 0 0 44px rgba(255,20,147,0.18), inset 0 0 22px rgba(255,20,147,0.06)',
            }}
          >
            <span style={{ textShadow: '0 0 12px rgba(255,20,147,0.9)' }}>✦ Unfold Memories ✦</span>
          </button>
        </div>
      </section>

      {/* ── Vault Section ── */}
      <LoveLetter />

      <section
        ref={vaultRef}
        className="relative py-24 px-4"
        style={{ zIndex: 10 }}
      >
        <div className="max-w-lg mx-auto text-center relative">
          <div
            className="relative p-8 md:p-12"
            style={{
              border: '1px solid rgba(255,20,147,0.28)',
              background: 'rgba(255,20,147,0.04)',
              boxShadow: '0 0 50px rgba(255,20,147,0.07)',
            }}
          >
            {/* Corner brackets */}
            {[
              { pos: 'top-0 left-0', d: 'M0 10 L0 0 L10 0' },
              { pos: 'top-0 right-0', d: 'M16 10 L16 0 L6 0' },
              { pos: 'bottom-0 left-0', d: 'M0 6 L0 16 L10 16' },
              { pos: 'bottom-0 right-0', d: 'M16 6 L16 16 L6 16' },
            ].map((c, i) => (
              <div key={i} className={`absolute ${c.pos} p-1`}>
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d={c.d} stroke="#ff1493" strokeWidth="1.5" fill="none" strokeOpacity="0.65" />
                </svg>
              </div>
            ))}

            {/* Lock / check icon */}
            <div className="flex justify-center mb-6">
              <div
                className="p-4 rounded-full transition-all duration-500"
                style={{
                  background: 'rgba(255,20,147,0.1)',
                  border: '1px solid rgba(255,20,147,0.45)',
                  boxShadow: vaultState === 'success'
                    ? '0 0 35px rgba(255,20,147,0.65), 0 0 70px rgba(255,20,147,0.28)'
                    : '0 0 16px rgba(255,20,147,0.2)',
                }}
              >
                {vaultState === 'success' ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff69b4" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}
              </div>
            </div>

            {vaultState !== 'success' ? (
              <>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(1.3rem, 3.5vw, 1.85rem)',
                    color: '#fff',
                    marginBottom: '0.4rem',
                    textShadow: '0 0 12px rgba(255,255,255,0.18)',
                  }}
                >
                  Unlock Memories
                </h2>
                <p style={{ color: '#ff8cb4', fontSize: '0.88rem', marginBottom: '2rem', fontFamily: "'Outfit', sans-serif" }}>
                  Celebrating The Girl Who Changed My World
                </p>

                {/* Date input */}
                <div className="relative mb-3">
                  <input
                    type="text"
                    value={vaultInput}
                    onChange={handleDateChange}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleUnlock()
                      }
                    }}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-6 py-4 text-center bg-transparent outline-none text-white text-lg tracking-widest transition-all duration-300"
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      letterSpacing: '0.26em',
                      border: `1px solid ${vaultState === 'error' ? 'rgba(255,60,60,0.75)' : 'rgba(255,20,147,0.42)'}`,
                      boxShadow: vaultState === 'error'
                        ? '0 0 22px rgba(255,60,60,0.3), inset 0 0 18px rgba(255,60,60,0.05)'
                        : '0 0 18px rgba(255,20,147,0.1), inset 0 0 18px rgba(255,20,147,0.03)',
                    }}
                  />
                </div>

                {vaultState === 'error' && (
                  <p className="text-sm mb-3" style={{ color: '#ff6666', fontFamily: "'Outfit', sans-serif", animation: 'fadeSlideUp 0.3s ease-out' }}>
                    That's not our special date, my love...
                  </p>
                )}

                <p className="text-xs mb-6" style={{ color: 'rgba(255,105,180,0.38)', fontFamily: "'Outfit', sans-serif" }}>
                  Hint: The day we became one ✦ 30/09/2026
                </p>

                <button
                  onClick={handleUnlock}
                  className="w-full py-4 font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:brightness-125"
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: '0.16em',
                    fontSize: '0.88rem',
                    color: '#fff',
                    background: 'linear-gradient(135deg, rgba(255,20,147,0.28), rgba(200,0,100,0.18))',
                    border: '1px solid rgba(255,20,147,0.62)',
                    boxShadow: '0 0 26px rgba(255,20,147,0.3)',
                    textShadow: '0 0 10px rgba(255,20,147,0.6)',
                  }}
                >
                  UNLOCK ✦
                </button>
              </>
            ) : (
              <div style={{ animation: 'fadeSlideUp 0.5s ease-out both' }}>
                <p
                  style={{
                    fontFamily: "'Great Vibes', cursive",
                    fontSize: '2.6rem',
                    color: '#ffd700',
                    textShadow: '0 0 22px rgba(255,215,0,0.6)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Our memories await...
                </p>
                <p style={{ color: '#ff8cb4', fontSize: '0.88rem', fontFamily: "'Outfit', sans-serif" }}>
                  Scroll down to relive them ✦
                </p>
              </div>
            )}
          </div>

          {/* Confetti burst overlay */}
          <ConfettiBurst pieces={burst} />
        </div>
      </section>

      {/* ── Gallery Section ── */}
      <section
        ref={galleryRef}
        className="relative py-16 px-4 transition-all duration-700"
        style={{
          zIndex: 10,
          opacity: vaultState === 'success' ? 1 : 0.1,
          filter: vaultState === 'success' ? 'none' : 'blur(6px)',
          pointerEvents: vaultState === 'success' ? 'auto' : 'none',
          transition: 'opacity 0.8s ease, filter 0.8s ease',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.8rem, 4.5vw, 2.9rem)',
                color: '#fff',
                textShadow: '0 0 18px rgba(255,255,255,0.1)',
                marginBottom: '0.25rem',
              }}
            >
              Our{' '}
              <span style={{ color: '#ff69b4', textShadow: '0 0 16px rgba(255,105,180,0.65)' }}>
                Gallery
              </span>
            </h2>
            <HeartDivider />
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {PHOTOS.map((p, i) => (
              <PolaroidCard key={p.id} src={p.src} alt={p.alt} caption={p.caption} delay={i * 0.16} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Message Section ── */}
      <section className="relative py-24 px-4" style={{ zIndex: 10 }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 40% at 50% 50%, rgba(255,215,0,0.048) 0%, transparent 70%)' }}
        />
        <div className="max-w-2xl mx-auto text-center relative">
          {/* Stars row */}
          <StarRow count={3} color="#ffd700" baseDelay={0} />

          {/* Make a Wish */}
          <h2
            className="my-3"
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: 'clamp(3rem, 7.5vw, 5.2rem)',
              color: '#ffd700',
              textShadow: '0 0 32px rgba(255,215,0,0.52), 0 0 65px rgba(255,215,0,0.2)',
              lineHeight: 1,
            }}
          >
            Make a Wish
          </h2>

          <StarRow count={3} color="#ffd700" baseDelay={1} />

          {/* Small heart accents */}
          <div className="flex justify-center gap-2 mt-4 mb-8">
            {[0, 0.35, 0.7].map((d, i) => (
              <svg key={i} width="10" height="10" viewBox="0 0 24 24" style={{ animation: `sparkle 2s ${d}s ease-in-out infinite` }}>
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#ff69b4" opacity="0.65" />
              </svg>
            ))}
          </div>

          {/* Textarea */}
          {!wishSent && (
          <div className={`wish-paper relative mb-7 ${wishFlying ? 'wish-paper-flying' : ''}`}>
            <textarea
              value={wishText}
              onChange={e => setWishText(e.target.value)}
              disabled={wishFlying}
              placeholder="Write your messages and wishes here..."
              rows={5}
              className="w-full px-6 py-5 bg-transparent outline-none text-white resize-none text-base leading-relaxed transition-all duration-300"
              style={{
                fontFamily: "'Outfit', sans-serif",
                border: '1px solid rgba(255,215,0,0.32)',
                boxShadow: wishText
                  ? '0 0 28px rgba(255,215,0,0.16), inset 0 0 22px rgba(255,215,0,0.04)'
                  : '0 0 14px rgba(255,215,0,0.07)',
                background: 'rgba(255,215,0,0.026)',
              }}
              onFocus={e => {
                e.currentTarget.style.border = '1px solid rgba(255,215,0,0.65)'
                e.currentTarget.style.boxShadow = '0 0 32px rgba(255,215,0,0.22), inset 0 0 22px rgba(255,215,0,0.05)'
              }}
              onBlur={e => {
                e.currentTarget.style.border = '1px solid rgba(255,215,0,0.32)'
                e.currentTarget.style.boxShadow = wishText ? '0 0 28px rgba(255,215,0,0.16)' : '0 0 14px rgba(255,215,0,0.07)'
              }}
            />
            {!wishText && (
              <div className="absolute right-4 bottom-4 pointer-events-none" style={{ opacity: 0.28 }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.62 20L12 17.27L7.38 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" fill="#ffd700" />
                </svg>
              </div>
            )}
          </div>
          )}

          {/* Send / Sent */}
          {!wishSent && !wishFlying ? (
            <>
              <button
                onClick={handleSendWish}
                disabled={!wishText.trim()}
                className="flex items-center gap-3 mx-auto px-10 py-4 font-medium transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: '0.13em',
                  fontSize: '0.9rem',
                  color: '#ffd700',
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(180,120,0,0.08))',
                  border: '1px solid rgba(255,215,0,0.52)',
                  boxShadow: wishText.trim()
                    ? '0 0 26px rgba(255,215,0,0.32), inset 0 0 18px rgba(255,215,0,0.05)'
                    : 'none',
                  textShadow: wishText.trim() ? '0 0 10px rgba(255,215,0,0.5)' : 'none',
                }}
              >
                {/* Paper plane icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <span>Send Message</span>
              </button>
              {wishSendError && <p className="mt-3 text-sm" style={{ color: '#ff7777' }}>{wishSendError}</p>}
            </>
          ) : (
            <div
              className="flex flex-col items-center gap-2"
              style={{ animation: 'fadeSlideUp 0.4s ease-out both' }}
            >
              <div className="flex gap-2 mb-1">
                {[0, 0.2, 0.4].map((d, i) => (
                  <svg key={i} width="15" height="15" viewBox="0 0 24 24" style={{ animation: `sparkle 0.7s ${d}s ease-in-out 4` }}>
                    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#ff69b4" />
                  </svg>
                ))}
              </div>
              <p
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: '1.9rem',
                  color: '#ff69b4',
                  textShadow: '0 0 16px rgba(255,105,180,0.55)',
                }}
              >
                Wish sent with love!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-10 text-center relative"
        style={{ borderTop: '1px solid rgba(255,20,147,0.1)', zIndex: 10 }}
      >
        <p
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: '1.5rem',
            color: 'rgba(255,105,180,0.42)',
            textShadow: '0 0 10px rgba(255,105,180,0.18)',
          }}
        >
          Made with ♥ for you, always.
        </p>
      </footer>
    </div>
  )
}
