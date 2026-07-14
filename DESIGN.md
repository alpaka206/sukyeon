# Sukyeon MRO Design System

## 1. Atmosphere & Identity

Sukyeon MRO should feel like a dependable manufacturing partner: technical, direct, and calm rather than decorative. The signature is clean industrial confidence, using a white and pale-blue surface system with royal blue accents taken from the company logo and product cans.

## 2. Color

### Palette

| Role              | Token                    | Light     | Dark      | Usage                                                                          |
| ----------------- | ------------------------ | --------- | --------- | ------------------------------------------------------------------------------ |
| Surface/primary   | `--surface-primary`      | `#ffffff` | N/A       | Main page background                                                           |
| Surface/secondary | `--surface-secondary`    | `#fbfcfe` | N/A       | Hero text side                                                                 |
| Surface/muted     | `--surface-muted`        | `#f6f9fb` | N/A       | Alternating sections                                                           |
| Surface/tint      | `--surface-tint`         | `#eef2fc` | N/A       | Icon and accent backgrounds                                                    |
| Text/primary      | `--text-primary`         | `#0a1b33` | N/A       | Headlines, important copy                                                      |
| Text/body         | `--text-body`            | `#5a6680` | N/A       | Paragraphs                                                                     |
| Text/muted/light  | `--color-muted`          | `#5e6c84` | N/A       | Labels and secondary metadata on white, secondary, or muted light surfaces     |
| Text/muted/dark   | `--color-muted-dark`     | N/A       | `#9fb0c9` | Footer and secondary metadata on navy                                          |
| Border/default    | `--border-default`       | `#eaeef3` | N/A       | Section dividers                                                               |
| Border/card       | `--border-card`          | `#e2e6ed` | N/A       | Product card outlines                                                          |
| Accent/primary    | `--accent-primary`       | `#22409b` | N/A       | Links, active accents, brand emphasis                                          |
| Accent/deep       | `--accent-deep`          | `#18306f` | N/A       | Hover and deep emphasis                                                        |
| Accent/bright     | `--accent-bright`        | `#4f74e6` | N/A       | Decorative blue that is not used for normal text or white-text CTA backgrounds |
| Accent/on-dark    | `--color-accent-on-dark` | N/A       | `#89a7ff` | Eyebrows, links, and hover text on navy                                        |

### Rules

- Blue is functional, not decorative: use it for emphasis, links, and calls to action.
- Text-heavy areas stay on white or pale blue surfaces.
- Raw color usage in existing Tailwind classes should map back to the palette above.
- Normal text must reach at least 4.5:1 on its actual surface. `--color-muted` measures 5.02:1 or better on the three declared light surfaces, `--color-muted-dark` measures 7.83:1 on navy, and `--color-accent-on-dark` measures 7.42:1 on navy.
- White-text CTAs use `--accent-primary` (`#22409b`, 9.23:1) rather than `--accent-bright` (`#4f74e6`, 4.22:1).

## 3. Typography

### Scale

| Level     | Size                       | Weight  | Line Height | Tracking  | Usage                     |
| --------- | -------------------------- | ------- | ----------- | --------- | ------------------------- |
| Display   | `clamp(26px, fluid, 54px)` | 800     | 1.32-1.4    | `-0.03em` | Home hero                 |
| H1        | `44px` max                 | 800     | 1.2-1.3     | `-0.02em` | Page titles               |
| H2        | `40px` max                 | 800     | 1.25-1.35   | `-0.02em` | Section headers           |
| H3        | `20-22px`                  | 700-800 | 1.35-1.45   | 0         | Card and CTA titles       |
| Body/lead | `15-18px`                  | 400     | 1.75-1.85   | 0         | Hero and intro paragraphs |
| Body      | `15-16px`                  | 400-600 | 1.6         | 0         | Default copy              |
| Label     | `13-14px`                  | 700     | 1.3         | `0.08em`  | Section labels            |

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

| Token        | Value  | Usage                         |
| ------------ | ------ | ----------------------------- |
| `--space-3`  | `12px` | Inline gaps                   |
| `--space-4`  | `16px` | Compact controls              |
| `--space-5`  | `20px` | Mobile shell padding          |
| `--space-6`  | `24px` | Card rhythm                   |
| `--space-8`  | `32px` | Button and content separation |
| `--space-10` | `40px` | CTA/card padding              |
| `--space-15` | `60px` | Desktop shell padding         |
| `--space-16` | `64px` | Mobile section padding        |
| `--space-22` | `88px` | Desktop section padding       |

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

### Page Header

- **Structure**: public subpages use a full-width title band through `PageHeader`.
- **Color**: the title band background matches the home hero primary CTA (`--accent-primary` / `bg-brand`) for consistent top-level navigation context.
- **Typography**: the eyebrow stays white at reduced opacity; the page title stays white and extra-bold.

### Hero Carousel

- **Structure**: a labelled carousel group with only the active image mounted. It has no visible previous/next controls, slide count, or indicator dots.
- **State**: inactive images are hidden from assistive technology; a polite status announces the active slide description without numbering.
- **Motion**: slides auto-advance every 4 seconds and pause while the pointer hovers over the carousel. Image changes use a 700ms opacity cross-fade; reduced-motion users do not receive automatic rotation.

### Data Mobile Card

- **Structure**: below `sm`, each document is one article with a single full-card link containing its notice or sequence, title, category, date, and attachment status.
- **Responsive rule**: mobile cards and the `sm`-and-up table are mutually exclusive; narrow screens must never expose a clipped or horizontally scrolling table.
- **States**: the whole card is the only interactive target and keeps a visible browser focus ring; use existing brand, muted-text, and brand-soft tokens.
- **Accessibility**: the list has a Korean label, each title is a heading, and the full card keeps one unambiguous accessible name and a minimum 44px target.

### Admin Editor Section

- **Structure**: collapsible white section with a pale-blue header tint, left disclosure arrow, title, optional helper text, and an optional right-aligned primary action.
- **Spacing**: 16px mobile padding, 20px desktop padding, 12-16px gaps inside forms.
- **Purpose**: make long content forms scannable without turning every input into a separate card.
- **Default State**: sections start collapsed so long product and homepage editors show a scannable table of contents first; editors expand only the group they need.
- **States**: hover only on the disclosure control and explicit actions; focus ring uses `--accent-primary`.

### Admin Detail Header

- **Structure**: white command header with a back-to-list action, edit/new status chip, editor label, title, and short helper copy.
- **Purpose**: keep editors oriented before they enter long forms, especially when multiple content types share the same admin shell.
- **Color**: use `--accent-primary` for status and editor context; keep the main surface white for form continuity.

### Admin Repeater Card

- **Structure**: nested white card with a left disclosure arrow, drag handle icon, title, and a red destructive action.
- **Labels**: include the saved title/code/year in each card title when available; avoid a separate row-count summary box inside product lists.
- **Empty State**: empty repeaters use a dashed pale-blue panel with a first-add action instead of plain helper text.
- **Default State**: item details start collapsed; the card header keeps the item name, drag handle, and destructive action visible while long fields stay hidden until expanded.
- **Ordering**: users reorder items by dragging the card/handle instead of pressing separate up/down buttons.
- **Depth**: border-first, with a very restrained tinted shadow only on hover/focus-within.
- **Responsive rule**: action labels can collapse after icons on narrow screens, but controls must remain at least 44px tall.

### Admin Sticky Save Bar

- **Structure**: sticky bottom toolbar with status text on the left and cancel/save actions on the right.
- **States**: hidden when unchanged, accent-tinted when edits are pending, disabled save state when saving.
- **Purpose**: keep the save action visible on long admin forms without obscuring form fields.

## 6. Motion & Interaction

| Type     | Duration | Easing | Usage                |
| -------- | -------- | ------ | -------------------- |
| Micro    | `150ms`  | ease   | Links and nav hover  |
| Standard | `200ms`  | ease   | Card hover elevation |

### Rules

- Animate only `opacity`, `transform`, `color`, `background`, `border-color`, and `box-shadow`.
- Every link styled as a button needs a hover state and visible focus behavior through browser defaults or explicit styling.
- Public navigation links defer Next route prefetch until hover instead of prefetching every route as soon as it enters the viewport. This protects the first render while retaining intent-driven navigation warming.
- The home hero carousel advances automatically every 4 seconds and pauses while hovered. Keep visible navigation controls and slide counts out of the first viewport unless the product direction changes again.

## 7. Depth & Surface

### Strategy

Mixed, with borders as the default and restrained tinted shadows only on hover.

| Level          | Value                                      | Usage                     |
| -------------- | ------------------------------------------ | ------------------------- |
| Border/default | `1px solid #eaeef3`                        | Section and grid dividers |
| Border/card    | `1px solid #e2e6ed`                        | Product and feature cards |
| Hover shadow   | `0 18px 44px -14px rgba(10, 27, 51, 0.18)` | Interactive cards only    |
