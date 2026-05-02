/* global React, RP, Chip, Tape, Burst, Arrow, HandNote, InkBlock, StarDoodle, Grain */
// Workflow automation explainer section — what it is, how it works, the graph

const EXPLAIN_LANES = [
  { name: 'main', role: 'Default operator', cadence: 'interactive', blurb: 'Main is the interactive control lane. It handles direct operator work, coordination, and the default session behavior.', color: RP.pink },
  { name: 'Eddie Morra', role: 'Work', cadence: 'property ops', blurb: 'Property operations and front-line work: AppFolio sync, work-order notifications, occupancy, leasing, tenant directory, and Sarah QA.', color: RP.orange },
  { name: 'Michael Burry', role: 'Finance', cadence: 'weekly review', blurb: 'Financial analysis lane. Right now that means the weekly P&L summary.', color: RP.green },
  { name: 'Tony Montana', role: 'Collections', cadence: 'scheduled follow-up', blurb: 'Collections lane for delinquency reports and mid-month follow-up.', color: RP.blue },
  { name: 'Guardian Zero', role: 'Ops', cadence: 'reliability', blurb: 'Janitor + monitor lane. Session cleanup, log writing, history syncs, and operational reliability work orbit here while many watchdogs now live in launchd.', color: RP.yellow },
  { name: 'Archive Monk', role: 'Archive', cadence: 'review loop', blurb: 'Keeps the system reflective and durable through review, context upkeep, and self-improvement.', color: RP.orange },
];

function WorkflowExplainer() {
  return (
    <section id="workflow" data-screen-label="02 Workflow Automation" style={{
      position: 'relative', padding: '80px clamp(20px, 4.5vw, 48px)', overflow: 'hidden',
      borderBottom: '3px solid var(--rp-ink)',
    }}>
      <Grain opacity={0.08} />
      <InkBlock color={RP.blue} width={180} height={180} top={80} right={80} radius="50%" />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200 }}>
        <Chip color={RP.yellow} size="md" style={{ transform: 'rotate(-2deg)', marginBottom: 16 }}>
          § 01 — The model
        </Chip>
        <h2 style={{
          margin: 0, fontSize: 'clamp(52px, 8vw, 108px)', lineHeight: 0.88,
          fontWeight: 900, letterSpacing: -3, textTransform: 'uppercase',
          fontFamily: RP.display, maxWidth: '18ch',
        }}>
          Inputs, routing,<br/>guardrails, and <span style={{ background: RP.yellow, padding: '0 8px', boxShadow: '3px 3px 0 var(--rp-ink)', display: 'inline-block', transform: 'rotate(-1deg)' }}>review</span><br/>keeping the work visible.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, marginTop: 40 }}>
          <div>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6, fontFamily: RP.body, color: 'var(--rp-ink)' }}>
              This is a local-first workflow automation pattern for recurring business work. It handles the messy middle:
              checking inputs, routing tasks, running reviews, syncing state, and escalating the parts that actually
              needs a human.
            </p>
            <p style={{ margin: '18px 0 0', fontSize: 18, lineHeight: 1.6, fontFamily: RP.body, color: 'var(--rp-ink)' }}>
              In plain English: instead of trusting a dozen disconnected dashboards,
              the workflow gives every job a path: receive it, classify it, prepare the next step, verify it, and make the risky parts reviewable.
            </p>
            <p style={{ margin: '18px 0 0', fontSize: 16, lineHeight: 1.6, fontFamily: RP.body, color: 'var(--rp-muted)' }}>
              The current implementation runs on a Mac with separate interactive, archive, and scheduled lanes.
              That detail matters less than the pattern: keep each lane narrow enough to understand and observable enough to trust.
            </p>
          </div>
          <div style={{
            background: 'var(--rp-paper)', border: '3px solid var(--rp-ink)',
            padding: 22, boxShadow: '6px 6px 0 var(--rp-ink)',
            transform: 'rotate(1deg)', position: 'relative',
          }}>
            <Tape color="rgba(255,210,63,0.8)" width={80} top={-12} left={40} rotate={-5} />
            <div style={{ fontFamily: RP.mono, fontSize: 11, letterSpacing: 2, color: RP.blue, marginBottom: 10 }}>
              ※ WHAT TO COPY
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 12, fontFamily: RP.body, fontSize: 15, color: 'var(--rp-ink)' }}>
              {[
                ['Capture', 'Calls, inboxes, reports, forms, and schedules become explicit inputs'],
                ['Classify', 'Work is assigned to a lane before tools start moving'],
                ['Prepare', 'The system drafts the next action without pretending it is always safe to send'],
                ['Verify', 'Checks, logs, and dry-runs make the result inspectable'],
                ['Approve', 'Human judgment remains the owner for risky external effects'],
                ['Improve', 'Feedback updates the workflow instead of living in someone’s head'],
                ['Data shown here', 'public-safe labels only — private inventory removed'], 
                ['Read this as', 'A reusable operating pattern, not a product spec'],
              ].map(([k, v], i) => (
                <li key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10 }}>
                  <span style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--rp-muted)', paddingTop: 2 }}>{k}</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lanes */}
        <div style={{ marginTop: 72 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 24 }}>
            <h3 style={{ margin: 0, fontSize: 48, fontFamily: RP.display, letterSpacing: -2, textTransform: 'uppercase', lineHeight: 0.9 }}>
              The operating lanes
            </h3>
            <HandNote color={RP.pink} fontSize={22} maxWidth={260} style={{ transform: 'rotate(-2deg)' }}>
              each name carries a job, not just a persona ↓
            </HandNote>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {EXPLAIN_LANES.map((lane, i) => (
              <div key={lane.name} style={{
                background: 'var(--rp-paper)', border: '3px solid var(--rp-ink)',
                padding: '18px 20px', position: 'relative',
                boxShadow: '5px 5px 0 var(--rp-ink)',
                transform: `rotate(${[-0.8, 0.6, -0.4, 0.8, -0.3, 0.5][i]}deg)`,
              }}>
                <div style={{
                  position: 'absolute', top: -14, left: 14,
                  background: lane.color, padding: '4px 10px', border: '2.5px solid var(--rp-ink)',
                  fontFamily: RP.mono, fontSize: 10, letterSpacing: 2, color: '#fff',
                }}>AGENT № 0{i + 1}</div>
                <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 2, color: 'var(--rp-muted)', marginTop: 14 }}>
                  {lane.role.toUpperCase()}
                </div>
                <div style={{ fontFamily: RP.display, fontSize: 24, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: -1, marginTop: 4, marginBottom: 10 }}>
                  {lane.name}
                </div>
                <div style={{ fontFamily: RP.body, fontSize: 14, lineHeight: 1.45, color: 'var(--rp-muted)' }}>
                  {lane.blurb}
                </div>
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1.5px dashed var(--rp-ink)', display: 'flex', alignItems: 'baseline', gap: 8, fontFamily: RP.mono }}>
                  <span style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: lane.color, fontWeight: 700 }}>{lane.cadence}</span>
                  <span style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--rp-muted)' }}>owning lane</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational cadence */}
        <div style={{ marginTop: 72 }}>
          <h3 style={{ margin: 0, fontSize: 44, fontFamily: RP.display, letterSpacing: -2, textTransform: 'uppercase', lineHeight: 0.9, marginBottom: 8 }}>
            Operational cadence
          </h3>
          <p style={{ margin: '0 0 24px', fontFamily: RP.body, fontSize: 15, color: 'var(--rp-muted)', maxWidth: '60ch' }}>
            The recurring work compresses into four rhythms that matter in most small operations. The exact tools change; the cadence pattern is the reusable part.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { t: 'Always on', color: RP.orange, title: 'Platform layer', body: 'Gateway, browser control, Gmail watch, and Telegram routing stay up so operator work and background work can land in the right lane.' },
              { t: 'Daily', color: RP.blue, title: 'Operating rhythm', body: 'AppFolio sync, work-order notifications, Notion dashboard sync, session cleanup, and daily log writing keep the property loop current.' },
              { t: 'Weekly', color: RP.green, title: 'Planning + finance', body: 'Weekly P&L summary plus reflective review / self-improvement passes keep finance and context from drifting.' },
              { t: 'Monthly', color: RP.pink, title: 'Collections', body: 'Collections work shows up as deliberate scheduled follow-up rather than a constant noisy loop.' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--rp-paper)', border: '3px solid var(--rp-ink)', boxShadow: '5px 5px 0 var(--rp-ink)', padding: '18px 20px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -14, left: 14, background: s.color, padding: '4px 10px', border: '2.5px solid var(--rp-ink)', fontFamily: RP.mono, fontSize: 10, letterSpacing: 2, color: '#fff' }}>{s.t}</div>
                <div style={{ fontFamily: RP.display, fontSize: 22, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: -1, marginTop: 14, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontFamily: RP.body, fontSize: 14, lineHeight: 1.45, color: 'var(--rp-muted)' }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio */}
        <div style={{ marginTop: 72 }}>
          <h3 style={{ margin: 0, fontSize: 44, fontFamily: RP.display, letterSpacing: -2, textTransform: 'uppercase', lineHeight: 0.9, marginBottom: 8 }}>
            Managed properties
          </h3>
          <p style={{ margin: '0 0 24px', fontFamily: RP.body, fontSize: 15, color: 'var(--rp-muted)', maxWidth: '60ch' }}>
              The four properties every schedule, lane, and voice endpoint is
            acting on. Tuscaloosa / Northport, AL.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {[
              ['Pinnacle Park', 'TUSCALOOSA, AL'],
              ['First and Main', 'NORTHPORT, AL'],
              ['The Station', 'NORTHPORT, AL'],
              ['Forest Lake', 'TUSCALOOSA, AL'],
            ].map(([p, city], i) => (
              <div key={p} style={{
                background: [RP.blue, RP.pink, RP.yellow, RP.green][i],
                color: '#fff',
                border: '3px solid var(--rp-ink)', boxShadow: '4px 4px 0 var(--rp-ink)',
                padding: '20px 18px', transform: `rotate(${[-0.6, 0.8, -0.4, 0.6][i]}deg)`,
              }}>
                <div style={{ fontFamily: RP.mono, fontSize: 9, letterSpacing: 2 }}>№ 0{i + 1}</div>
                <div style={{ fontFamily: RP.display, fontSize: 22, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: -0.8, marginTop: 6 }}>{p}</div>
                <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 1.5, marginTop: 8, opacity: 0.8 }}>{city}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { WorkflowExplainer });
