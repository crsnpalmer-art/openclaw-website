/* global React, RP, Chip, Grain, InkBlock, HandNote */
// Responsive, page-native workflow interactives.

const OPS_STEPS = [
  {
    id: 'intake',
    label: 'Intake',
    eyebrow: 'Inputs',
    color: RP.blue,
    headline: 'Requests arrive from the places work already happens.',
    body: 'Commands, property systems, calendar items, email, and voice intake all feed the same operations layer.',
    bullets: ['Operator commands', 'Approvals and alerts', 'Voice intake', 'Property systems and web sources'],
  },
  {
    id: 'gateway',
    label: 'Gateway',
    eyebrow: 'Runtime',
    color: RP.green,
    headline: 'A local gateway controls the handoff.',
    body: 'The managed gateway starts at login, validates its environment, restarts on failure, and keeps work routed through one observable local entry point.',
    bullets: ['Starts at login', 'Validates setup', 'Managed gateway', 'Auto-restart on failure'],
  },
  {
    id: 'agents',
    label: 'Agents',
    eyebrow: 'Workers',
    color: RP.pink,
    headline: 'Single-purpose lanes own different kinds of work.',
    body: 'The system splits planning, property work, operations health, archive upkeep, finance, and collections so one noisy job does not become the whole system.',
    bullets: ['main: planning', 'work: property operations', 'ops: reliability', 'archive, finance, collections'],
  },
  {
    id: 'schedule',
    label: 'Schedule',
    eyebrow: 'Cadence',
    color: RP.yellow,
    headline: 'Cron and launchd keep recurring work moving.',
    body: 'Cron handles timed jobs and reports. launchd handles durable scripts, keep-alives, dependency restarts, and lower-level service ownership.',
    bullets: ['Reports and reminders', 'Managed scripts', 'Keep-alive services', 'Dependency restarts'],
  },
  {
    id: 'tools',
    label: 'Tools',
    eyebrow: 'Actions',
    color: RP.green,
    headline: 'Tools turn intent into real work.',
    body: 'The runtime can use local tools, browser control, property systems, documents, queues, and web services to turn intent into action.',
    bullets: ['Local tools', 'Browser and docs', 'Property systems', 'Queues and web services'],
  },
  {
    id: 'outputs',
    label: 'Outputs',
    eyebrow: 'Results',
    color: RP.blue,
    headline: 'Results return as visible operating outcomes.',
    body: 'Property operations, Sarah customer service, monitoring, cadence reminders, and documentation all update the loop instead of disappearing into tool sprawl.',
    bullets: ['Property ops', 'Sarah service', 'Ops health', 'Documentation and cadence'],
  },
];

const SARAH_PATHS = [
  {
    id: 'tour',
    label: 'Tour request',
    color: '#1576d2',
    trigger: 'Prospect asks for a tour by phone or SMS.',
    route: ['Caller', 'Sarah detects leasing intent', 'Worker validates request', 'Calendar + tour queue update', 'SMS confirmation sent'],
    outcome: 'Tour scheduled',
    detail: 'Sarah handles booking, rescheduling, and tour questions while the worker logs the request and checks safety gates before outbound messages.',
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    color: '#f59e0b',
    trigger: 'Resident reports a maintenance issue.',
    route: ['Resident', 'Sarah classifies maintenance', 'Worker logs details', 'Sheet / queue receives item', 'Carson or ops follows up'],
    outcome: 'Maintenance logged',
    detail: 'The path captures the issue cleanly, keeps the transcript attached, and routes the work without pretending a human never needs to review it.',
  },
  {
    id: 'emergency',
    label: 'Emergency',
    color: '#dc2626',
    trigger: 'Caller reports an urgent safety issue.',
    route: ['Caller', 'Sarah detects emergency', 'Worker bypasses normal cadence', 'Telegram alert fires', 'Human response required'],
    outcome: 'Emergency alert',
    detail: 'Emergency routing is intentionally loud and observable: the workflow prioritizes fast human awareness over quiet automation.',
  },
  {
    id: 'account',
    label: 'Account question',
    color: '#16a34a',
    trigger: 'Caller asks about rent, balance, account status, or tenant details.',
    route: ['Caller', 'Sarah identifies account intent', 'Worker verifies tenant context', 'Tenant directory / data checked', 'Follow-up logged'],
    outcome: 'Carson follow-up',
    detail: 'Sensitive account flows stay bounded by lookup and verification steps instead of giving the voice layer unrestricted access.',
  },
  {
    id: 'general',
    label: 'General message',
    color: '#6d28d9',
    trigger: 'Caller leaves a message, asks an unclear question, or needs a custom answer.',
    route: ['Caller', 'Sarah records context', 'Worker stores transcript', 'Telegram / log update', 'Response path chosen'],
    outcome: 'Call logged',
    detail: 'The fallback path is still useful: it preserves context, records metadata, and gives the operator a clean follow-up item.',
  },
];

const SARAH_CONTROLS = [
  ['Auth token', 'Webhook tools require the Sarah tool token.'],
  ['Message verification', 'Inbound messages are verified before processing.'],
  ['Consent gate', 'Outbound tour reminders require explicit consent.'],
  ['Dry-run mode', 'Routing and reminders can be tested without sending messages.'],
  ['Observability', 'Health, metrics, logs, and queue counts stay visible.'],
];

const WORKFLOW_CHOICES = [
  {
    label: 'Sarah call',
    body: 'A leasing or tenant call becomes an owned follow-up path.',
    mode: 'sarah',
    activeId: 'tour',
    pattern: 'Caller -> Sarah -> Worker -> Queue -> Human gate',
  },
  {
    label: 'Maintenance intake',
    body: 'A resident issue gets captured, classified, logged, and routed.',
    mode: 'sarah',
    activeId: 'maintenance',
    pattern: 'Resident -> Classify -> Log -> Ops follow-up',
  },
  {
    label: 'Emergency alert',
    body: 'Urgent calls skip the quiet path and make human review loud.',
    mode: 'sarah',
    activeId: 'emergency',
    pattern: 'Caller -> Detect emergency -> Telegram -> Human response',
  },
  {
    label: 'Recurring ops',
    body: 'Scheduled checks keep dashboards, reminders, and reviews moving.',
    mode: 'ops',
    activeId: 'schedule',
    pattern: 'Cron -> Gateway -> Lane -> Result -> Log',
  },
];

function ArrowBetween() {
  return (
    <span className="wf-arrow" aria-hidden="true" style={{
      fontFamily: RP.mono,
      fontSize: 18,
      color: 'var(--rp-muted)',
      alignSelf: 'center',
      padding: '0 4px',
    }}>-&gt;</span>
  );
}

function Pill({ children, color, active }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 30,
      border: active ? `2.5px solid ${color}` : '1.5px solid rgba(15,13,11,0.32)',
      background: active ? 'rgba(255,255,255,0.58)' : 'rgba(255,255,255,0.28)',
      padding: '6px 9px',
      fontFamily: RP.mono,
      fontSize: 10,
      letterSpacing: 1,
      color: 'var(--rp-ink)',
    }}>{children}</span>
  );
}

function OperationsFlow({ activeId, setActiveId }) {
  const active = OPS_STEPS.find((step) => step.id === activeId) || OPS_STEPS[0];
  return (
    <div className="wf-panel">
      <div className="ops-flow" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
        gap: 10,
      }}>
        {OPS_STEPS.map((step, index) => {
          const selected = step.id === active.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveId(step.id)}
              className="ops-step"
              style={{
                border: selected ? `3px solid ${step.color}` : '2.5px solid var(--rp-ink)',
                background: selected ? 'var(--rp-paper)' : 'rgba(246,240,225,0.72)',
                boxShadow: selected ? `4px 4px 0 ${step.color}` : '3px 3px 0 var(--rp-ink)',
                color: 'var(--rp-ink)',
                padding: 14,
                textAlign: 'left',
                cursor: 'pointer',
                minHeight: 138,
                display: 'grid',
                alignContent: 'space-between',
                gap: 10,
              }}
            >
              <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                <span style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 1.8, color: step.color }}>0{index + 1}</span>
                <span style={{ width: 13, height: 13, borderRadius: 999, background: step.color, border: '2px solid var(--rp-ink)' }} />
              </span>
              <strong style={{ fontFamily: RP.display, fontSize: 22, lineHeight: 0.92, letterSpacing: -0.8, textTransform: 'uppercase' }}>
                {step.label}
              </strong>
              <span style={{ fontFamily: RP.body, fontSize: 13, lineHeight: 1.35, color: 'var(--rp-muted)' }}>{step.eyebrow}</span>
            </button>
          );
        })}
      </div>

      <div className="wf-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 18, marginTop: 18, alignItems: 'stretch' }}>
        <div style={{
          border: '3px solid var(--rp-ink)',
          background: 'var(--rp-paper)',
          boxShadow: '5px 5px 0 var(--rp-ink)',
          padding: 22,
        }}>
          <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 2.2, color: active.color, textTransform: 'uppercase', marginBottom: 12 }}>
            {active.eyebrow}
          </div>
          <h3 style={{ margin: 0, fontFamily: RP.display, fontSize: 'clamp(30px, 4vw, 52px)', lineHeight: 0.92, letterSpacing: -1.4, textTransform: 'uppercase' }}>
            {active.headline}
          </h3>
          <p style={{ margin: '16px 0 0', fontFamily: RP.body, fontSize: 16, lineHeight: 1.55, color: 'var(--rp-ink)' }}>{active.body}</p>
        </div>
        <div style={{
          border: '3px solid var(--rp-ink)',
          background: 'rgba(255,255,255,0.34)',
          padding: 18,
        }}>
          <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 2, color: 'var(--rp-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
            What this touches
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {active.bullets.map((item) => <Pill key={item} color={active.color} active>{item}</Pill>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function SarahPathExplorer({ activeId, setActiveId }) {
  const active = SARAH_PATHS.find((path) => path.id === activeId) || SARAH_PATHS[0];
  return (
    <div className="wf-panel">
      <div className="sarah-layout" style={{ display: 'grid', gridTemplateColumns: '310px minmax(0, 1fr)', gap: 18, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 8 }}>
          {SARAH_PATHS.map((path) => {
            const selected = path.id === active.id;
            return (
              <button
                key={path.id}
                type="button"
                onClick={() => setActiveId(path.id)}
                style={{
                  border: selected ? `3px solid ${path.color}` : '2.5px solid var(--rp-ink)',
                  background: selected ? 'var(--rp-paper)' : 'rgba(246,240,225,0.72)',
                  boxShadow: selected ? `4px 4px 0 ${path.color}` : 'none',
                  padding: '13px 14px',
                  textAlign: 'left',
                  color: 'var(--rp-ink)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontFamily: RP.display, fontSize: 22, letterSpacing: -0.7, textTransform: 'uppercase', lineHeight: 0.95 }}>{path.label}</div>
                <div style={{ marginTop: 6, fontFamily: RP.body, fontSize: 13, lineHeight: 1.35, color: 'var(--rp-muted)' }}>{path.outcome}</div>
              </button>
            );
          })}
        </div>

        <div style={{
          border: '3px solid var(--rp-ink)',
          background: 'var(--rp-paper)',
          boxShadow: '6px 6px 0 var(--rp-ink)',
          padding: 20,
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'start', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 2.2, color: active.color, textTransform: 'uppercase', marginBottom: 8 }}>Active path</div>
              <h3 style={{ margin: 0, fontFamily: RP.display, fontSize: 'clamp(34px, 5vw, 64px)', lineHeight: 0.9, letterSpacing: -1.8, textTransform: 'uppercase' }}>{active.label}</h3>
            </div>
            <div style={{
              border: `2.5px solid ${active.color}`,
              padding: '10px 12px',
              fontFamily: RP.mono,
              fontSize: 10,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              color: 'var(--rp-ink)',
              background: 'rgba(255,255,255,0.5)',
            }}>{active.outcome}</div>
          </div>

          <p style={{ margin: '16px 0 0', fontFamily: RP.body, fontSize: 16, lineHeight: 1.55, color: 'var(--rp-ink)' }}>{active.trigger}</p>

          <div className="route-row" style={{ display: 'flex', gap: 8, alignItems: 'stretch', flexWrap: 'wrap', marginTop: 22 }}>
            {active.route.map((step, index) => (
              <React.Fragment key={step}>
                <div style={{
                  flex: '1 1 126px',
                  minWidth: 120,
                  border: index === active.route.length - 1 ? `3px solid ${active.color}` : '2px solid var(--rp-ink)',
                  background: index === active.route.length - 1 ? 'rgba(255,255,255,0.68)' : 'rgba(255,255,255,0.34)',
                  padding: 12,
                  minHeight: 78,
                }}>
                  <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 1.4, color: active.color }}>0{index + 1}</div>
                  <div style={{ marginTop: 7, fontFamily: RP.body, fontSize: 14, lineHeight: 1.3, fontWeight: 700 }}>{step}</div>
                </div>
                {index < active.route.length - 1 && <ArrowBetween />}
              </React.Fragment>
            ))}
          </div>

          <div className="sarah-proof" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 18, marginTop: 22, alignItems: 'start' }}>
            <div>
              <p style={{ margin: 0, fontFamily: RP.body, fontSize: 15, lineHeight: 1.55, color: 'var(--rp-muted)' }}>{active.detail}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                {SARAH_CONTROLS.map(([k]) => <Pill key={k} color={active.color}>{k}</Pill>)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => window.open('sarah-customer-service-workflow.webp', '_blank', 'noopener,noreferrer')}
              style={{
                border: '2.5px solid var(--rp-ink)',
                background: '#fff',
                padding: 0,
                cursor: 'zoom-in',
                boxShadow: '4px 4px 0 var(--rp-ink)',
                overflow: 'hidden',
                color: 'var(--rp-ink)',
              }}
            >
              <img src="sarah-customer-service-workflow.webp" alt="Sarah Customer Service workflow reference" style={{ display: 'block', width: '100%', height: 150, objectFit: 'cover', objectPosition: 'center top' }} />
              <span style={{ display: 'block', padding: '8px 10px', fontFamily: RP.mono, fontSize: 10, letterSpacing: 1.3, textTransform: 'uppercase' }}>Open source diagram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InteractiveWorkflowImages() {
  const [mode, setMode] = React.useState('ops');
  const [opsActive, setOpsActive] = React.useState('gateway');
  const [sarahActive, setSarahActive] = React.useState('tour');

  const tabs = [
    { id: 'ops', label: 'Operations flow' },
    { id: 'sarah', label: 'Sarah path explorer' },
  ];

  return (
    <section id="workflow-images" data-screen-label="03 Interactive Workflow Images" style={{
      position: 'relative',
      padding: '86px clamp(20px, 4.5vw, 48px)',
      overflow: 'hidden',
      borderBottom: '3px solid var(--rp-ink)',
      background: 'var(--rp-paper)',
    }}>
      <style>{`
        #workflow-images .wf-panel {
          border: 3px solid var(--rp-ink);
          background: rgba(255,255,255,0.24);
          box-shadow: 7px 7px 0 var(--rp-ink);
          padding: clamp(14px, 2.6vw, 24px);
        }
        #workflow-images button:hover {
          transform: translateY(-1px);
        }
        @media (max-width: 920px) {
          #workflow-images .ops-flow,
          #workflow-images .wf-detail-grid,
          #workflow-images .sarah-layout,
          #workflow-images .sarah-proof {
            grid-template-columns: 1fr !important;
          }
          #workflow-images .ops-step {
            min-height: 112px !important;
          }
        }
        @media (max-width: 680px) {
          #workflow-images .route-row {
            display: grid !important;
            grid-template-columns: 1fr !important;
          }
          #workflow-images .wf-arrow {
            transform: rotate(90deg);
            justify-self: center;
            padding: 0 !important;
          }
        }
      `}</style>
      <Grain opacity={0.06} />
      <InkBlock color={RP.yellow} width={180} height={180} top={90} right={54} rotate={8} opacity={0.35} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 26 }}>
          <div>
            <Chip color={RP.green} size="md" style={{ transform: 'rotate(1deg)', marginBottom: 16 }}>
              Section 02 - Interactive workflows
            </Chip>
            <h2 style={{
              margin: 0,
              fontSize: 'clamp(44px, 7vw, 94px)',
              lineHeight: 0.88,
              fontWeight: 900,
              letterSpacing: -3,
              textTransform: 'uppercase',
              fontFamily: RP.display,
              maxWidth: '14ch',
            }}>
              Click a step.<br />Watch the handoff.
            </h2>
          </div>
          <HandNote color={RP.pink} fontSize={23} maxWidth={260} style={{ transform: 'rotate(-2deg)' }}>
            fitted to the page, not pasted onto it
          </HandNote>
        </div>

        <p style={{ margin: '0 0 24px', maxWidth: '74ch', fontFamily: RP.body, fontSize: 18, lineHeight: 1.58, color: 'var(--rp-muted)' }}>
          The diagrams are rebuilt as interactive webpage sections. Use the operations flow to understand the automation pattern, then switch to Sarah to trace exactly how a phone call or SMS becomes a logged result.
        </p>

        <div style={{
          margin: '0 0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}>
          {WORKFLOW_CHOICES.map((choice) => (
            <button
              key={choice.label}
              type="button"
              onClick={() => {
                setMode(choice.mode);
                if (choice.mode === 'sarah') setSarahActive(choice.activeId);
                else setOpsActive(choice.activeId);
              }}
              style={{
                border: '2.5px solid var(--rp-ink)',
                background: 'rgba(255,255,255,0.34)',
                boxShadow: '4px 4px 0 var(--rp-ink)',
                padding: 16,
                textAlign: 'left',
                cursor: 'pointer',
                color: 'var(--rp-ink)',
              }}
            >
              <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 1.8, color: RP.pink, textTransform: 'uppercase' }}>
                Choose a workflow
              </div>
              <div style={{ marginTop: 8, fontFamily: RP.display, fontSize: 25, lineHeight: 0.95, letterSpacing: -0.8, textTransform: 'uppercase' }}>
                {choice.label}
              </div>
              <p style={{ margin: '10px 0 0', fontFamily: RP.body, fontSize: 14, lineHeight: 1.45, color: 'var(--rp-muted)' }}>{choice.body}</p>
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1.5px dashed var(--rp-ink)', fontFamily: RP.mono, fontSize: 10, letterSpacing: 1.2, lineHeight: 1.5 }}>
                {choice.pattern}
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              style={{
                border: '2.5px solid var(--rp-ink)',
                background: mode === tab.id ? RP.yellow : 'var(--rp-bg)',
                color: 'var(--rp-ink)',
                boxShadow: mode === tab.id ? '4px 4px 0 var(--rp-ink)' : 'none',
                padding: '11px 14px',
                fontFamily: RP.mono,
                fontSize: 10.5,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {mode === 'ops' ? (
          <OperationsFlow activeId={opsActive} setActiveId={setOpsActive} />
        ) : (
          <SarahPathExplorer activeId={sarahActive} setActiveId={setSarahActive} />
        )}
      </div>
    </section>
  );
}

Object.assign(window, { InteractiveWorkflowImages });
