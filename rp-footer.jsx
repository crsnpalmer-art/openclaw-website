/* global React, RP, Chip, Grain, InkBlock */
// Colophon + TOC + Tweaks

function TOC() {
  const items = [
    { id: 'workflow', label: '§01 Model' },
    { id: 'workflow-images', label: '§02 Paths' },
    { id: 'scheduler', label: '§03 Scheduler' },
    { id: 'sarah', label: '§04 Sarah' },
    { id: 'services', label: '§05 Services' },
    { id: 'graph', label: '§06 Wiring' },
    { id: 'apps', label: '§07 Apps' },
    { id: 'footer', label: '§08 Colophon' },
  ];
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const h = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', h); h();
    return () => window.removeEventListener('scroll', h);
  }, []);
  if (!show) return null;
  return (
    <nav className="mobile-hide" style={{
      position: 'fixed', top: 16, right: 16, zIndex: 50,
      background: 'var(--rp-paper)', border: '2.5px solid var(--rp-ink)',
      boxShadow: '4px 4px 0 var(--rp-ink)', padding: '10px 14px',
      display: 'grid', gap: 3, maxWidth: 220,
    }}>
      <div style={{ fontFamily: RP.mono, fontSize: 9, letterSpacing: 2, opacity: 0.55, marginBottom: 4 }}>INDEX</div>
      {items.map(i => (
        <a key={i.id} href={`#${i.id}`} style={{
          fontFamily: RP.mono, fontSize: 10.5, letterSpacing: 1, color: 'var(--rp-ink)',
          textDecoration: 'none', padding: '3px 0',
        }}>{i.label}</a>
      ))}
    </nav>
  );
}

function Footer() {
  return (
    <section id="footer" data-screen-label="07 Colophon" style={{
      position: 'relative', padding: '80px 56px 50px', overflow: 'hidden',
      background: 'var(--rp-paper)',
    }}>
      <Grain opacity={0.06} />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          paddingBottom: 14, borderBottom: '2px solid var(--rp-ink)', marginBottom: 40,
          fontFamily: RP.mono, fontSize: 10, letterSpacing: 2.4, textTransform: 'uppercase',
          flexWrap: 'wrap', gap: 10,
        }}>
          <span style={{ fontWeight: 700 }}>Colophon</span>
          <span style={{ color: 'var(--rp-muted)' }}>Public playbook map</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28, alignItems: 'start', maxWidth: 840 }}>
          <div>
            <h2 style={{
              margin: 0, fontSize: 'clamp(42px, 6vw, 76px)', lineHeight: 0.9,
              fontWeight: 900, letterSpacing: -2.5, textTransform: 'uppercase',
              fontFamily: RP.display,
            }}>
              That's the playbook.
            </h2>
            <p style={{ margin: '24px 0 0', fontSize: 18, lineHeight: 1.5, fontFamily: RP.body, maxWidth: '58ch' }}>
              This page documents a workflow automation pattern using property management,
              leasing workflows, reviews, reminders, and voice intake as the working example.
            </p>
            <p style={{ margin: '14px 0 0', fontSize: 18, lineHeight: 1.5, fontFamily: RP.body, maxWidth: '58ch' }}>
              The page is intentionally honest about scope. It is not trying to look like a generic AI platform.
              It is showing one practical operating loop and one clear design bias: keep the workflow useful,
              local, understandable, inspectable, and hard to break.
            </p>
            <p style={{ margin: '14px 0 0', fontSize: 15, lineHeight: 1.55, fontFamily: RP.body, color: 'var(--rp-muted)', maxWidth: '58ch' }}>
              The public version keeps the structure and removes the inventory: no secrets, no private routing,
              no internal identifiers — publish-safe by construction.
            </p>

            <div style={{ marginTop: 24, paddingTop: 14, borderTop: '1.5px solid rgba(15,13,11,0.28)', fontFamily: RP.mono, fontSize: 10.5, letterSpacing: 1.4, color: 'var(--rp-muted)', textTransform: 'uppercase' }}>
              Public-safe summary · private inventory removed
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 44, paddingTop: 14, borderTop: '1.5px solid rgba(15,13,11,0.28)',
          display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
          fontFamily: RP.mono, fontSize: 10.5, letterSpacing: 2, textTransform: 'uppercase',
        }}>
          <span>© 2026 · Workflow Automation Playbook</span>
          <span style={{ color: 'var(--rp-muted)' }}>Still running local</span>
        </div>
      </div>
    </section>
  );
}

function TweaksPanel({ config, setConfig, onClose }) {
  const set = (k, v) => setConfig({ ...config, [k]: v });
  const accentOptions = [
    { name: 'ironwork', blue: '#1f3a8a', pink: '#8a2a2a', yellow: '#c69a2c' },
    { name: 'workshop', blue: '#2c4a3a', pink: '#8a4a1a', yellow: '#b08a3a' },
    { name: 'dispatch', blue: '#1a2a4a', pink: '#6a2a2a', yellow: '#b0894a' },
    { name: 'blueprint', blue: '#102a54', pink: '#7a3020', yellow: '#8a6a2a' },
  ];
  const fontOptions = [
    { name: 'archivo+inter' },
    { name: 'space+space' },
    { name: 'syne+inter' },
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 16, right: 16, zIndex: 100, width: 280,
      background: 'var(--rp-paper)', border: '3px solid var(--rp-ink)',
      boxShadow: '6px 6px 0 var(--rp-ink)', padding: 18,
      fontFamily: RP.body, color: 'var(--rp-ink)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: RP.display, fontSize: 20, textTransform: 'uppercase', letterSpacing: -0.5 }}>Tweaks</div>
        <button onClick={onClose} style={{ border: '2px solid var(--rp-ink)', background: 'var(--rp-bg)', width: 26, height: 26, fontFamily: RP.mono, cursor: 'pointer' }}>×</button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: RP.mono, fontSize: 9, letterSpacing: 2, opacity: 0.6, marginBottom: 6 }}>ACCENT</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {accentOptions.map(a => (
            <button key={a.name} onClick={() => set('accents', a.name)} style={{
              width: 54, height: 28, border: config.accents === a.name ? '2.5px solid var(--rp-ink)' : '2px solid rgba(17,17,17,0.25)',
              display: 'flex', cursor: 'pointer', padding: 0,
            }}>
              <div style={{ flex: 1, background: a.blue }}/>
              <div style={{ flex: 1, background: a.pink }}/>
              <div style={{ flex: 1, background: a.yellow }}/>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: RP.mono, fontSize: 9, letterSpacing: 2, opacity: 0.6, marginBottom: 6 }}>FONT PAIRING</div>
        <select value={config.fonts} onChange={(e) => set('fonts', e.target.value)} style={{
          width: '100%', padding: '6px 8px', border: '2px solid var(--rp-ink)',
          background: 'var(--rp-bg)', color: 'var(--rp-ink)', fontFamily: RP.mono, fontSize: 11,
        }}>
          {fontOptions.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: RP.mono, fontSize: 9, letterSpacing: 2, opacity: 0.6, marginBottom: 6 }}>DENSITY</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['compact', 'standard', 'spacious'].map(d => (
            <button key={d} onClick={() => set('density', d)} style={{
              flex: 1, padding: '6px 4px',
              border: '2px solid var(--rp-ink)',
              background: config.density === d ? RP.yellow : 'var(--rp-bg)',
              fontFamily: RP.mono, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer',
              color: 'var(--rp-ink)',
            }}>{d}</button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontFamily: RP.mono, fontSize: 9, letterSpacing: 2, opacity: 0.6, marginBottom: 6 }}>MODE</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['light', 'dark'].map(m => (
            <button key={m} onClick={() => set('mode', m)} style={{
              flex: 1, padding: '6px 4px',
              border: '2px solid var(--rp-ink)',
              background: config.mode === m ? RP.blue : 'var(--rp-bg)',
              color: config.mode === m ? '#fff' : 'var(--rp-ink)',
              fontFamily: RP.mono, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer',
            }}>{m}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TOC, Footer, TweaksPanel });
