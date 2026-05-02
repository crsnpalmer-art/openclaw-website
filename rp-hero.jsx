/* global React, RP, Grain, InkBlock */
// Hero — editorial, operational, not slogan-y

function Hero({ density }) {
  const pad = density === 'compact' ? 56 : density === 'spacious' ? 120 : 88;

  const quickLinks = [
    ['Start with the model', '#workflow'],
    ['Trace a workflow', '#workflow-images'],
    ['See voice intake', '#sarah'],
  ];

  const stats = [
    ['01', 'Input layer'],
    ['06', 'Operating lanes'],
    ['05', 'Reusable patterns'],
    ['04', 'Guardrail loops'],
    ['01', 'Human final owner'],
  ];

  return (
    <section data-screen-label="01 Hero" id="top" style={{
      position: 'relative', padding: `${pad}px clamp(20px, 5vw, 56px) ${pad - 16}px`,
      borderBottom: '3px solid var(--rp-ink)',
      overflow: 'hidden',
    }}>
      <Grain opacity={0.07} />
      <InkBlock color={RP.blue} width={220} height={220} top={pad - 24} right={80} radius="50%" opacity={0.14} />

      {/* Masthead bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        paddingBottom: 12, borderBottom: '1.5px solid rgba(15,13,11,0.35)', marginBottom: 36,
        fontFamily: RP.mono, fontSize: 10, letterSpacing: 2.4, textTransform: 'uppercase',
        position: 'relative', zIndex: 2, flexWrap: 'wrap', gap: 10,
      }}>
        <span style={{ fontWeight: 700 }}>Workflow Automation Playbook</span>
        <span style={{ color: 'var(--rp-muted)' }}>Public pattern map</span>
      </div>

      {/* Lede */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 56, alignItems: 'end',
        position: 'relative', zIndex: 2,
      }}>
        <div>
          <div style={{
            fontFamily: RP.mono, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase',
            color: RP.pink, marginBottom: 18,
          }}>
            Local-first automation · property ops · reusable patterns
          </div>

          <h1 style={{
            margin: 0, fontSize: 'clamp(68px, 10.5vw, 156px)', lineHeight: 0.84,
            fontWeight: 900, letterSpacing: -4, textTransform: 'uppercase',
            fontFamily: RP.display,
          }}>
            Workflow<br/>
            <span style={{ position: 'relative', display: 'inline-block' }}>
              Playbook
              <div style={{
                position: 'absolute', bottom: '8%', left: 0, right: 0, height: '14%',
                background: RP.pink, zIndex: -1, transform: 'skewX(-8deg)',
                mixBlendMode: 'multiply', opacity: 0.85,
              }} />
            </span>
          </h1>

          <p style={{
            marginTop: 28, fontSize: 22, lineHeight: 1.45, maxWidth: '38ch',
            fontFamily: RP.body, color: 'var(--rp-ink)', fontWeight: 600,
          }}>
            A reusable map for turning scattered work into a visible operating loop: inputs, routing, guardrails, verification, and human review.
          </p>

          <p style={{
            marginTop: 16, fontSize: 19, lineHeight: 1.5, maxWidth: '58ch',
            fontFamily: RP.body, color: 'var(--rp-ink)',
          }}>
            The example comes from property operations, but the shape is portable:
            inbox triage, customer-service intake, recurring reminders, task routing,
            review loops, and the exception cases that should never disappear into automation.
          </p>

          <p style={{
            marginTop: 16, fontSize: 18, lineHeight: 1.55, maxWidth: '58ch',
            fontFamily: RP.body, color: 'var(--rp-ink)',
          }}>
            This is not a pitch for a single tool. It is a pattern library for operators:
            keep automation visible, require approval for risky moves, and make boring work
            easy to inspect instead of easy to forget.
          </p>

          <p style={{
            marginTop: 16, fontSize: 16, lineHeight: 1.55, maxWidth: '58ch',
            fontFamily: RP.body, color: 'var(--rp-muted)',
          }}>
            Read it like a locker-room whiteboard. Take the parts that help, ignore the parts that
            are too specific, and rebuild the workflow around your own inputs and constraints.
          </p>

          <div style={{
            marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12,
          }}>
            {quickLinks.map(([label, href], i) => (
              <a key={href} href={href} style={{
                textDecoration: 'none', color: 'var(--rp-ink)',
                border: '2.5px solid var(--rp-ink)',
                background: i === 0 ? 'var(--rp-paper)' : 'transparent',
                boxShadow: i === 0 ? '4px 4px 0 var(--rp-ink)' : 'none',
                padding: '10px 14px', fontFamily: RP.mono, fontSize: 10.5,
                letterSpacing: 1.5, textTransform: 'uppercase',
              }}>
                {label} <span style={{ color: RP.pink }}>→</span>
              </a>
            ))}
          </div>

          <div style={{
            marginTop: 18, maxWidth: '58ch', padding: '14px 16px',
            border: '2px dashed var(--rp-ink)', background: 'rgba(255,255,255,0.28)',
            fontFamily: RP.body, fontSize: 15, lineHeight: 1.55, color: 'var(--rp-muted)',
          }}>
            <strong style={{ color: 'var(--rp-ink)' }}>How to read this:</strong> start with the model, trace one workflow, then use the Sarah and scheduler sections as implementation examples.
          </div>
        </div>

        {/* Spec panel */}
        <div style={{
          border: '3px solid var(--rp-ink)', background: 'var(--rp-paper)',
          boxShadow: '6px 6px 0 var(--rp-ink)', padding: '22px 24px',
        }}>
          <div style={{
            fontFamily: RP.mono, fontSize: 10, letterSpacing: 2.4, color: RP.blue,
            textTransform: 'uppercase', marginBottom: 16, paddingBottom: 10,
            borderBottom: '1.5px dashed var(--rp-ink)',
          }}>
            Playbook shape · public pass
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {stats.map(([n, l]) => (
              <div key={l} style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 14, alignItems: 'baseline' }}>
                <span style={{ fontFamily: RP.display, fontSize: 34, lineHeight: 0.9, letterSpacing: -1 }}>{n}</span>
                <span style={{ fontFamily: RP.body, fontSize: 14, color: 'var(--rp-ink)' }}>{l}</span>
              </div>
            ))}
            <div style={{
              marginTop: 8, paddingTop: 10, borderTop: '1.5px dashed rgba(15,13,11,0.35)',
              fontFamily: RP.mono, fontSize: 10.5, letterSpacing: 1.2, lineHeight: 1.6,
              color: 'var(--rp-muted)',
            }}>
              Public-safe playbook view · private inventory removed.
            </div>
          </div>
        </div>
      </div>

      {/* Quiet section index */}
      <div style={{
        marginTop: 48, paddingTop: 12, borderTop: '1.5px solid rgba(15,13,11,0.28)',
        display: 'flex', flexWrap: 'wrap', gap: '10px 18px',
        fontFamily: RP.mono, fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase',
        position: 'relative', zIndex: 2, color: 'var(--rp-muted)',
      }}>
        {[
          ['Model', '#workflow'],
          ['Workflow paths', '#workflow-images'],
          ['Scheduler', '#scheduler'],
          ['Sarah', '#sarah'],
          ['Services', '#services'],
          ['Wiring', '#graph'],
          ['Apps', '#apps'],
        ].map(([l, h], i) => (
          <a key={h} href={h} style={{ color: 'var(--rp-muted)', textDecoration: 'none' }}>
            {i > 0 && <span style={{ opacity: 0.45, marginRight: 18 }}>/</span>}{l}
          </a>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { Hero });
