# Sukyeon MRO Design System

## 1. Atmosphere & Identity

Sukyeon MRO should feel like a dependable manufacturing partner: technical, direct, and calm rather than decorative. The signature is clean industrial confidence, using a white and pale-blue surface system with royal blue accents taken from the company logo and product cans.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/primary | `--surface-primary` | `#ffffff` | N/A | Main page background |
| Surface/secondary | `--surface-secondary` | `#fbfcfe` | N/A | Hero text side |
| Surface/muted | `--surface-muted` | `#f6f9fb` | N/A | Alternating sections |
| Surface/tint | `--surface-tint` | `#eef2fc` | N/A | Icon and accent backgrounds |
| Text/primary | `--text-primary` | `#0a1b33` | N/A | Headlines, important copy |
| Text/body | `--text-body` | `#5a6680` | N/A | Paragraphs |
| Text/muted | `--text-muted` | `#8a96ab` | N/A | Labels, secondary metadata |
| Border/default | `--border-default` | `#eaeef3` | N/A | Section dividers |
| Border/card | `--border-card` | `#e2e6ed` | N/A | Product card outlines |
| Accent/primary | `--accent-primary` | `#22409b` | N/A | Links, active accents, brand emphasis |
| Accent/deep | `--accent-deep` | `#18306f` | N/A | Hover and deep emphasis |
| Accent/bright | `--accent-bright` | `#4f74e6` | N/A | CTAs on dark navy |

### Rules

- Blue is functional, not decorative: use it for emphasis, links, and calls to action.
- Text-heavy areas stay on white or pale blue surfaces.
- Raw color usage in existing Tailwind classes should map back to the palette above.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Display | `clamp(26px, fluid, 54px)` | 800 | 1.32-1.4 | `-0.03em` | Home hero |
| H1 | `44px` max | 800 | 1.2-1.3 | `-0.02em` | Page titles |
| H2 | `40px` max | 800 | 1.25-1.35 | `-0.02em` | Section headers |
| H3 | `20-22px` | 700-800 | 1.35-1.45 | 0 | Card and CTA titles |
| Body/lead | `15-18px` | 400 | 1.75-1.85 | 0 | Hero and intro paragraphs |
| Body | `15-16px` | 400-600 | 1.6 | 0 | Default copy |
| Label | `13-14px` | 700 | 1.3 | `0.08em` | Section labels |

### Font Stack

- Primary: `Pretendard`, then system sans-serif.
- Mono: mapped to the primary font to keep Korean glyph metrics consistent.

### Rules

- Korean headings use `word-break: keep-all` and balanced wrapping.
- Hero line breaks are intentional. On narrow screens, reduce display size before allowing awkward wrapping.
- Body copy should stay below roughly 65 Korean characters per line.

## 4. Spacing & Layout

### Base Unit

All spacing derives from a base of 4px.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-3` | `12px` | Inline gaps |
| `--space-4` | `16px` | Compact controls |
| `--space-5` | `20px` | Mobile shell padding |
| `--space-6` | `24px` | Card rhythm |
| `--space-8` | `32px` | Button and content separation |
| `--space-10` | `40px` | CTA/card padding |
| `--space-15` | `60px` | Desktop shell padding |
| `--space-16` | `64px` | Mobile section padding |
| `--space-22` | `88px` | Desktop section padding |

### Grid

- Max content width: 1400px.
- Shell padding: 16px mobile, 32px desktop, centered with full-bleed section backgrounds.
- Wide shell uses the same 1400px max width and remains as a semantic alias for emphasized page areas.
- Breakpoints follow Tailwind defaults: `sm 640px`, `md 768px`, `lg 1024px`.

### Rules

- Use the existing `.shell` and `.shell-grid` primitives for page width.
- Keep product and trust sections dense but readable; the home hero can be more spacious.

## 5. Components

### Shell Section

- **Structure**: section with `.shell`, optional grid columns.
- **Spacing**: 64px vertical mobile, 88px vertical desktop for major sections.
- **Accessibility**: semantic sectioning with headings.

### Wide Shell

- **Structure**: `.wide-shell` on the top header, home hero, and wide subpage content. Use `.wide-shell-grid` for desktop SectionLayout pages that should align to the same outer width.
- **Spacing**: 16px mobile, 32px desktop, centered to 1400px.
- **Purpose**: keep first-viewport navigation, hero text, and subpage sections aligned while preserving intentional Korean line breaks.

### Product Card

- **Structure**: link card with visual media block and text block.
- **States**: hover shadow and `translateY(-2px)`.
- **Depth**: border at rest, tinted shadow on hover.

### Product Detail Section

- **Structure**: wide two-column section with one text column and one product selector or photo pair.
- **Content**: keep technical item lists as readable text cards instead of embedding table screenshots.
- **Images**: use real product or factory photos with stable aspect-ratio containers and meaningful alt text.

### Hero Heading

- **Structure**: two block lines inside a single `h1`.
- **Typography**: `.fs-hero`, extra-bold, brand accent on the second line.
- **Responsive rule**: line breaks stay fixed while the font scales down on narrow screens.

### Hero Copy

- **Structure**: two sentence lines under the hero heading.
- **Responsive rule**: keep each sentence on one line at desktop widths; allow natural wrapping below desktop.
- **Tone**: concise manufacturing credibility, avoiding long company-introduction phrasing in the first viewport.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | `150ms` | ease | Links and nav hover |
| Standard | `200ms` | ease | Card hover elevation |

### Rules

- Animate only `opacity`, `transform`, `color`, `background`, `border-color`, and `box-shadow`.
- Every link styled as a button needs a hover state and visible focus behavior through browser defaults or explicit styling.

## 7. Depth & Surface

### Strategy

Mixed, with borders as the default and restrained tinted shadows only on hover.

| Level | Value | Usage |
|-------|-------|-------|
| Border/default | `1px solid #eaeef3` | Section and grid dividers |
| Border/card | `1px solid #e2e6ed` | Product and feature cards |
| Hover shadow | `0 18px 44px -14px rgba(10, 27, 51, 0.18)` | Interactive cards only |
