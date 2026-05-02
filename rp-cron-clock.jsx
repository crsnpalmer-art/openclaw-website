/* global React, RP, Chip, Grain, InkBlock, HandNote */
// Cron schedule visual — a public-safe strip of the current automation rhythm

// Derived from the runtime snapshot. Each entry: [hour 0-23.999, agent, label].
// For */30 hourly loops we sample a representative slice; daily/weekly/monthly are pinned.
const CRON_EVENTS = [
  // One dot per enabled scheduler job, labels generalized for public display.
  { h: 3.5, a: 'zero', label: 'Session cleanup' },
  { h: 6.0, a: 'eddie', label: 'Property sync' },
  { h: 6.25, a: 'eddie', label: 'Work-order notifications' },
  { h: 6.5, a: 'main', label: 'Dashboard sync' },
  { h: 9.0, a: 'tony', label: 'Collections report' },
  { h: 9.25, a: 'eddie', label: 'Monday property sweep' },
  { h: 9.25, a: 'tony', label: 'Mid-month collections' },
  { h: 9.5, a: 'eddie', label: 'Occupancy report' },
  { h: 9.5, a: 'eddie', label: 'Tenant directory refresh' },
  { h: 9.75, a: 'burry', label: 'Weekly P&L' },
  { h: 10.0, a: 'zero', label: 'Work-order history sync' },
  { h: 10.5, a: 'eddie', label: 'Lease renewal pipeline' },
  { h: 17.0, a: 'monk', label: 'Archive review' },
  { h: 20.75, a: 'eddie', label: 'Sarah QA review' },
  { h: 23.0, a: 'zero', label: 'Daily log writer' },
  { h: 23.166, a: 'monk', label: 'Self-improvement review' },
];

const AGENT_COLOR = {
  main: RP.pink,
  eddie: RP.orange,
  burry: RP.green,
  tony: RP.blue,
  zero: RP.yellow,
  monk: RP.ink,
};

const AGENT_LABEL = {
  main: 'main',
  eddie: 'Eddie Morra',
  burry: 'Michael Burry',
  tony: 'Tony Montana',
  zero: 'Guardian Zero',
  monk: 'Archive Monk',
};

function CronSchedule() {
  return (
    <section id="cron-day" data-screen-label="02c Cron Day" style={{
      position: 'relative', padding: '70px 48px', overflow: 'hidden',
      borderBottom: '3px solid var(--rp-ink)',
    }}>
      <Grain opacity={0.07} />
      <InkBlock color={RP.yellow} width={180} height={180} top={60} right={80} radius="50%" opacity={0.18} />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200 }}>
        <Chip color={RP.yellow} size="md" style={{ transform: 'rotate(-1.5deg)', marginBottom: 14 }}>
          § 02c — One day on the clock
        </Chip>
        <h3 style={{ margin: '0 0 10px', fontSize: 'clamp(40px, 6vw, 72px)', fontFamily: RP.display, letterSpacing: -2, lineHeight: 0.9, textTransform: 'uppercase' }}>
          Recurring work,<br/>laid across the day.
        </h3>
        <p style={{ maxWidth: '62ch', fontSize: 16, lineHeight: 1.55, color: 'var(--rp-muted)', fontFamily: RP.body, marginBottom: 28 }}>
          The day laid flat. Each mark represents a kind of recurring work,
          generalized enough for public display. Colored by owning lane, with
          private routing details kept off the site.
        </p>

        {/* Hour strip */}
        <div style={{ border: '3px solid var(--rp-ink)', boxShadow: '6px 6px 0 var(--rp-ink)', background: 'var(--rp-paper)', padding: '22px 24px 16px' }}>
          <div style={{ position: 'relative', height: 180 }}>
            {/* Hour gridlines */}
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute', top: 0, bottom: 24,
                left: `${(i / 24) * 100}%`,
                width: 1, background: i % 6 === 0 ? 'var(--rp-ink)' : 'rgba(17,17,17,0.15)',
              }}/>
            ))}
            {/* Hour labels */}
            {[0, 6, 12, 18, 24].map(h => (
              <div key={h} style={{
                position: 'absolute', bottom: 0,
                left: `${(h / 24) * 100}%`,
                transform: 'translateX(-50%)',
                fontFamily: RP.mono, fontSize: 10, letterSpacing: 1.5, color: 'var(--rp-muted)',
              }}>{String(h).padStart(2, '0')}:00</div>
            ))}
            {/* Midday line mark */}
            <div style={{
              position: 'absolute', top: 0, bottom: 24, left: '50%',
              width: 1.5, background: RP.pink, opacity: 0.5,
            }}/>

            {/* Events — stacked vertically if near each other */}
            {CRON_EVENTS.map((e, i) => {
              const left = (e.h / 24) * 100;
              // Stagger rows to avoid overlap: use index-mod for vertical slot
              const row = i % 6;
              const top = 12 + row * 22;
              const color = AGENT_COLOR[e.a];
              return (
                <div key={i} title={`${e.label} — ${AGENT_LABEL[e.a]}`} style={{
                  position: 'absolute',
                  left: `calc(${left}% - 5px)`,
                  top,
                  width: 10, height: 10,
                  background: color,
                  border: '1.5px solid var(--rp-ink)',
                  borderRadius: 2,
                }}/>
              );
            })}
          </div>

          {/* Density bar */}
          <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1.5px dashed var(--rp-ink)' }}>
            <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--rp-muted)', marginBottom: 8 }}>
              Activity density · bins of 2h
            </div>
            <div style={{ position: 'relative', height: 40, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
              {Array.from({ length: 12 }).map((_, bin) => {
                const lo = bin * 2; const hi = lo + 2;
                const count = CRON_EVENTS.filter(e => e.h >= lo && e.h < hi).length;
                const max = 8;
                return (
                  <div key={bin} style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <div style={{
                      height: `${Math.min(100, (count / max) * 100)}%`,
                      background: count > 4 ? RP.pink : count > 1 ? RP.blue : RP.yellow,
                      border: '1.5px solid var(--rp-ink)',
                      minHeight: count > 0 ? 6 : 0,
                    }}/>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: RP.mono, fontSize: 9, letterSpacing: 1.5, color: 'var(--rp-muted)' }}>
              <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {Object.keys(AGENT_LABEL).map(a => (
            <div key={a} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--rp-paper)', border: '2px solid var(--rp-ink)',
              padding: '5px 10px', fontFamily: RP.mono, fontSize: 10.5, letterSpacing: 1.5, textTransform: 'uppercase',
            }}>
              <span style={{ width: 10, height: 10, background: AGENT_COLOR[a], border: '1.5px solid var(--rp-ink)', borderRadius: 2 }}/>
              <span>{AGENT_LABEL[a]}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {[
            { big: '03:00', tag: 'Quietest hour · auth monitor, cleanup, and backup territory' },
            { big: '06–10', tag: 'Morning ramp · WO notifications, Morra, brief, Sarah router' },
            { big: '18:10', tag: 'Evening wrap-up — the day compiles itself' },
          ].map((x, i) => (
            <div key={i} style={{ background: 'var(--rp-paper)', border: '3px solid var(--rp-ink)', boxShadow: '4px 4px 0 var(--rp-ink)', padding: '12px 14px' }}>
              <div style={{ fontFamily: RP.display, fontSize: 28, lineHeight: 0.9, letterSpacing: -1, color: RP.blue }}>{x.big}</div>
              <div style={{ fontFamily: RP.body, fontSize: 13, lineHeight: 1.5, color: 'var(--rp-muted)', marginTop: 6 }}>{x.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Public shape — representative job families grouped by owning lane ─────────
const CRON_REGISTRY = [
  { agentId: 'main', label: 'main', role: 'Default operator', color: RP.pink, jobs: [
    ['Dashboard sync', 'Daily'],
  ]},
  { agentId: 'work', label: 'Eddie Morra', role: 'Work', color: RP.orange, jobs: [
    ['Property sync', 'Daily'],
    ['Work-order notifications', 'Daily'],
    ['Occupancy report', 'Weekdays'],
    ['Monday property sweep', 'Weekly'],
    ['Lease renewal pipeline', 'Weekly'],
    ['Tenant directory refresh', 'Monthly'],
    ['Sarah QA review', 'Daily'],
  ]},
  { agentId: 'finance', label: 'Michael Burry', role: 'Finance', color: RP.green, jobs: [
    ['P&L summary', 'Weekly'],
  ]},
  { agentId: 'collections', label: 'Tony Montana', role: 'Collections', color: RP.blue, jobs: [
    ['Collections report', 'Monthly'],
    ['Mid-month follow-up', 'Monthly'],
  ]},
  { agentId: 'ops', label: 'Guardian Zero', role: 'Ops', color: RP.yellow, jobs: [
    ['Session cleanup', 'Daily'],
    ['Work-order history sync', 'Monthly'],
    ['Daily log writer', 'Daily'],
  ]},
  { agentId: 'archive', label: 'Archive Monk', role: 'Archive', color: RP.ink, jobs: [
    ['Archive review', 'Weekly'],
    ['Self-improvement review', 'Daily'],
  ]},
];

function CronRegistry() {
  return (
    <section id="cron-registry" data-screen-label="02d Cron Registry" style={{
      position: 'relative', padding: '70px 48px', overflow: 'hidden',
      borderBottom: '3px solid var(--rp-ink)', background: 'var(--rp-paper)',
    }}>
      <Grain opacity={0.06} />
      <InkBlock color={RP.pink} width={180} height={180} top={60} right={80} radius="50%" opacity={0.12} />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200 }}>
        <Chip color={RP.pink} size="md" style={{ transform: 'rotate(1.2deg)', marginBottom: 14 }}>
          § 02d — Public registry map
        </Chip>
        <h3 style={{ margin: '0 0 10px', fontSize: 'clamp(40px, 6vw, 72px)', fontFamily: RP.display, letterSpacing: -2, lineHeight: 0.9, textTransform: 'uppercase' }}>
          Job families,<br/>by owning agent.
        </h3>
        <p style={{ maxWidth: '62ch', fontSize: 16, lineHeight: 1.55, color: 'var(--rp-muted)', fontFamily: RP.body, marginBottom: 28 }}>
          This is a public-facing map of the scheduler, grouped by owning lane. It shows the shape of recurring work without publishing private routing details.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, alignItems: 'start' }}>
          {CRON_REGISTRY.map((agent, i) => (
            <div key={agent.agentId} style={{
              background: 'var(--rp-bg)', border: '3px solid var(--rp-ink)',
              boxShadow: '5px 5px 0 var(--rp-ink)', padding: '16px 18px 14px', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -14, left: 14,
                background: agent.color, padding: '4px 10px', border: '2.5px solid var(--rp-ink)',
                fontFamily: RP.mono, fontSize: 10, letterSpacing: 2, color: '#fff',
              }}>AGENT № 0{i + 1}</div>
              <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 2, color: 'var(--rp-muted)', marginTop: 14 }}>
                {agent.role.toUpperCase()} · public lane
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 2, marginBottom: 12 }}>
                <div style={{ fontFamily: RP.display, fontSize: 22, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: -1 }}>
                  {agent.label}
                </div>
                <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 1.5, color: agent.color, textTransform: 'uppercase', fontWeight: 700 }}>
                  example work
                </div>
              </div>
              <div style={{ display: 'grid', gap: 5, paddingTop: 10, borderTop: '1.5px dashed var(--rp-ink)' }}>
                {agent.jobs.map(([name, sched], idx) => (
                  <div key={idx} style={{
                    display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'baseline',
                    paddingBottom: 4,
                    borderBottom: idx === agent.jobs.length - 1 ? 'none' : '1px dotted rgba(17,17,17,0.2)',
                  }}>
                    <span style={{ fontFamily: RP.body, fontSize: 12.5, lineHeight: 1.35, color: 'var(--rp-ink)' }}>{name}</span>
                    <span style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 0.5, color: 'var(--rp-muted)', whiteSpace: 'nowrap', textAlign: 'right' }}>{sched}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 28, paddingTop: 14, borderTop: '1.5px dashed var(--rp-ink)',
          fontFamily: RP.mono, fontSize: 10.5, letterSpacing: 1.6, color: 'var(--rp-muted)',
          display: 'flex', flexWrap: 'wrap', gap: 18,
        }}>
          <span>Source · sanitized operating map</span>
          <span>View · public summary</span>
          <span>Details · private inventory removed</span>
        </div>
      </div>
    </section>
  );
}

// ─── Public shape — representative service families around the runtime ─────────
const LAUNCHD_REGISTRY = [
  {
    group: 'Platform',
    role: 'Core runtime + sidecars',
    note: 'The always-on host layer: gateway, supporting sidecars, and a few long-lived helpers.',
    color: RP.blue,
    services: [
      ['Gateway service', 'Persistent'],
      ['Auth monitor service', 'Recurring'],
      ['Property sync sidecar', 'Recurring'],
      ['Reminder sidecar', 'Business hours'],
    ],
  },
  {
    group: 'Health pulse',
    role: 'Gateway liveness probe',
    note: 'Fast-cadence health checks make sure the runtime comes back cleanly if it drifts.',
    color: RP.pink,
    services: [
      ['Gateway pulse', 'Recurring'],
    ],
  },
  {
    group: 'Ops watchdogs',
    role: 'Script-heavy checks moved out of agent turns',
    note: 'These are the boring but important checks: backup verification, delivery drains, conflict detection, profile monitoring, and similar operational plumbing.',
    color: RP.yellow,
    services: [
      ['Queue + lock cleanup', 'Recurring'],
      ['Backup verification', 'Recurring'],
      ['Config + drift checks', 'Recurring'],
      ['Delivery + runtime monitors', 'Recurring'],
      ['Credential + profile checks', 'Recurring'],
    ],
  },
];

function LaunchdRegistry() {
  const total = LAUNCHD_REGISTRY.reduce((n, g) => n + g.services.length, 0);
  return (
    <section id="launchd-registry" data-screen-label="02e Launchd Registry" style={{
      position: 'relative', padding: '70px 48px', overflow: 'hidden',
      borderBottom: '3px solid var(--rp-ink)',
    }}>
      <Grain opacity={0.07} />
      <InkBlock color={RP.yellow} width={180} height={180} top={60} right={80} radius="50%" opacity={0.14} />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200 }}>
        <Chip color={RP.yellow} size="md" style={{ transform: 'rotate(-1.2deg)', marginBottom: 14 }}>
          § 02e — Launchd services
        </Chip>
        <h3 style={{ margin: '0 0 10px', fontSize: 'clamp(40px, 6vw, 72px)', fontFamily: RP.display, letterSpacing: -2, lineHeight: 0.9, textTransform: 'uppercase' }}>
          Service families,<br/>around the runtime.
        </h3>
        <p style={{ maxWidth: '64ch', fontSize: 16, lineHeight: 1.55, color: 'var(--rp-muted)', fontFamily: RP.body, marginBottom: 28 }}>
          The non-agent side of the split scheduler. This section shows the kinds of services around the runtime without publishing sensitive labels or host internals.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, alignItems: 'start' }}>
          {LAUNCHD_REGISTRY.map((group, i) => (
            <div key={group.group} style={{
              background: 'var(--rp-paper)', border: '3px solid var(--rp-ink)',
              boxShadow: '5px 5px 0 var(--rp-ink)', padding: '16px 18px 14px', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -14, left: 14,
                background: group.color, padding: '4px 10px', border: '2.5px solid var(--rp-ink)',
                fontFamily: RP.mono, fontSize: 10, letterSpacing: 2, color: '#fff',
              }}>GROUP № 0{i + 1}</div>
              <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 2, color: 'var(--rp-muted)', marginTop: 14 }}>
                {group.role.toUpperCase()}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 2, marginBottom: 8 }}>
                <div style={{ fontFamily: RP.display, fontSize: 22, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: -1 }}>
                  {group.group}
                </div>
                <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 1.5, color: group.color, textTransform: 'uppercase', fontWeight: 700 }}>
                  {group.services.length} {group.services.length === 1 ? 'service' : 'services'}
                </div>
              </div>
              <div style={{ fontFamily: RP.body, fontSize: 12.5, lineHeight: 1.45, color: 'var(--rp-muted)', marginBottom: 10 }}>
                {group.note}
              </div>
              <div style={{ display: 'grid', gap: 5, paddingTop: 10, borderTop: '1.5px dashed var(--rp-ink)' }}>
                {group.services.map(([name, sched], idx) => (
                  <div key={idx} style={{
                    display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'baseline',
                    paddingBottom: 4,
                    borderBottom: idx === group.services.length - 1 ? 'none' : '1px dotted rgba(17,17,17,0.2)',
                  }}>
                    <code style={{ fontFamily: RP.mono, fontSize: 11, lineHeight: 1.35, color: 'var(--rp-ink)', wordBreak: 'break-all' }}>{name}</code>
                    <span style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 0.5, color: 'var(--rp-muted)', whiteSpace: 'nowrap', textAlign: 'right' }}>{sched}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 28, paddingTop: 14, borderTop: '1.5px dashed var(--rp-ink)',
          fontFamily: RP.mono, fontSize: 10.5, letterSpacing: 1.6, color: 'var(--rp-muted)',
          display: 'flex', flexWrap: 'wrap', gap: 18,
        }}>
          <span>Source · host service inventory</span>
          <span>View · public summary</span>
          <span>Labels · sanitized on purpose</span>
          <span>Always-on checks · live</span>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { CronSchedule, CronRegistry, LaunchdRegistry });
