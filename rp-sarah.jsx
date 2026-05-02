/* global React, RP, Chip, Tape, Grain, InkBlock, HandNote */
// Sarah Voice Agent section + Scheduler transition + Services

const SARAH_STACK = [
  { n: '01', title: 'Phone intake', sub: 'Inbound voice line', body: 'Leasing and tenant calls enter a controlled intake path before anything reaches the operator.', accents: ['Inbound', 'Voice', 'Handoff'] },
  { n: '02', title: 'Voice + AI', sub: 'Conversation layer', body: 'The Sarah persona handles speech, intent, and conversation control using a maintained property knowledge base.', accents: ['Voice AI', 'Intent', 'Persona'] },
  { n: '03', title: 'Backend layer', sub: 'Edge API', body: 'The API Sarah calls mid-conversation. It handles routing, policy checks, and the thin control layer between voice and data.', accents: ['Edge API', 'Routing', 'Policy'] },
  { n: '04', title: 'Data layer', sub: 'Hosted docs + tables', body: 'Tenant directory, vacancy state, tour queue, and call logs live in hosted operational docs. The backend reads and writes through a locked-down service identity.', accents: ['Hosted data', 'Call logs', 'Service identity'] },
  { n: '05', title: 'Knowledge base', sub: 'Canonical markdown KB', body: 'Source of truth lives in maintained property notes. A scheduled sync turns that into the live voice-agent knowledge base.', accents: ['Markdown', 'Scheduled sync', 'Single source'] },
  { n: '06', title: 'Operator handoff', sub: 'Message queue', body: 'Each call can be handed to the operator with the right property context, outcome, and summary.', accents: ['Messaging', 'Per-call', 'Handoff'] },
];

const SARAH_ENDPOINTS = [
  ['Availability lookup', 'Real-time vacancy check by property'],
  ['Tour scheduling', 'Writes a tour request into the intake queue'],
  ['Property info', 'Rent, beds, policies, amenities'],
  ['Tenant lookup', 'Matches a tenant by phone or name'],
  ['Call logging', 'Writes the post-call summary to the record system'],
  ['Health check', 'Uptime ping'],
  ['Debug path', 'Manual troubleshooting — outside caller flow'],
];

const SARAH_BOUNDARIES = [
  'No outbound calls — line is inbound only.',
  'No outbound SMS — messaging is not part of the live caller flow.',
  'No rent collection or payment negotiation — that\'s Tony Montana.',
  'No maintenance dispatch — captured in the log, but dispatch stays with me.',
  'No legal or eviction guidance — tagged for operator review and handed off.',
];

const SERVICES = [
  { name: 'Model layer', tag: 'Reasoning + coding', body: 'Planning, drafting, extraction, and implementation support.', color: RP.green },
  { name: 'Search layer', tag: 'Retrieval', body: 'Finds the right prior context without exposing the private index.', color: RP.blue },
  { name: 'Telegram', tag: 'Delivery + routing', body: 'Cron delivery, Sarah call routing, reminders.', color: RP.blue },
  { name: 'Gmail / Google', tag: 'Ingress', body: 'Gmail watch, inbox checks, Sheets-backed queues.', color: RP.pink },
  { name: 'Notion', tag: 'Knowledge + reporting', body: 'Dashboards, Morra publishing, delinquency sync.', color: RP.ink },
  { name: 'AppFolio', tag: 'Property backbone', body: 'Tenants, occupancy, WOs, vendors, reporting.', color: RP.orange },
  { name: 'Voice AI', tag: 'Sarah', body: 'Call handling, review analysis, and KB sync.', color: RP.yellow },
  { name: 'Motion', tag: 'Tasking', body: 'Task creation around delinquency workflows.', color: RP.green },
  { name: 'RPLY', tag: 'Reminder sidecar', body: 'Launchd-owned reminder path for business-text audiences.', color: RP.pink },
];

function Scheduler() {
  return (
    <section id="scheduler" data-screen-label="02b Scheduler" style={{
      position: 'relative', padding: '60px 48px', overflow: 'hidden',
      borderBottom: '3px solid var(--rp-ink)', background: 'var(--rp-paper)',
    }}>
      <Grain opacity={0.06} />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200 }}>
        <Chip color={RP.blue} size="md" style={{ transform: 'rotate(1.5deg)', marginBottom: 14 }}>
          § 02 — Scheduler migration
        </Chip>
        <h3 style={{ margin: '0 0 8px', fontSize: 'clamp(40px, 6vw, 72px)', fontFamily: RP.display, letterSpacing: -2, lineHeight: 0.9, textTransform: 'uppercase' }}>
          A split scheduler,<br/>not one giant loop.
        </h3>
        <p style={{ maxWidth: '62ch', fontSize: 17, lineHeight: 1.55, color: 'var(--rp-muted)', fontFamily: RP.body }}>
          The scheduler is no longer one giant loop. Judgment-heavy work stays in the agent layer, while always-on services and script-heavy watchdogs live in macOS service management. That split keeps the reasoning layer for judgment and pushes repetitive plumbing into cheaper, sturdier paths.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 28 }}>
          {[
            { big: 'Registry', tag: 'Agent-owned recurring work', color: RP.pink, small: true },
            { big: 'Services', tag: 'Always-on platform layer', color: RP.blue, small: true },
            { big: 'Watchdogs', tag: 'Script-heavy checks offloaded from agents', color: RP.yellow, small: true },
            { big: 'Smaller core', tag: 'Long-term goal for agentic jobs', color: RP.green, small: true },
            { big: 'disable→enable', tag: 'Rollback primitive', color: RP.orange, small: true },
          ].map((x, i) => (
            <div key={i} style={{ background: 'var(--rp-bg)', border: '3px solid var(--rp-ink)', boxShadow: '5px 5px 0 var(--rp-ink)', padding: '16px 18px' }}>
              <div style={{ fontFamily: RP.display, fontSize: x.small ? 24 : 54, lineHeight: 0.9, letterSpacing: -2, color: x.color }}>{x.big}</div>
              <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--rp-muted)', marginTop: 8 }}>{x.tag}</div>
            </div>
          ))}
        </div>

        {/* Runner anatomy */}
        <div style={{ marginTop: 36 }}>
          <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 2, color: RP.pink, textTransform: 'uppercase', marginBottom: 8 }}>
            Runner anatomy
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {[
              { k: 'Cron runner', v: 'Shared entrypoint for agent-owned jobs. It handles delivery, cooldowns, and the handoff into the underlying prompt or script.' },
              { k: 'Service manifest', v: 'Registry of macOS-managed jobs — schedule, role, and ownership without exposing runtime state.' },
              { k: 'Runner state', v: 'Per-job state sink for last run, delivery, and repeated errors. Rebuildable from logs if lost.' },
              { k: 'Scheduler registry', v: 'The recurring-job registry. Read this section as a shape-of-the-system view, not a frozen public count.' },
            ].map((x, i) => (
              <div key={i} style={{ background: 'var(--rp-bg)', border: '3px solid var(--rp-ink)', boxShadow: '4px 4px 0 var(--rp-ink)', padding: '14px 16px' }}>
                <div style={{ fontFamily: RP.mono, fontSize: 12, color: RP.blue, marginBottom: 6, wordBreak: 'break-word' }}>{x.k}</div>
                <div style={{ fontFamily: RP.body, fontSize: 13.5, lineHeight: 1.5, color: 'var(--rp-ink)' }}>{x.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduler cleanup status */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 2, color: RP.pink, textTransform: 'uppercase', marginBottom: 8 }}>
            Scheduler cleanup status
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {[
              { state: 'Live', color: RP.green, k: 'Judgment scheduler', v: 'Recurring jobs that need judgment stay in the agent layer, grouped by owner lane.' },
              { state: 'Live', color: RP.yellow, k: 'Service layer', v: 'Always-on plumbing and script-heavy watchdogs run as macOS services instead of agent turns.' },
              { state: 'Ongoing', color: RP.blue, k: 'Cleanup rule', v: 'When a job is mostly plumbing, move it out of the agent layer. When it needs judgment, keep it with an agent.' },
              { state: 'Retired', color: '#6a2a2a', k: 'Old reminder path', v: 'Legacy reminder logic stays retired unless there is a clear reason to bring it back.' },
            ].map((x, i) => (
              <div key={i} style={{ background: 'var(--rp-bg)', border: '3px solid var(--rp-ink)', boxShadow: '4px 4px 0 var(--rp-ink)', padding: '14px 16px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ fontFamily: RP.display, fontSize: 22, letterSpacing: -1 }}>{x.k}</span>
                  <span style={{ fontFamily: RP.mono, fontSize: 9, letterSpacing: 1.5, background: x.color, color: '#fff', padding: '2px 7px', border: '2px solid var(--rp-ink)' }}>{x.state.toUpperCase()}</span>
                </div>
                <div style={{ fontFamily: RP.body, fontSize: 13, lineHeight: 1.5, color: 'var(--rp-muted)' }}>{x.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Rollback primitive */}
        <div style={{ marginTop: 28, background: 'var(--rp-ink)', color: 'var(--rp-paper)', border: '3px solid var(--rp-ink)', boxShadow: '6px 6px 0 var(--rp-ink)', padding: '20px 22px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 2, color: RP.yellow, textTransform: 'uppercase', marginBottom: 6 }}>
              Rollback primitive
            </div>
            <div style={{ fontFamily: RP.display, fontSize: 28, letterSpacing: -1, textTransform: 'uppercase', lineHeight: 1 }}>
              disable in one, enable in the other.
            </div>
            <div style={{ fontFamily: RP.body, fontSize: 14, lineHeight: 1.5, color: 'rgba(236,229,208,0.75)', marginTop: 8, maxWidth: '60ch' }}>
              Every migrated job can be flipped back in seconds — one path off, the other back on. No data loss, no redeploy, just a toggle. That cheapness is what makes the migration safe to run live.
            </div>
          </div>
          <code style={{ fontFamily: RP.mono, fontSize: 12, color: RP.yellow, whiteSpace: 'normal', overflowWrap: 'anywhere' }}>service off · scheduler on</code>
        </div>
      </div>
    </section>
  );
}

function Sarah() {
  return (
    <section id="sarah" data-screen-label="03 Sarah" style={{
      position: 'relative', padding: '80px 48px', overflow: 'hidden',
      borderBottom: '3px solid var(--rp-ink)',
    }}>
      <Grain opacity={0.08} />
      <InkBlock color={RP.pink} width={160} height={160} top={60} right={60} radius="50%" />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200 }}>
        <Chip color={RP.pink} size="md" style={{ transform: 'rotate(-2deg)', marginBottom: 16 }}>
          § 03 — Voice subsystem
        </Chip>
        <h2 style={{ margin: 0, fontSize: 'clamp(52px, 8vw, 108px)', lineHeight: 0.85, fontWeight: 900, letterSpacing: -4, textTransform: 'uppercase', fontFamily: RP.display, maxWidth: '14ch' }}>
          Sarah handles<br/>phone <span style={{ background: RP.pink, color: '#fff', padding: '0 10px', boxShadow: '3px 3px 0 var(--rp-ink)', display: 'inline-block', transform: 'rotate(-1deg)' }}>intake</span>.
        </h2>
        <p style={{ maxWidth: '58ch', fontSize: 19, lineHeight: 1.55, fontFamily: RP.body, color: 'var(--rp-ink)', marginTop: 18 }}>
          A dedicated voice subsystem for leasing and tenant intake: phone answer, conversation control, backend checks, knowledge retrieval, and clean operator handoff. Inbound only, with clear boundaries.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 24 }}>
          {[
            ['Toll-free US', 'Live number'],
            ['7', 'Worker endpoints'],
            ['4', 'Managed properties'],
            ['3', 'Voice automations'],
          ].map(([big, tag], i) => (
            <div key={i} style={{ background: 'var(--rp-paper)', border: '3px solid var(--rp-ink)', boxShadow: '5px 5px 0 var(--rp-ink)', padding: '14px 16px' }}>
              <div style={{ fontFamily: RP.display, fontSize: 36, lineHeight: 0.9, letterSpacing: -1.5 }}>{big}</div>
              <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--rp-muted)', marginTop: 6 }}>{tag}</div>
            </div>
          ))}
        </div>

        {/* Stack */}
        <div style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 36, fontFamily: RP.display, letterSpacing: -1.5, textTransform: 'uppercase', lineHeight: 0.9 }}>The stack</h3>
            <HandNote color={RP.blue} fontSize={18} maxWidth={260} style={{ transform: 'rotate(-1deg)' }}>six layers, ring → handoff</HandNote>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {SARAH_STACK.map((s, i) => (
              <div key={s.n} style={{ background: 'var(--rp-paper)', border: '3px solid var(--rp-ink)', boxShadow: '5px 5px 0 var(--rp-ink)', padding: '16px 18px', position: 'relative', transform: `rotate(${[-0.5, 0.3, -0.2, 0.4, -0.3, 0.2][i]}deg)` }}>
                <div style={{ position: 'absolute', top: -12, left: 14, background: RP.blue, padding: '3px 9px', border: '2.5px solid var(--rp-ink)', fontFamily: RP.mono, fontSize: 10, letterSpacing: 2, color: '#fff' }}>{s.n}</div>
                <div style={{ fontFamily: RP.display, fontSize: 22, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: -1, marginTop: 12 }}>{s.title}</div>
                <div style={{ fontFamily: RP.mono, fontSize: 11, color: RP.pink, marginTop: 4, marginBottom: 8 }}>{s.sub}</div>
                <div style={{ fontFamily: RP.body, fontSize: 13.5, lineHeight: 1.45, color: 'var(--rp-muted)' }}>{s.body}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {s.accents.map((a, j) => (
                    <span key={j} style={{ fontFamily: RP.mono, fontSize: 9, letterSpacing: 1, padding: '3px 6px', background: 'var(--rp-bg)', border: '1.5px solid var(--rp-ink)' }}>{a}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Endpoints + Boundaries */}
        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          <div>
            <h3 style={{ margin: '0 0 14px', fontSize: 30, fontFamily: RP.display, letterSpacing: -1, textTransform: 'uppercase' }}>Worker endpoints</h3>
            <div style={{ background: 'var(--rp-paper)', border: '3px solid var(--rp-ink)', boxShadow: '5px 5px 0 var(--rp-ink)' }}>
              {SARAH_ENDPOINTS.map(([ep, body], i) => (
                <div key={ep} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, padding: '12px 16px', borderBottom: i === SARAH_ENDPOINTS.length - 1 ? 'none' : '1.5px dashed var(--rp-ink)' }}>
                  <code style={{ fontFamily: RP.mono, fontSize: 13, color: RP.blue }}>{ep}</code>
                  <span style={{ fontFamily: RP.body, fontSize: 13.5, color: 'var(--rp-muted)' }}>{body}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ margin: '0 0 14px', fontSize: 30, fontFamily: RP.display, letterSpacing: -1, textTransform: 'uppercase' }}>Boundaries</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
              {SARAH_BOUNDARIES.map((b, i) => (
                <li key={i} style={{ background: 'var(--rp-paper)', border: '3px solid var(--rp-ink)', boxShadow: '3px 3px 0 var(--rp-ink)', padding: '12px 14px', fontFamily: RP.body, fontSize: 14, lineHeight: 1.45, position: 'relative', paddingLeft: 32 }}>
                  <span style={{ position: 'absolute', left: 10, top: 12, fontFamily: RP.mono, fontSize: 12, color: RP.pink, fontWeight: 700 }}>✕</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" data-screen-label="04 Services" style={{
      position: 'relative', padding: '60px 48px', overflow: 'hidden',
      borderBottom: '3px solid var(--rp-ink)', background: 'var(--rp-paper)',
    }}>
      <Grain opacity={0.06} />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200 }}>
        <Chip color={RP.green} size="md" style={{ transform: 'rotate(-1.5deg)', marginBottom: 14 }}>
          § 04 — Service edge
        </Chip>
        <h3 style={{ margin: '0 0 10px', fontSize: 'clamp(40px, 6vw, 72px)', fontFamily: RP.display, letterSpacing: -2, lineHeight: 0.9, textTransform: 'uppercase' }}>
          Local-first,<br/>but not alone.
        </h3>
        <p style={{ maxWidth: '60ch', fontSize: 16, lineHeight: 1.55, color: 'var(--rp-muted)', fontFamily: RP.body, marginBottom: 28 }}>
          These are the outside services the system really depends on. Everything else stays on the laptop.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {SERVICES.map((s, i) => (
            <div key={s.name} style={{ background: 'var(--rp-bg)', border: '3px solid var(--rp-ink)', boxShadow: '4px 4px 0 var(--rp-ink)', padding: '14px 16px' }}>
              <div style={{ display: 'inline-block', background: s.color, color: '#fff', padding: '3px 8px', fontFamily: RP.mono, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', border: '2px solid var(--rp-ink)' }}>{s.tag}</div>
              <div style={{ fontFamily: RP.display, fontSize: 22, lineHeight: 0.95, letterSpacing: -1, textTransform: 'uppercase', marginTop: 10 }}>{s.name}</div>
              <div style={{ fontFamily: RP.body, fontSize: 13.5, lineHeight: 1.45, color: 'var(--rp-muted)', marginTop: 6 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Sarah, Scheduler, Services });
