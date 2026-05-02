# OpenClaw Viz site review — 2026-04-28

Reviewed live site: https://openclaw-viz-mu.vercel.app/
Local project found: `/Users/carsonpalmer/Developer/openclaw-website`

## Overall read

Status: WATCH.

The page is impressive and mostly understandable as a public-safe operating-system map for Carson's workflow automation setup. It explains the runtime, scheduler, Sarah voice subsystem, services, graph, and related apps with real specificity. The main risk is that the page asks a first-time visitor to absorb too much internal shape before giving them a simple orientation and next action.

## Top recommendations

1. **Add a plain-language summary near the top.**
   - Current framing is accurate, but a visitor may still wonder: "Is this a product, internal dashboard, case study, or public portfolio artifact?"
   - Suggested copy: "This is a public, sanitized dashboard of a local automation system that helps one operator manage property workflows, reminders, reviews, and voice intake."

2. **Reduce insider naming or define it earlier.**
   - Names like Eddie Morra, Guardian Zero, Tony Montana, Sarah, and Archive Monk are memorable, but they add cognitive load.
   - Keep the names, but pair every name with a role label everywhere: "Eddie Morra — property operations," "Guardian Zero — ops health," etc.

3. **Clarify the main CTA / next action.**
   - Current quick links are useful but equal-weight. Pick one primary path for new visitors.
   - Recommended primary CTA: "Start with the runtime map." Secondary: "See the scheduler" and "Review Sarah voice flow."

4. **Tighten copy that feels too casual or clever.**
   - Replace phrases like "ugly edge cases," "scale theater," "just overkill," and "She answers the phone" with simpler professional language.
   - The best tone is already present in lines like "publish-safe runtime view" and "what is automated, what still needs judgment."

5. **Make data freshness and trust/privacy more explicit.**
   - The site says sanitized/no secrets, which is good. Add a small persistent "Data note" explaining what is live, what is generalized, and when counts were last verified.
   - This helps with trust because the page mentions real properties, services, vendors, and voice/account workflows.

## Section notes

- **Hero:** Strong visual identity and honest positioning. Needs one short "what this is" sentence before the longer explanation.
- **Runtime / lanes:** Useful, but agent names should always carry role labels. Good place to add "human judgment required" boundaries.
- **Scheduler:** Strongest section. The 24-hour strip and job-family registry communicate real operating cadence.
- **Sarah voice:** Clear and credible. Privacy/trust concerns are highest here; keep emphasizing consent, account boundaries, and no unrestricted tenant access.
- **Services / graph:** Useful for technical visitors, but could use a "why it matters" line before dense vendor/node lists.
- **Apps:** Helps distinguish runtime from customer-facing products. Consider moving this closer to the end with a clearer transition: "What this powers."
- **Footer:** Good trust language. Consider repeating the last verified date nearer the top.

## Quick copy swaps

- "The ugly edge cases that usually end up scattered..." → "The exception cases that usually get scattered..."
- "The point is not scale theater." → "The goal is not to imply enterprise scale."
- "just overkill" → "more complexity than the workflow needs"
- "She answers the phone." → "Sarah handles phone intake."
- "not a polished product spec" → "not a formal product specification"

## Quick wins

- Add a one-sentence definition under the hero title.
- Rename quick links to simpler verbs: "Start with runtime," "View scheduler," "See voice intake."
- Add role labels beside agent names in legends/cards.
- Add a top-level "Data note" chip: "Sanitized public view · counts generalized · verified YYYY-MM-DD."
- On mobile, reduce giant uppercase headings one step and keep cards flatter/less rotated for easier scanning.

## No-change guardrails observed

No live changes, commits, pushes, external messages, secret access, or production config changes were made.
