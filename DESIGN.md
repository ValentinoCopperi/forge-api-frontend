---
name: Forge Control Room
description: A compact, continuous operations ledger for live API-backed work.
colors:
  decision-violet-deep: "#251d9a"
  decision-violet: "#5b4ff0"
  decision-violet-dark-mode: "#9b91f5"
  decision-violet-soft: "#eae8fd"
  live-lime: "#c2e53a"
  live-lime-soft: "#eef6cc"
  ink: "#0d0d0f"
  paper: "#ffffff"
  canvas-light: "#f6f6f4"
  canvas-dark: "#0a0a12"
  surface-dark: "#15151f"
  surface-subtle-light: "#f0f0ed"
  foreground-light: "#151519"
  foreground-dark: "#f3f3f1"
  muted-foreground-light: "#67676f"
  muted-foreground-dark: "#a4a4aa"
  success: "#11643b"
  success-soft: "#ddf5e8"
  destructive: "#dc2626"
typography:
  display:
    fontFamily: "Noto Sans Variable, Segoe UI, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Noto Sans Variable, Segoe UI, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Noto Sans Variable, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Noto Sans Variable, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  body-strong:
    fontFamily: "Noto Sans Variable, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: "Noto Sans Variable, Segoe UI, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.1em"
rounded:
  sm: "4px"
  md: "7px"
  lg: "10px"
  xl: "12px"
  2xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.decision-violet}"
    textColor: "{colors.paper}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "32px"
  button-primary-dark:
    backgroundColor: "{colors.decision-violet-dark-mode}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "32px"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.foreground-light}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "32px"
  input-ledger:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.foreground-light}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "44px"
  nav-active:
    backgroundColor: "{colors.decision-violet-soft}"
    textColor: "{colors.decision-violet-deep}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
    height: "36px"
  ledger-surface:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.foreground-light}"
    rounded: "{rounded.xl}"
    padding: "20px"
  live-status:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.label}"
    rounded: "{rounded.2xl}"
    padding: "2px 8px"
---

# Design System: Forge Control Room

## Overview

**Creative North Star: "The Control-Room Ledger"**

Forge is an ink-and-paper operations surface made for scanning real work, not admiring disconnected decoration. Its compact type, steady seams, and joined data regions make the interface read like one continuously updated ledger: first confirm the latest API response, then move through organizations, projects, tasks, roles, and the tutorial without losing context.

Violet marks decisions, selection, focus, and active navigation in both themes. Lime is a scarce signal reserved for live or status-bearing moments. Cards are permitted only as bounded sections of a larger workflow; on data-heavy screens, prefer shared shells, internal dividers, and rows over a field of unrelated floating tiles.

**Key Characteristics:**

- Compact Noto Sans typography with strong numeric and label hierarchy.
- Ink, paper, and low-contrast seams create the material world.
- Violet identifies action and current context; lime communicates live state only.
- Joined surfaces and ledger rows preserve operational continuity.
- A collapsible rail, 64px command bar, and compact breadcrumb strip anchor the first viewport.

## Colors

The palette is deliberately narrow: paper and ink carry most of the interface, violet carries decisions, and status colors remain semantic and scarce.

### Primary

- **Decision Violet:** The default light-theme action, selected-state, link, chart, and focus color.
- **Night Decision Violet:** The brighter dark-theme equivalent, chosen to retain contrast against ink surfaces.
- **Deep Decision Violet:** Foreground for pale violet selections and quiet branded emphasis.
- **Violet Wash:** Active-navigation and low-intensity decision background.

### Secondary

- **Live Lime:** A pinpoint status beacon for connected, current, or running states; never a general-purpose action color.
- **Live Lime Wash:** The low-intensity status surface when a live condition needs an area rather than a dot.

### Tertiary

- **Success Ink / Success Wash:** Loaded, healthy, or complete API state.
- **Destructive Red:** Validation, error, and irreversible-action signaling.

### Neutral

- **Forge Ink:** Near-black brand ink and dark-theme action foreground.
- **Forge Paper:** Primary raised surface and light-theme control fill.
- **Workshop Canvas:** Warm light-theme app canvas behind the ledger.
- **Night Canvas:** Dark-theme app canvas.
- **Night Ledger:** Dark-theme card and section surface.
- **Quiet Paper:** Light-theme muted bands, table headers, and hover fills.
- **Foreground Light / Foreground Dark:** Theme-specific primary text.
- **Muted Foreground Light / Muted Foreground Dark:** Supporting copy, labels, and inactive controls.

### Named Rules

**The Decision Ink Rule.** Violet belongs to actions, focus, selection, and current context; it is not decorative wallpaper.

**The Live Signal Rule.** Lime appears only when the UI is communicating a live or status-bearing condition.

## Typography

**Display Font:** Noto Sans Variable (with Segoe UI and sans-serif fallbacks)  
**Body Font:** Noto Sans Variable (with Segoe UI and sans-serif fallbacks)  
**Label/Mono Font:** Noto Sans Variable; numeric readouts use tabular figures rather than a separate mono face.

**Character:** The single-family system is compact, practical, and unusually disciplined. Weight, tracking, capitalization, and tabular figures create hierarchy without introducing a second visual voice.

### Hierarchy

- **Display:** Extra-bold, tightly tracked page and dashboard hero statements; the implemented maximum is the compact dashboard display role.
- **Headline:** Extra-bold section-leading or empty-state statements.
- **Title:** Bold section titles and panel headings.
- **Body:** Default application copy and control text with a 1.5 line-height; longer descriptions commonly move to a 24px line box.
- **Label:** Extra-small, bold, widely tracked uppercase metadata for table heads, control labels, and operational eyebrows.

### Named Rules

**The Compact Authority Rule.** Hierarchy comes from weight and controlled tracking before it comes from oversized type.

**The Ledger Numeral Rule.** Counts and operational values use tabular figures so columns remain stable while live data changes.

## Layout

The application shell is a continuous operational frame. At large breakpoints the left rail is fixed at 16rem and can collapse to 4.5rem; below that threshold it becomes an off-canvas drawer. The content column shifts with the rail rather than sitting in a separate floating frame.

The command bar is 64px high and sticky, followed by a 36px breadcrumb strip separated by a hairline seam. Main content uses responsive gutters of 16px, 24px, and 32px and is capped at 1680px. Dashboard sections keep a 24px vertical rhythm. Within surfaces, 12–20px spacing is the ordinary working density; 24px is reserved for larger section breathing room.

Data summaries are grouped inside one rounded shell and divided into responsive columns with shared borders. Organization and project collections use divided rows. The reading order in the first viewport is deliberate: verify the latest response state, scan the current totals, then use the rail to navigate organizations, projects, tasks, roles, or the tutorial.

**The Continuous Surface Rule.** When items belong to one dataset or workflow, place them in one shell with dividers; do not scatter them as unrelated floating cards.

## Elevation & Depth

Forge is flat by default and uses tonal layering plus hairline seams to express structure. The small shadow sits under bounded ledger shells and branded controls; the medium shadow is reserved for auth panels or transient elevated surfaces. Hover may strengthen the shadow slightly, but borders and fill shifts carry most state changes.

### Shadow Vocabulary

- **Ledger Low** (`var(--shadow-sm)`): Bounded dashboard shells, hero surfaces, small brand controls, and compact primary actions.
- **Panel Medium** (`var(--shadow-md)`): Auth panels and stronger transient elevation.

### Named Rules

**The Seam-Before-Shadow Rule.** Use borders, dividers, and tonal bands to establish hierarchy before adding elevation.

## Shapes

Corners stay within a compact 4–16px vocabulary. Controls and active nav rows use the 7px medium radius; brand marks use 10px; ledger shells use 12px; only modal steps, large empty-state icons, and pill statuses reach 16px or fully rounded ends. Hairline borders divide related regions, while overflow clipping keeps joined surfaces visually continuous.

**The Joined Edge Rule.** A shell may be rounded at its perimeter, but adjacent data cells and rows meet on straight, shared seams.

## Components

### Buttons

- **Shape:** Compact rectangular controls with gently curved corners; the default height is 32px, rising to 36–44px only for large or full-width form actions.
- **Primary:** Theme-responsive violet fill, high-contrast foreground, 12px horizontal padding, and the low ledger shadow.
- **Hover / Focus:** Hover lowers brightness slightly; focus adds a three-pixel translucent ring and matching border; press moves the control down by one pixel.
- **Outline / Ghost / Secondary:** Outline controls sit on the current canvas with a hairline border; ghost controls reveal a muted fill on interaction; secondary controls use the quiet neutral surface.

### Chips

- **Style:** Small, bold status text with rounded ends and a low-intensity semantic fill. Uppercase 10px labels are used for API health and section badges.
- **State:** A small current-color dot precedes live state. Violet chips identify selected context; lime and success tones communicate state, never navigation.

### Cards / Containers

- **Corner Style:** Ledger shells use the 12px radius; internal children are squared off and joined by seams.
- **Background:** Paper in light mode and Night Ledger in dark mode, against the quieter app canvas.
- **Shadow Strategy:** Low elevation at the perimeter only; internal regions use no individual shadows.
- **Border:** Hairline seams separate headers, meta bands, stat cells, and rows.
- **Internal Padding:** 20px is standard; compact rows use 12–16px vertically and 16–20px horizontally.

### Inputs / Fields

- **Style:** 44px-high paper field, 7px radius, fine neutral border, 12px horizontal padding, and right-side icon or adornment support.
- **Focus:** Border changes to decision violet with a translucent three-pixel ring.
- **Error / Disabled:** Error uses destructive border and copy; disabled actions retain structure at half opacity and remove pointer interaction.

### Navigation

The fixed rail groups links under 9px uppercase labels. Rows are at least 36px high with a 7px radius; the active row uses the violet wash and violet icon, while inactive rows rely on muted text and reveal a softer active fill on hover. Collapsing the rail hides labels but keeps icons and title affordances. On mobile, the rail becomes a modal drawer with a dark scrim.

The command bar is a 64px sticky surface with compact title, API-health chip, workspace command, theme toggle, and user control. A separate 36px breadcrumb strip preserves location without competing with the page heading.

### Live API Ledger

The dashboard summary is the signature pattern: hero copy and latest-response status share a single shell with the stat grid below. Each stat is a column in the same ledger, with an icon gutter, tabular value, supporting copy, and a seamed API-live footer. This pattern should be extended for related operational datasets.

## Do's and Don'ts

### Do:

- **Do** lead the first viewport with current API state and the most decision-relevant totals.
- **Do** combine related summaries and rows inside one 12px ledger shell with hairline seams.
- **Do** use violet for decisions, current context, links, focus, and selection in both themes.
- **Do** reserve lime for live or status-bearing signals and keep it visually scarce.
- **Do** preserve the 16rem/4.5rem rail, 64px command bar, and compact breadcrumb hierarchy when extending the shell.
- **Do** keep interactive states visible through fill, border, ring, and one-pixel press feedback.

### Don't:

- **Don't** turn a related dataset into a dashboard of disconnected floating cards.
- **Don't** use lime for primary buttons, ordinary links, or decorative emphasis.
- **Don't** inflate typography to manufacture hierarchy; use weight, tracking, labels, and seams first.
- **Don't** add shadows to every internal cell or row.
- **Don't** introduce radii outside the established 4–16px control and surface vocabulary without a component-level reason.
