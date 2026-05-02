/* global React */
// Riso Punk — shared tokens, helpers, doodles, base UI for the workflow automation site.

const RP = {
  // Palette — masculine riso: steel blue, oxblood, brass, hunter, rust
  bg: '#e7e1d3',
  bgDark: '#141210',
  paper: '#f6f0e1',
  paperDark: '#1c1a16',
  ink: '#0f0d0b',
  inkDark: '#ece5d0',
  blue: '#1f3a8a',      // steel / navy
  pink: '#8a2a2a',      // oxblood (replaces hot pink)
  yellow: '#c69a2c',    // brass (replaces fluoro yellow)
  green: '#3a5a3a',     // hunter
  orange: '#a84a1f',    // rust
  // Fonts
  display: '"Archivo Black", "Helvetica Neue", sans-serif',
  body: '"Inter", "Helvetica Neue", sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  hand: '"Caveat", "Comic Sans MS", cursive',
};

// ─── Doodles ──────────────────────────────────────────────────────
const Arrow = ({ color = '#111', width = 60, height = 30, strokeWidth = 2, rotate = 0, style = {} }) => (
  <svg width={width} height={height} viewBox="0 0 60 30" style={{ display: 'block', transform: `rotate(${rotate}deg)`, ...style }}>
    <path d="M4 20 Q 20 4, 40 14 T 54 18 M 48 12 L 54 18 L 47 21" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CircleMark = ({ color = '#111', size = 80, strokeWidth = 3, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: 'block', ...style }}>
    <ellipse cx="40" cy="40" rx="35" ry="32" fill="none" stroke={color} strokeWidth={strokeWidth} transform="rotate(-8 40 40)" strokeDasharray="1 0" />
  </svg>
);

const Burst = ({ color = '#111', size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: 'block' }}>
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * Math.PI * 2) / 12;
      return <line key={i} x1={30 + Math.cos(a) * 12} y1={30 + Math.sin(a) * 12} x2={30 + Math.cos(a) * 26} y2={30 + Math.sin(a) * 26} stroke={color} strokeWidth="2.5" strokeLinecap="round" />;
    })}
  </svg>
);

const StarDoodle = ({ color = '#111', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M20 3 L23 15 L35 16 L26 24 L29 36 L20 29 L11 36 L14 24 L5 16 L17 15 Z" fill={color} />
  </svg>
);

const Underline = ({ color = '#111', width = 200, strokeWidth = 3, style = {} }) => (
  <svg width={width} height={14} viewBox="0 0 200 14" style={{ display: 'block', ...style }}>
    <path d="M4 9 Q 50 2, 100 7 T 196 8" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

const Tape = ({ color = 'rgba(255,210,63,0.72)', width = 80, rotate = -4, top, left, right, bottom, zIndex = 10 }) => (
  <div style={{
    position: 'absolute', top, left, right, bottom,
    width, height: 22,
    background: color,
    transform: `rotate(${rotate}deg)`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    zIndex,
  }} />
);

const Grain = ({ opacity = 0.1 }) => (
  <div style={{
    position: 'absolute', inset: 0, pointerEvents: 'none',
    opacity, mixBlendMode: 'multiply',
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  }} />
);

// Hard-shadow chunky button / chip
const Chip = ({ children, color = RP.yellow, onClick, size = 'md', style = {}, as = 'div' }) => {
  const Tag = as;
  const pad = size === 'lg' ? '12px 22px' : size === 'sm' ? '8px 12px' : '10px 16px';
  const fs = size === 'lg' ? 13 : size === 'sm' ? 10 : 11;
  return (
    <Tag onClick={onClick} style={{
      display: 'inline-block', background: color, color: 'var(--rp-ink)',
      padding: pad, border: '2px solid var(--rp-ink)',
      boxShadow: '3px 3px 0 var(--rp-ink)',
      fontFamily: RP.mono, fontSize: fs, letterSpacing: 1.5,
      lineHeight: 1.35,
      textTransform: 'uppercase', cursor: onClick ? 'pointer' : 'default',
      userSelect: 'none',
      ...style,
    }}>{children}</Tag>
  );
};

// Risograph-style color block behind content (mix-blend-multiply)
const InkBlock = ({ color, width, height, top, left, right, bottom, rotate = 0, zIndex = 0, radius = 0, opacity = 1, style = {} }) => (
  <div style={{
    position: 'absolute', top, left, right, bottom,
    width, height, background: color,
    mixBlendMode: 'multiply',
    transform: `rotate(${rotate}deg)`,
    borderRadius: radius,
    opacity,
    zIndex,
    ...style,
  }} />
);

// Hand-written annotation — text plus arrow
const HandNote = ({ children, color = RP.blue, fontSize = 22, maxWidth = 200, style = {}, arrow = null }) => (
  <div style={{
    fontFamily: RP.hand, fontSize, color, maxWidth, lineHeight: 1.1,
    ...style,
  }}>
    {children}
    {arrow && <div style={{ marginTop: 6 }}><Arrow color={color} width={arrow.width || 70} height={arrow.height || 30} strokeWidth={2.5} rotate={arrow.rotate || 0} /></div>}
  </div>
);

Object.assign(window, { RP, Arrow, CircleMark, Burst, StarDoodle, Underline, Tape, Grain, Chip, InkBlock, HandNote });
