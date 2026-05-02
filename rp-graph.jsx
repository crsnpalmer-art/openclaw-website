/* global React, RP, Chip, Tape, Arrow, HandNote, InkBlock, StarDoodle, Grain, CircleMark */
// Interactive architecture graph — the real workflow automation wiring

const GRAPH_NODES = [
  // col 0 — triggers
  { id: 'cron', col: 0, row: 0, label: 'Scheduler', kind: 'trigger', blurb: 'Recurring work with named owners and clear lanes. The point is the shape: owner, cadence, reason.' },
  { id: 'launchd', col: 0, row: 1, label: 'System services', kind: 'trigger', blurb: 'Always-on platform checks and script-heavy jobs that do not need an agent turn.' },
  { id: 'tg', col: 0, row: 2, label: 'Telegram', kind: 'trigger', blurb: 'Operator surface and delivery sink. Human commands come in there; summaries and alerts go back out there.' },
  { id: 'voice', col: 0, row: 3, label: 'Inbound Call', kind: 'trigger', blurb: 'An inbound leasing or tenant call is answered, classified, and routed into the right handoff path.' },
  { id: 'gmail-watch', col: 0, row: 4, label: 'Inbox watch', kind: 'trigger', blurb: 'Inbox updates become work items: classify, route to the owning lane, draft or queue.' },

  // col 1 — orchestrator
  { id: 'gateway', col: 1, row: 1.5, label: 'Gateway', kind: 'core', blurb: 'The local entry point. It validates the setup, chooses the right lane, and makes the handoff observable.' },
  { id: 'core', col: 1, row: 3, label: 'Workflow Runtime', kind: 'core', blurb: 'The place where incoming work is routed to the right owner: interactive work, scheduled work, review, or a tool call.' },

  // col 2 — agents (the real roster)
  { id: 'main', col: 2, row: 0, label: 'Control lane', kind: 'agent', blurb: 'Default operator. Interactive control, direct user work, and general orchestration.' },
  { id: 'eddie', col: 2, row: 1, label: 'Property ops lane', kind: 'agent', blurb: 'Property workflows, AppFolio sync, work-order notifications, occupancy reporting.' },
  { id: 'sarah-agent', col: 2, row: 2, label: 'Voice intake lane', kind: 'agent', blurb: 'Sarah as an operating lane: answers inbound calls, understands intent, checks property context, logs outcomes, and hands off uncertain or sensitive work.' },
  { id: 'burry', col: 2, row: 3, label: 'Finance lane', kind: 'agent', blurb: 'Weekly P&L readouts and finance-specific analysis.' },
  { id: 'tony', col: 2, row: 4, label: 'Collections lane', kind: 'agent', blurb: 'Delinquency follow-up, payment-plan review, and no-send collection drafts.' },
  { id: 'zero', col: 2, row: 5, label: 'Reliability lane', kind: 'agent', blurb: 'Cleanup, monitoring, log writing, and reliability chores.' },
  { id: 'monk', col: 2, row: 6, label: 'Review lane', kind: 'agent', blurb: 'Archive review, context upkeep, and self-improvement passes.' },

  // col 3 — model roles
  { id: 'reasoning', col: 3, row: 0.5, label: 'Reasoning', kind: 'model', blurb: 'Drafts, judgments, planning, and the hard calls.' },
  { id: 'coding', col: 3, row: 1.5, label: 'Coding', kind: 'model', blurb: 'Building and maintaining scripts, dashboards, apps, and runtime glue.' },
  { id: 'search', col: 3, row: 2.5, label: 'Context search', kind: 'model', blurb: 'Retrieval layer for finding the right prior context before taking action.' },
  { id: 'fast', col: 3, row: 3.5, label: 'Fast classification', kind: 'model', blurb: 'Classification, extraction, and high-frequency ops work.' },

  // col 4 — services
  { id: 'appfolio', col: 4, row: 0, label: 'AppFolio', kind: 'service', blurb: 'Property backbone — tenants, occupancy, work orders, vendors, reporting.' },
  { id: 'gmail', col: 4, row: 1, label: 'Gmail / Google', kind: 'service', blurb: 'Ingress + data layer — Gmail watch, inbox checks, Workspace docs, Sheets-backed queues for Sarah.' },
  { id: 'notion', col: 4, row: 2, label: 'Notion', kind: 'service', blurb: 'Dashboards, publishing, review notes, and reporting surfaces.' },
  { id: 'voice-stack', col: 4, row: 3, label: 'Voice stack', kind: 'service', blurb: 'The service side of Sarah: telephony, voice AI, backend tools, knowledge retrieval, and operator handoff.' },
  { id: 'motion', col: 4, row: 4, label: 'Motion', kind: 'service', blurb: 'Task creation around follow-up workflows.' },
  { id: 'rply', col: 4, row: 5, label: 'RPLY', kind: 'service', blurb: 'Reminder sidecar for business-text audiences.' },
];

const GRAPH_EDGES = [
  // triggers → gateway / runtime
  ['cron', 'gateway'], ['launchd', 'gateway'], ['tg', 'gateway'], ['gmail-watch', 'gateway'],
  ['voice', 'sarah-agent'],
  // gateway → runtime
  ['gateway', 'core'],
  // runtime → agents
  ['core', 'main'], ['core', 'eddie'], ['core', 'sarah-agent'], ['core', 'burry'], ['core', 'tony'], ['core', 'zero'], ['core', 'monk'],
  // agents → models
  ['main', 'reasoning'], ['main', 'fast'],
  ['eddie', 'reasoning'], ['eddie', 'coding'],
  ['sarah-agent', 'reasoning'], ['sarah-agent', 'fast'],
  ['burry', 'reasoning'],
  ['tony', 'reasoning'], ['tony', 'fast'],
  ['zero', 'fast'],
  ['monk', 'search'], ['monk', 'fast'],
  // agents → services
  ['eddie', 'appfolio'], ['eddie', 'gmail'], ['eddie', 'notion'],
  ['sarah-agent', 'voice-stack'], ['sarah-agent', 'gmail'], ['sarah-agent', 'appfolio'],
  ['burry', 'notion'],
  ['tony', 'appfolio'], ['tony', 'gmail'], ['tony', 'motion'],
  ['zero', 'gmail'], ['zero', 'rply'],
  ['monk', 'notion'],
  ['main', 'notion'], ['main', 'gmail'],
  // Sarah -> data
  ['voice-stack', 'gmail'], ['voice-stack', 'appfolio'],
];

const KIND_COLOR = {
  trigger: RP.orange, core: RP.pink, agent: RP.blue, model: RP.green, service: RP.yellow,
};

function Graph() {
  const [selected, setSelected] = React.useState('core');
  const [hover, setHover] = React.useState(null);
  const active = hover || selected;

  const activeSet = React.useMemo(() => {
    const s = new Set([active]);
    GRAPH_EDGES.forEach(([a, b]) => {
      if (a === active) s.add(b);
      if (b === active) s.add(a);
    });
    return s;
  }, [active]);

  const colWidth = 220;
  const rowHeight = 88;
  const nodeW = 184;
  const nodeH = 64;
  const padX = 24;
  const padY = 24;

  const nodePos = (n) => ({
    x: padX + n.col * colWidth,
    y: padY + n.row * rowHeight,
  });

  const width = padX * 2 + colWidth * 4 + nodeW;
  const height = padY * 2 + rowHeight * 6 + nodeH + 20;

  const selectedNode = GRAPH_NODES.find(n => n.id === selected);

  return (
    <section id="graph" data-screen-label="03 Graph" style={{
      position: 'relative', padding: '80px 48px',
      borderBottom: '3px solid var(--rp-ink)', overflow: 'hidden',
    }}>
      <Grain opacity={0.08} />
      <InkBlock color={RP.yellow} width={280} height={280} top={60} right={-60} radius="50%" />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <Chip color={RP.pink} size="md" style={{ transform: 'rotate(1.5deg)', marginBottom: 16 }}>
          § 05 — The wiring
        </Chip>
        <h2 style={{
          margin: 0, fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 0.88,
          fontWeight: 900, letterSpacing: -3, textTransform: 'uppercase',
          fontFamily: RP.display,
        }}>
          Triggers → gateway →<br/>agents → models → services.
        </h2>
        <p style={{ margin: '18px 0 0', fontSize: 16, lineHeight: 1.55, fontFamily: RP.body, color: 'var(--rp-muted)', maxWidth: '62ch' }}>
          The point of this map is ownership, not internals: work comes in, a lane owns it, tools are called only when needed, and anything risky stays reviewable.
        </p>

        <div style={{
          marginTop: 20, maxWidth: '62ch', padding: '14px 16px',
          border: '2px dashed var(--rp-ink)', background: 'rgba(255,255,255,0.24)',
          fontFamily: RP.body, fontSize: 15, lineHeight: 1.55, color: 'var(--rp-muted)',
        }}>
          <strong style={{ color: 'var(--rp-ink)' }}>Plain-English version:</strong> turn inputs into owned work before any tool starts moving.
        </div>

        <div style={{ marginTop: 30, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {Object.entries(KIND_COLOR).map(([k, c]) => (
            <Chip key={k} color={c} size="sm">● {k}</Chip>
          ))}
        </div>

        <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'start' }}>
          <div style={{
            background: 'var(--rp-paper)', border: '3px solid var(--rp-ink)',
            boxShadow: '6px 6px 0 var(--rp-ink)', padding: 20,
            overflow: 'auto',
          }}>
            <div style={{ position: 'relative', width, height, minWidth: width }}>
              <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width={width} height={height}>
                {GRAPH_EDGES.map(([a, b], i) => {
                  const na = GRAPH_NODES.find(n => n.id === a);
                  const nb = GRAPH_NODES.find(n => n.id === b);
                  if (!na || !nb) return null;
                  const pa = nodePos(na);
                  const pb = nodePos(nb);
                  const x1 = pa.x + nodeW;
                  const y1 = pa.y + nodeH / 2;
                  const x2 = pb.x;
                  const y2 = pb.y + nodeH / 2;
                  const cx = (x1 + x2) / 2;
                  const isActive = a === active || b === active;
                  return (
                    <path key={i}
                      d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                      fill="none"
                      stroke={isActive ? RP.pink : 'rgba(17,17,17,0.2)'}
                      strokeWidth={isActive ? 3 : 1.3}
                      strokeDasharray={isActive ? '0' : '4 3'}
                    />
                  );
                })}
              </svg>

              {['TRIGGERS', 'ORCHESTRATOR', 'AGENTS', 'MODELS', 'SERVICES'].map((l, i) => (
                <div key={i} style={{
                  position: 'absolute', top: -4, left: padX + i * colWidth, width: nodeW,
                  fontFamily: RP.mono, fontSize: 9, letterSpacing: 2, color: 'var(--rp-muted)',
                  textAlign: 'center',
                }}>{l}</div>
              ))}

              {GRAPH_NODES.map((n) => {
                const p = nodePos(n);
                const isActive = activeSet.has(n.id);
                const isSel = n.id === selected;
                const color = KIND_COLOR[n.kind];
                return (
                  <button
                    key={n.id}
                    onClick={() => setSelected(n.id)}
                    onMouseEnter={() => setHover(n.id)}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      position: 'absolute', left: p.x, top: p.y + 12,
                      width: nodeW, height: nodeH,
                      background: isSel ? color : isActive ? color : 'var(--rp-paper)',
                      border: '2.5px solid var(--rp-ink)',
                      boxShadow: isSel ? '5px 5px 0 var(--rp-ink)' : '3px 3px 0 var(--rp-ink)',
                      cursor: 'pointer',
                      padding: '6px 12px',
                      textAlign: 'left',
                      fontFamily: RP.display,
                      color: 'var(--rp-ink)',
                      opacity: isActive ? 1 : 0.55,
                      transition: 'opacity 160ms, background 160ms',
                    }}>
                    <div style={{ fontSize: 9, fontFamily: RP.mono, letterSpacing: 1.5, opacity: 0.7 }}>
                      {n.kind.toUpperCase()}
                    </div>
                    <div style={{ fontSize: 18, lineHeight: 1.05, textTransform: 'uppercase', letterSpacing: -0.4, marginTop: 3 }}>
                      {n.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{
            background: KIND_COLOR[selectedNode.kind], border: '3px solid var(--rp-ink)',
            boxShadow: '6px 6px 0 var(--rp-ink)', padding: 22,
            position: 'relative', top: 0,
          }}>
            <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
              {selectedNode.kind}
            </div>
            <div style={{ fontFamily: RP.display, fontSize: 36, lineHeight: 0.9, textTransform: 'uppercase', letterSpacing: -1.2, marginTop: 8 }}>
              {selectedNode.label}
            </div>
            <p style={{ margin: '14px 0 0', fontFamily: RP.body, fontSize: 15, lineHeight: 1.5 }}>
              {selectedNode.blurb}
            </p>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '2px solid rgba(17,17,17,0.3)' }}>
              <div style={{ fontFamily: RP.mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
                Connected to
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[...activeSet].filter(id => id !== selected).map(id => {
                  const n = GRAPH_NODES.find(x => x.id === id);
                  if (!n) return null;
                  return (
                    <button key={id} onClick={() => setSelected(id)} style={{
                      border: '2px solid var(--rp-ink)', background: 'var(--rp-paper)',
                      padding: '5px 9px', fontFamily: RP.mono, fontSize: 10, letterSpacing: 1.5,
                      textTransform: 'uppercase', cursor: 'pointer',
                    }}>{n.label}</button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Graph });
