/* global React, RP, Chip, Tape, HandNote, InkBlock, Grain */
// Consumer-surface products riding on top of the workflow automation system

const APPS = [
  {
    id: 'tpt',
    kicker: 'iOS · Free · No ads',
    name: 'Transfer Portal Tracker',
    tagline: 'A live feed for NCAA football transfer portal entries and commits.',
    pitch: 'Push-first, ad-free, updated the moment a player enters or commits. One list, one ping per move, no slideshow.',
    color: RP.blue,
    accent: RP.yellow,
    facets: [
      ['Platform', 'iOS'],
      ['Price', '$0 · no ads'],
      ['Cadence', 'Nightly builds'],
    ],
    features: [
      'Real-time entries, commits, and decommits',
      'Filter by position, school, class, conference',
      'Push alerts for followed players + schools',
      'Built solo · shipping updates almost nightly',
    ],
  },
  {
    id: 'hf',
    kicker: 'habitforgeai.com · Web + iOS · Ember coach',
    name: 'HabitForge',
    tagline: 'Habit tracking across Mental, Physical, Spiritual, and Financial.',
    pitch: 'Four-pillar habit system with Ember, an in-app coach that shapes weekly plans, runs check-ins, and helps users recover rhythm without pressure mechanics. Firebase-backed, cross-device, widget-first.',
    color: RP.pink,
    accent: RP.green,
    facets: [
      ['Pillars', '4 — MPSF'],
      ['Coach', 'Ember (in-app)'],
      ['Stack', 'Firebase · iOS · Web'],
    ],
    features: [
      'Pillar-balanced weekly plans, not checklist sprawl',
      'Ember turns goals into concrete daily habits',
      'Apple / Google / email sign-in with cloud sync',
      'iOS widgets surface today\'s habits on the lock screen',
    ],
  },
  {
    id: 'kyh',
    kicker: 'Tenant portal · 4 properties + storage',
    name: 'KnowYourHome',
    tagline: 'A per-unit tenant guide, one page per property.',
    pitch: 'Move-in material for Pinnacle Park, First & Main, The Station, Forest Lake, and storage: quirks, how-tos, trash schedule, one-tap maintenance. Sarah answers the phone; KnowYourHome answers everything else.',
    color: RP.green,
    accent: RP.orange,
    facets: [
      ['Properties', '4 + storage'],
      ['Surface', 'Mobile-first'],
      ['Handoff', '→ Eddie Morra'],
    ],
    features: [
      'Per-unit guide authored once, versioned with the KB',
      'Move-in + move-out checklists',
      'How-tos: thermostat, trash, wifi, AC filters',
      'Maintenance requests route into the work-order lane',
    ],
  },
];

function AppCard({ app, index }) {
  const flip = index % 2 === 1;
  return (
    <article style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40,
      alignItems: 'start', marginBottom: 72,
      direction: flip ? 'rtl' : 'ltr',
    }}>
      <div style={{ direction: 'ltr' }}>
        <Chip color={app.accent} size="sm" style={{ transform: 'rotate(-1.5deg)', marginBottom: 14 }}>
          № 0{index + 1} — {app.kicker}
        </Chip>
        <h3 style={{
          margin: 0, fontSize: 'clamp(40px, 5.5vw, 72px)', lineHeight: 0.9,
          fontWeight: 900, letterSpacing: -2.5, textTransform: 'uppercase',
          fontFamily: RP.display,
        }}>
          {app.name}
        </h3>
        <div style={{ fontFamily: RP.body, fontStyle: 'italic', fontSize: 20, color: app.color, marginTop: 10, maxWidth: '34ch', lineHeight: 1.35 }}>
          {app.tagline}
        </div>
        <p style={{ margin: '16px 0 0', fontFamily: RP.body, fontSize: 16, lineHeight: 1.6, maxWidth: '58ch' }}>
          {app.pitch}
        </p>
        <ul style={{ margin: '20px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {app.features.map((f, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, fontFamily: RP.body, fontSize: 14, alignItems: 'flex-start' }}>
              <span style={{ width: 14, height: 14, background: app.color, flexShrink: 0, marginTop: 4, border: '2px solid var(--rp-ink)' }}/>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ direction: 'ltr' }}>
        <div style={{
          background: 'var(--rp-paper)', border: '3px solid var(--rp-ink)',
          boxShadow: '6px 6px 0 var(--rp-ink)', padding: '18px 20px',
          transform: `rotate(${flip ? 0.8 : -0.8}deg)`, position: 'relative',
        }}>
          <div style={{
            fontFamily: RP.mono, fontSize: 10, letterSpacing: 2,
            color: app.color, textTransform: 'uppercase', marginBottom: 10,
            paddingBottom: 8, borderBottom: '1.5px dashed var(--rp-ink)',
          }}>
            Spec sheet
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {app.facets.map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 12, alignItems: 'baseline' }}>
                <span style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 1.5, color: 'var(--rp-muted)', textTransform: 'uppercase' }}>{k}</span>
                <span style={{ fontFamily: RP.body, fontSize: 14, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 14, paddingTop: 12, borderTop: '1.5px dashed var(--rp-ink)',
            fontFamily: RP.mono, fontSize: 10, letterSpacing: 1.4, color: 'var(--rp-muted)',
          }}>
            Built and maintained solo · shipped when it's ready.
          </div>
        </div>
      </div>
    </article>
  );
}

function Apps() {
  return (
    <section id="apps" data-screen-label="06 Apps" style={{
      position: 'relative', padding: '80px 48px',
      borderBottom: '3px solid var(--rp-ink)', overflow: 'hidden',
    }}>
      <Grain opacity={0.08} />
      <InkBlock color={RP.green} width={220} height={220} top={100} left={-60} radius="50%" opacity={0.14} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto' }}>
        <Chip color={RP.blue} size="md" style={{ transform: 'rotate(-2deg)', marginBottom: 16, color: '#fff' }}>
          § 06 — Products + interfaces
        </Chip>
        <h2 style={{
          margin: 0, fontSize: 'clamp(52px, 8vw, 108px)', lineHeight: 0.88,
          fontWeight: 900, letterSpacing: -4, textTransform: 'uppercase',
          fontFamily: RP.display,
        }}>
          What the system<br/>actually powers.
        </h2>
        <p style={{ margin: '20px 0 20px', fontSize: 17, fontFamily: RP.body, maxWidth: '62ch', color: 'var(--rp-ink)', lineHeight: 1.55 }}>
          This matters because the runtime is not the product. These are the things people actually touch.
        </p>
        <p style={{ margin: '0 0 56px', fontSize: 17, fontFamily: RP.body, maxWidth: '62ch', color: 'var(--rp-muted)', lineHeight: 1.55 }}>
          Transfer Portal Tracker and HabitForge are standalone customer products.
          KnowYourHome is the tenant-facing side of the same property operation shown above — same portfolio, opposite side of the phone.
        </p>

        {APPS.map((app, i) => (
          <AppCard key={app.id} app={app} index={i} />
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { Apps });
