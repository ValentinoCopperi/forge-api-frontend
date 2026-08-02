# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**End-users (primary):** Directors, Managers, and Employees who log in to manage real organizations, invite members, assign roles, and track projects and tasks. They operate across multiple organizations and switch context between them.

**Developers (secondary):** Engineers exploring or integrating with the Forge API who use the /tutorial section as an interactive API reference — testing authentication flows, organization endpoints, and avatar management live in the browser.

## Product Purpose

Forge is a full-stack portfolio project demonstrating production-grade engineering across a React 19 + TypeScript frontend and a REST API backend. It enables multi-organization workspace management (orgs, members, roles, projects, tasks) with a live API tutorial layer layered on top. Success means the codebase, UI, and architecture communicate competence, care, and real-world judgment to anyone evaluating the work.

## Positioning

A portfolio and study project whose value is in the quality of the implementation itself. The frontend serves as both the real client for the Forge API and the reference showcase of how that API is meant to be consumed. No market competitor is being targeted; the reviewers are engineers, hiring managers, or collaborators evaluating the author's skills.

## Operating Context

- Users access Forge in a web browser, authenticated via JWT (access token stored in memory, session restored on reload).
- Three role tiers exist within organizations: Director, Manager, Employee — each with distinct permissions surfaced in the UI.
- A sound notification and onboarding modal greet first-time users on dashboard load.
- The /tutorial route provides a section-by-section live API explorer (auth, organizations, avatar, roadmap).
- Data is fetched live from the Forge API and rendered with real-time refresh indicators; no stale mock data is shown.

## Capabilities and Constraints

- Authentication: email/password login and registration with demo accounts (Director, Manager, Employee).
- Organization management: create, list, filter, and manage orgs with tabbed views and stat cards.
- Member management: add/remove members, update roles, manage organization membership.
- Projects and tasks: per-org project tracking and per-project task management (partially implemented; roadmap items exist).
- API tutorial: interactive live-request explorer for auth, organizations, and avatar endpoints.
- Tech stack: React 19, TypeScript, Vite, TailwindCSS v4, Shadcn UI (Radix primitives), TanStack Query, Zustand, React Hook Form + Zod, orval (generated API types), socket.io-client.
- Design system: the existing Shadcn/Tailwind token system is the canonical design language — extend, never replace.

## Brand Commitments

- **Name:** Forge (fixed).
- **Design language:** The current Shadcn/Tailwind component and token system is the established identity. Primary color, chart accent palette, card surface patterns, and component conventions must be preserved and extended, not overridden.
- No logo, official brand guidelines, or external asset package exists yet.

## Evidence on Hand

- Source code is the authoritative reference for all product facts.
- Demo accounts exist: `director@gmail.com`, `manager@gmail.com`, `employee@gmail.com` (all with `Password123!`).
- No external testimonials, case studies, press, or third-party benchmarks exist — future work must not fabricate any.

## Product Principles

1. **Show real work, not mocked work.** Every data point comes live from the API; "Live from API" is the footer on every stat card.
2. **Role and context are always visible.** The user's organization membership, role, and workspace are surfaced at every level of the UI.
3. **The tutorial is a first-class feature.** The /tutorial route is not documentation bolted on — it is an integral surface that demonstrates how the API is consumed.
4. **Quality of implementation is the product.** Code structure, component design, error states, and interaction detail are what the product is selling.
5. **Extend, don't replace.** New surfaces inherit and refine the existing design system; nothing is rebuilt from scratch unless the system cannot support the need.

## Accessibility & Inclusion

No product-specific accessibility requirements have been established beyond standard web conventions. Radix UI primitives (via Shadcn) provide baseline keyboard and ARIA support.
