# Coaching Platform — Product Roadmap

**Owner:** Joe Fraser
**Status:** Active — Phase 1 in progress
**Last updated:** August 14, 2026

---

## 1. Problem & Vision

An independent HR/career coach has deep recruiter-side experience but no scalable way to reach or convert clients. Manual outreach doesn't scale, and generic resume-review competitors (TopResume, The Muse) compete on volume, not judgment. The opportunity: pair her actual expertise with a self-qualifying lead funnel and a platform that gets more capable over time without requiring her to do more manual work per client.

**Vision:** A coaching platform where an AI-powered resume pre-scan does the qualifying work for free, and every paid engagement she runs afterward is higher-signal because of it.

---

## 2. Success Metrics

Modeled on how this kind of roadmap should actually be measured — priority and scale first, velocity second:

- **Priority/scale organization:** every roadmap item below is sequenced by what unlocks the next phase, not by what's most interesting to build.
- **Sustainable velocity:** each phase ships something usable on its own — nothing is held hostage waiting for a "big launch." Phase 1 was live within a week of scoping.
- **Lead quality over lead volume:** success is measured by pre-scan-to-booked-call conversion, not raw site traffic.
- **Time-to-value for the coach:** how much of her manual admin work (intake, prep, scheduling) gets absorbed by the platform without her losing control of the client relationship.

---

## 3. Stakeholders & Requirements Approach

One primary stakeholder (the coach), consulted iteratively rather than handed a finished spec:

- Weekly check-ins to review what's built against what she actually needs day-to-day, not what looked good on paper.
- Every feature ships as a testable prototype she uses on real (or beta) clients before it's considered "done" — feedback comes from usage, not a demo.
- Privacy-first by default: resume content and client data are never used to train anything, and the pre-scan tool is explicit with users about what happens to their data before they upload.

---

## 4. Roadmap Phases

### Phase 0 — Discovery & Validation (Complete)
**Goal:** Confirm there's a real market and a real wedge before writing code.
- Market sizing (career coaching industry, AI-coaching sub-segment)
- Competitor landscape (TopResume, The Muse, generic AI resume tools)
- Positioning: her recruiter judgment as the differentiator AI tools can't replicate
**Why first:** building anything before this would be prioritizing output over validated direction.

### Phase 1 — MVP: Presence + Manual Booking (In Progress)
**Goal:** Get a live URL and start building audience before the platform exists.
- One-page site, deployed same day (`create-next-app` → Vercel)
- Calendly link for booking — zero custom booking logic yet
- 3 LinkedIn posts from her recruiter experience
- 3 beta clients, free or discounted, in exchange for testimonials
**Why before the funnel tool:** momentum and audience-building don't need the AI tool to start. Building the funnel before there's anyone to feed into it would be sequencing backwards.
**Success criteria:** live site, first beta client booked.

### Phase 2 — Lead Funnel: Resume Pre-Scan Tool
**Goal:** Turn free value into a self-qualifying pipeline.
- Claude API integration: resume upload → structured critique (missing impact metrics, generic headline, etc.) → personalized `bookingHook` explaining why a paid session would help
- Positioned as a recruiter's read, not a generic AI grammar check
**Why before payments/full platform:** this is the single highest-leverage feature — it's the thing competitors don't have. Validating it works with real users matters more than having a polished checkout flow around it.
**Dependency:** Phase 1 site must exist to host it.

### Phase 3 — Platform Buildout
**Goal:** Replace manual booking/payment with a real flow.
- Stripe integration for paid sessions
- Cal.com integration replacing the bare Calendly link
- Full site pages (services, about, testimonials, blog)
**Why after the funnel tool, not before:** no point building payment infrastructure around a funnel that hasn't been validated with real users yet.

### Phase 4 — Agent Layer
**Goal:** Absorb the coach's manual admin work without losing her voice in client sessions.
Build order, sequenced by leverage-per-effort, not novelty:
1. **Intake-to-brief agent** — fires on every Cal.com booking, turns intake answers into a prep brief automatically. Built first because it has immediate, zero-effort business value and runs entirely in the background.
2. **Resume deep-analysis agent** — upgrades the Phase 2 scan from a single API call into something that cross-references actual job postings the client is targeting.
3. **Mock interview agent** (flagship) — the feature that makes this platform categorically different from competitors, built last because it's the highest complexity and depends on lessons from agents 1–2.
**Why this order:** each agent is scoped so nothing built in an earlier phase gets thrown away when the next one ships.

### Phase 5 — Content Engine
**Goal:** Systematic audience-building instead of posting when there's energy for it.
- 4 content pillars built from her existing recruiter knowledge
- 6-week content calendar: 5 weeks of giving value before any direct ask
- Services/offers introduced gradually (buried in a client story by week 3, direct by week 6)
**Why it runs in parallel, not sequentially:** content doesn't block platform development, and audience built during Phases 1–3 is what makes Phase 2's funnel tool worth having traffic to.

---

## 5. Current Backlog (Prioritized Snapshot)

| Item | Impact | Effort | Status |
|---|---|---|---|
| Deploy Phase 1 site to Vercel | High | Low | Done |
| Calendly link live | High | Low | Done |
| First 3 LinkedIn posts | Med | Low | In progress |
| Resume pre-scan Claude API route | High | Med | Next up |
| `bookingHook` prompt tuning (recruiter voice, not AI-assistant voice) | High | Low | Next up |
| Stripe checkout | Med | Med | Backlog |
| Cal.com migration | Low | Low | Backlog |
| Intake-to-brief agent | High | Med | Backlog |
| Mock interview agent | High | High | Backlog (flagship, not yet scoped in detail) |

---

## 6. Decision Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-08 | Build one-page MVP before any AI tooling | Momentum and audience need to start now; the AI tool has no users to serve yet without it |
| 2026-08 | Resume pre-scan tool before Stripe/payments | Highest-leverage differentiator should be validated with real usage before infrastructure is built around it |
| 2026-08 | Content calendar front-loads value, delays any sales ask to week 3+ | Trust-building has to precede conversion or the audience never forms |
| 2026-08 | Agent build order: intake-to-brief → resume deep-analysis → mock interview | Sequenced by leverage-per-effort and dependency, not by which is most interesting to build |

---

## 7. What Comes Next

Immediate next actions: ship the resume pre-scan Claude API route, tune the prompt so it reads as recruiter judgment rather than generic AI output, and get it live for the first beta clients from Phase 1.
