# GitCric — Complete Product Design System

*"Your GitHub. Your Innings."*
A premium, shareable experience that turns a GitHub profile into a cricket player card — the intersection of GitHub, FIFA Ultimate Team, and ICC Cricket broadcast graphics.

---

## 0. Design Philosophy

| Principle | Meaning |
|---|---|
| **Stat as Spectacle** | A commit count is boring. "247 Not Out" is not. Every GitHub metric is re-skinned as a cricket stat with ceremony — reveal animation, sound, glow. |
| **Dark by Default** | The product lives at night, like a stadium under floodlights. Light mode exists but is the away kit, not the home kit. |
| **One Hero Per Screen** | Every screen has exactly one focal object (the card, the search bar, the stat). Everything else recedes. |
| **Earned, Not Given** | Rarity (Bronze → Silver → Gold → Diamond → Pink Diamond) must feel *achieved*. Visual weight scales with rarity. |
| **Motion Has Meaning** | Animation communicates state change (loading → data → reveal), never decoration for its own sake. |
| **Screenshot-First** | Every screen is designed assuming the primary export is a screenshot shared on X/LinkedIn. Compositions must work as a static frame. |

---

## 1. Design System Foundations

### 1.1 Color Tokens

```
BACKGROUND
--bg-void        #05070A   (page background, almost black, slight blue cast)
--bg-surface-1   #0B0E14   (cards, panels)
--bg-surface-2   #12161F   (raised panels, modals)
--bg-surface-3   #1A2029   (hover surface)
--bg-glass       rgba(18,22,31,0.55) + backdrop-blur(20px)

BRAND
--green-core     #17E88F   (primary accent — "pitch green")
--green-glow     #17E88F55 (used only in box-shadow/blur)
--blue-core      #3B82F6   (secondary accent — "stadium blue")
--blue-glow      #3B82F655

RARITY / CARD TIERS
--tier-bronze    linear-gradient(135deg,#8C5A34,#C88B54)
--tier-silver    linear-gradient(135deg,#8A94A6,#E4E9F0)
--tier-gold      linear-gradient(135deg,#B9862E,#F4D06F)
--tier-diamond   linear-gradient(135deg,#38E1F2,#B8F3FF)
--tier-pink      linear-gradient(135deg,#FF3D9A,#FFB3DA)   (top 0.1% "Legend")

TEXT
--text-primary   #F5F7FA
--text-secondary #9AA4B2
--text-tertiary  #5C6674
--text-inverse   #05070A

SEMANTIC
--success  #17E88F
--warning  #F5B942
--error    #FF5C5C
--info     #3B82F6

BORDERS
--border-hairline   rgba(255,255,255,0.08)
--border-glow-green rgba(23,232,143,0.4)
--border-glow-blue  rgba(59,130,246,0.4)
--border-gradient   linear-gradient(135deg,#17E88F,#3B82F6)
```

### 1.2 Typography Scale

Base unit 4px. Type scale is a 1.250 (Major Third) ratio, anchored at 16px.

| Token | Size | Weight | Use |
|---|---|---|---|
| `display-01` | 72px / -2% ls | 700 | Hero headline |
| `display-02` | 56px | 700 | Player Overall Rating number |
| `h1` | 40px | 700 | Page titles |
| `h2` | 32px | 600 | Section titles |
| `h3` | 24px | 600 | Card titles |
| `h4` | 20px | 600 | Component headers |
| `body-lg` | 18px | 400 | Lead paragraphs |
| `body` | 16px | 400 | Default body |
| `body-sm` | 14px | 400 | Secondary text |
| `caption` | 12px | 500, uppercase, +4% ls | Labels, eyebrow text, stat labels |
| `mono-stat` | 16–56px | 600 | All numeric stats — always tabular-nums monospace for alignment |

**Fonts:** see §16 Typography Pairings.

### 1.3 Spacing Scale (4px base)
`2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128`
Component internal padding: multiples of 8. Section vertical rhythm: multiples of 80 on desktop, 48 on mobile.

### 1.4 Radius Scale
| Token | Value | Use |
|---|---|---|
| `radius-sm` | 8px | Chips, tags, small buttons |
| `radius-md` | 14px | Buttons, inputs |
| `radius-lg` | 20px | Cards, panels |
| `radius-xl` | 28px | Player Card outer frame |
| `radius-full` | 999px | Pills, avatars, toggle tracks |

### 1.5 Shadow / Elevation Scale
| Level | Shadow | Use |
|---|---|---|
| `e0` | none | Flat background elements |
| `e1` | `0 1px 2px rgba(0,0,0,.4)` | Hairline separation |
| `e2` | `0 4px 12px rgba(0,0,0,.35)` | Resting cards |
| `e3` | `0 12px 32px rgba(0,0,0,.45)` | Hover-lifted cards |
| `e4` | `0 24px 64px rgba(0,0,0,.55)` | Modals, popovers |
| `glow-green` | `0 0 24px var(--green-glow), 0 0 2px var(--green-core)` | Active/focus state |
| `glow-tier` | matches card tier gradient, blurred 40px | Player card ambient glow |

### 1.6 Icon Style
Single family across product: **Phosphor Icons (Duotone)** for product UI (consistent 1.5px stroke feel with fill accents), **Lucide** as fallback for any gaps. Cricket-specific glyphs (bat, ball, stumps, boundary rope) commissioned as a custom micro-icon set, matching Phosphor's corner radius and stroke logic, filled with `--green-core` at 20% opacity + solid outline.

### 1.7 Illustration Style
Isometric-flat with a subtle grain/noise overlay and neon rim-light — think Stripe's isometric illustrations crossed with a night-match stadium. No cartoon mascots. Color-limited to brand palette + tier gradients only.

### 1.8 Grid System
- Desktop: 12-column, 1280px max content width, 24px gutter, 80px outer margin.
- Tablet: 8-column, 16px gutter, 40px margin.
- Mobile: 4-column, 16px gutter, 20px margin.

### 1.9 Breakpoints
`sm 375 / md 744 / lg 1024 / xl 1280 / 2xl 1536`

### 1.10 Animation Durations & Easing
| Token | Duration | Easing | Use |
|---|---|---|---|
| `instant` | 100ms | linear | Hover color shifts |
| `fast` | 180ms | `cubic-bezier(.4,0,.2,1)` | Button press, toggle |
| `base` | 280ms | `cubic-bezier(.16,1,.3,1)` (expo-out) | Card hover lift, modal open |
| `slow` | 480ms | expo-out | Page transitions |
| `reveal` | 900–1400ms | custom spring | Card rarity reveal, stat counters |
| `ambient` | 4000–8000ms loop | ease-in-out | Glow pulse, particle drift |

### 1.11 Elevation & Component Variants
Every interactive component ships in: `default / hover / active / focus-visible / disabled / loading`. Buttons ship in `primary / secondary / ghost / destructive / icon-only`, each in `sm / md / lg`.

---

## 2. Pages

For each page: Purpose → Layout → Typography/Color → States → Responsive → Accessibility.

### 2.1 Landing Page
**Purpose:** Convert a cold visitor into a "search my username" action within 5 seconds.

**Layout (desktop, top to bottom):**
1. Sticky glass navbar (72px)
2. Hero (100vh minus nav): eyebrow caption "TURN YOUR COMMITS INTO A CAREER" → 72px display headline → subhead → GitHub-username input with inline CTA → live-rotating example card floating at 3D tilt on the right (parallax on mouse move)
3. Social proof strip: logos/marquee of "1.2M cards generated"
4. "How it Works" — 3-step horizontal timeline (Enter username → We analyze → Get your card), each step a glass panel with icon
5. Stat-to-Cricket mapping explainer — two-column: GitHub icon+stat on left, animated arrow, Cricket stat+icon on right (repeated for Commits→Runs, PRs→Wickets, Stars→Fan Rating, Streak→Not Out)
6. Card Gallery carousel — horizontally scrollable showcase of tier cards (bronze→pink diamond)
7. Testimonials — glass cards with avatar, quote, tier badge of their own card
8. Final CTA band — full-bleed gradient, large input again
9. Footer

**Wireframe (hero, ASCII):**
```
┌──────────────────────────────────────────────────────────┐
│ [Logo] GitCric        Search  Gallery  Achievements  [⚡] │ nav
├──────────────────────────────────────────────────────────┤
│  EVERY COMMIT IS A RUN                     ┌────────────┐ │
│  Turn your GitHub                          │  ⟲ 3D TILT │ │
│  into a Cricket Legend                     │  PLAYER    │ │
│  Enter any GitHub username. Get an         │  CARD      │ │
│  instant, shareable player card.           │  (GOLD)    │ │
│  [ @username        ][ Generate → ]        └────────────┘ │
│  Trusted by 1.2M developers                                │
└──────────────────────────────────────────────────────────┘
```
**Typography/Color:** `display-01` headline in `--text-primary`, gradient underline swipe on "Cricket Legend" (green→blue). Background: `--bg-void` with a subtle radial floodlight glow behind the floating card, faint stadium-crowd-bokeh texture at 4% opacity.

**Empty/Loading/Hover:** Input empty state shows ghost placeholder `@torvalds`; on focus, glow ring `glow-green`; on submit, button morphs into a spinner then a checkmark before route transition.

**Responsive:** Below `lg`, floating card moves below the headline, tilt-parallax disabled (replaced with a slow auto-rotate), CTA input becomes full-width stacked above button.

**Accessibility:** Input has visible label (visually hidden, "GitHub username"), 4.5:1 contrast enforced on all text over gradients, motion-reduced users get instant states instead of tilt/parallax (`prefers-reduced-motion`).

---

### 2.2 Search Page
**Purpose:** Fast, confident entry point for returning users / direct search intent (also reachable via `/search`).

**Layout:** Centered column, max-width 640px, vertically centered on the viewport.
```
┌────────────────────────────────────┐
│         GitCric wordmark           │
│   Find any developer's player card │
│  ┌───────────────────────────────┐ │
│  │ 🔍  @username             ⌘K  │ │  ← search box, command-palette style
│  └───────────────────────────────┘ │
│  Recent:  @sindresorhus  @gaearon  │
│  Trending this week:               │
│  [avatar][avatar][avatar][avatar]  │
└────────────────────────────────────┘
```
**Search Suggestions:** dropdown panel (glass, `radius-lg`, `e3`) appears after 2 characters — rows show avatar, username, real name, small tier-badge chip if they already have a card, keyboard-navigable with highlighted row in `--bg-surface-3`.

**Empty State:** Before typing — friendly illustration of a bat leaning on a stump with the caption "Every legend starts with a search."
**Loading State:** Skeleton rows in the suggestion dropdown (avatar circle + two bars).
**Error State:** "Player not found on GitHub" — illustration of a broken stump, secondary button "Try another username."

**Responsive:** Mobile collapses trending avatars into a horizontal scroll-snap row.
**Accessibility:** Full ARIA combobox pattern; `aria-live="polite"` announces result count.

---

### 2.3 Player Card Page (core screen)
**Purpose:** The payoff. Displays the generated card big, beautiful, and ready to share.

**Layout:**
```
┌───────────────────────────────────────────────────┐
│  ← Back          @username's Card         Share ⤴ │
├───────────────────────────────────────────────────┤
│                 ┌─────────────┐                    │
│   Theme:        │             │      Overall: 87    │
│   [Gold ▾]      │   PLAYER    │      Role: All-     │
│                 │   CARD      │      Rounder        │
│                 │  (tilts on  │                     │
│                 │   pointer)  │      [Download PNG] │
│                 └─────────────┘      [Share]        │
├───────────────────────────────────────────────────┤
│  BATTING STATS          BOWLING STATS               │
│  Runs (commits)  ████░  Wickets (issues closed)     │
│  Strike Rate     ███░░  Economy (bug rate)          │
│  Centuries       ██░░░  Best Figures (biggest PR)   │
├───────────────────────────────────────────────────┤
│  ACHIEVEMENTS   [🏆][🥇][🔥][⭐][🛡️]                │
├───────────────────────────────────────────────────┤
│  Career Graph (contribution graph → run-rate chart) │
└───────────────────────────────────────────────────┘
```
The card itself sits on a subtle rotating floodlight-glow pedestal; pointer movement tilts it in 3D (max 8°) with a specular highlight sweep, like a foil trading card.

**Typography/Color:** Player name in `h2`, Overall Rating in `display-02` monospace inside a badge shaped like a cricket ball seam-circle. Tier gradient border wraps the card frame; ambient `glow-tier` blurred behind it.

**Stat bars:** horizontal progress bars using `mono-stat` value on the right, filled with `--green-core`→`--blue-core` gradient, animated fill-in on first view (staggered 60ms per bar).

**Empty State:** N/A (page requires a generated card) — but "card still generating" interstitial reuses Loading Screen concepts (§8).
**Loading State:** Card outline skeleton with shimmering seam-stitch pattern; stat bars appear as pulsing gray tracks.
**Hover State:** Card lifts (`e3`→`e4`), tilt engages, achievement badges get a tooltip on hover with the "GitHub stat translated" explanation.
**Responsive:** Below `md`, card and stats stack vertically, tilt interaction disabled in favor of tap-to-flip (front = card, back = detailed stats).
**Accessibility:** All stat bars have text equivalents read by screen readers ("Runs: 4,812 out of a possible 5,000"); tilt/parallax respects reduced motion; download/share buttons have clear labels, not icon-only without text on mobile.

---

### 2.4 Theme Gallery
**Purpose:** Browse and pick alternate card skins (ICC, IPL, Retro, Cyber, Glass, etc.)

**Layout:** Masonry/grid of theme preview cards (3-up desktop, 1-up mobile), each preview showing the *same* sample player rendered in that theme, with a "Apply to my card" primary button on hover.

**Filter bar:** pill-tabs — All / Free / Premium / Seasonal, plus a rarity-tier filter.

**Empty State:** If filtered to zero results — "No themes match — try clearing filters."
**Loading:** Skeleton grid of rounded rectangles with shimmering diagonal sweep.
**Hover:** Card scales 1.03, other cards dim to 85% opacity (spotlight effect), a "Preview" ghost button fades in.
**Responsive:** Grid collapses 3→2→1 columns; filter pills become a horizontal scroll row.
**Accessibility:** Each theme card is a `<button>` with descriptive `aria-label` ("Apply Neon Cricket theme"), current selection marked with `aria-pressed`.

---

### 2.5 Achievements Page
**Purpose:** Gamified list of unlockable badges (translated GitHub milestones) — drives return visits.

**Layout:** Two-column — left rail: category filter (Consistency, Volume, Community, Rare); right: badge grid, each badge a hexagonal glass tile, locked badges shown grayscale + silhouette with unlock condition beneath, unlocked badges shown full color with a shimmer sweep and unlock date.

**Empty State:** New user with zero unlocked — hero banner "Your first badge is one commit away" with progress ring at 0%.
**Loading:** Hex tiles skeleton-pulse in place.
**Hover:** Tile tilts slightly, tooltip shows the underlying GitHub metric ("500+ stars across repos").
**Responsive:** Hex grid becomes 2-column then 1-column list with icon-left layout on mobile.
**Accessibility:** Locked/unlocked state conveyed via text ("Locked — unlock at 100 PRs"), not color alone.

---

### 2.6 About Page
**Purpose:** Trust, transparency (what data is read, that it's read-only/public GitHub data), brand story.

**Layout:** Long-form single column, max-width 720px, generous line-height (1.7), section dividers as thin gradient hairlines. Includes a "How stats are calculated" transparent mapping table (GitHub metric → Cricket stat → formula, in plain language).

**Accessibility:** Semantic headings (h1→h3 hierarchy), skip-to-content link, table has proper `<th scope>`.

---

### 2.7 404 Page
**Purpose:** Soften a dead-end, redirect to search.

**Layout:** Centered, single illustration (a batter given "OUT" by the umpire, big scoreboard reading "404"), headline "Clean Bowled." subhead "This page doesn't exist — but your card might." CTA back to search.
(10 concept variations in §12.)

---

### 2.8 Loading Screen (global, e.g. during card generation)
**Purpose:** Mask 2–6 seconds of API/data-crunch latency with delight, not anxiety.

**Layout:** Full-viewport takeover, centered animation + progressive status text ("Fetching innings... Calculating strike rate... Polishing the card...") cycling every 900ms, thin progress bar beneath pinned to real request progress where possible.
(15 concept variations in §9.)

---

### 2.9 Error Page / State
**Purpose:** Handle GitHub API failure, rate limits, invalid username, network errors — distinctly from 404.

**Layout:** Same centered single-column pattern as 404 but with an error-specific illustration (a rain-delay cricket ground cover), headline varies by error type ("Rain Stopped Play" for rate-limit/network, "No Such Player" for invalid user), a retry primary button, and a secondary "Report issue" link.
**Accessibility:** Error text is never color-only (icon + text + border), `role="alert"` on the banner variant used inline (e.g., search page).

---

## 3. Components

Grouped by function. Each entry: purpose + key states/notes.

### Navigation & Structure
- **Navbar** — 72px, glass blur, logo left, primary nav center/left, search icon + theme toggle + CTA button right. Shrinks to 56px + adds bottom hairline on scroll. (10 concepts in §11)
- **Footer** — 4-column (Product / Resources / Community / Legal), bottom bar with social icons + "Data sourced from public GitHub API" disclosure.
- **Hero** — see Landing Page. (10 concepts in §10)
- **Tabs** — underline-indicator style, indicator slides with spring easing between tabs.
- **Accordion** — chevron rotates 180° on expand, content slides with height-auto transition, only one open at a time on mobile (single-select mode) vs multi on desktop.
- **Dropdown** — glass panel, `e3`, 6px offset from trigger, items highlight with left accent bar on hover.
- **Command Palette** (⌘K) — full search across usernames/themes/pages, fuzzy match highlighting matched characters in `--green-core`.
- **Context Menu** — right-click on a card: "Copy link / Download PNG / Share / Compare."

### Search
- **Search Box** — pill-shaped, glass, icon-left, `⌘K` hint chip right-aligned, glow ring on focus. (10 concepts in §13)
- **Search Suggestions** — dropdown list, avatar + name + tier badge, arrow-key navigable.
- **GitHub Username Input** — inline validation (checkmark when valid GitHub handle format), `@` prefix always visible/locked in the input.

### Player Card System
- **Player Card** — the hero artifact; frame + tier border + glow + tilt interaction. (10 concepts in §7)
- **Player Avatar** — circular, ring colored by tier, small "verified GitHub" badge overlapping bottom-right.
- **Country Badge** — small flag chip inferred from GitHub profile location, positioned top-left of card.
- **Overall Rating** — large seam-circle badge, number in `display-02`.
- **Cricket Stats block** — labeled progress bars / stat chips, grouped Batting vs Bowling.
- **Stat Chips** — small pill, icon + label + value, used for secondary stats (e.g. "Longest Streak: 44").
- **Achievements/Badges** — hexagonal or shield-shaped icons, tier-colored.
- **Graphs** — GitHub contribution heatmap restyled as a "Run Rate over Season" line/area chart in brand gradient.
- **Progress Bars** — see above; also used generically for loading and achievement-progress.

### Actions & Feedback
- **Buttons** — primary (filled gradient), secondary (outline glass), ghost (text only), destructive (red), icon-only. (30 ideas in §14)
- **Social Buttons** — square icon buttons for X/LinkedIn/Reddit/Copy-link, each brand-colored on hover only (monochrome at rest).
- **Share Dialog** — modal with live card preview, platform buttons, and an auto-generated caption text (editable) for one-click posting.
- **Download Dialog** — format toggle (PNG / PNG-transparent / Story-ratio 9:16 / Square 1:1), resolution selector, "Download" primary button.
- **Toast** — bottom-right, slide-in + fade, auto-dismiss 4s, colored left border by type (success/error/info).
- **Tooltip** — dark glass, 4px arrow, 150ms delay-in, instant-out.
- **Modal** — centered, backdrop blur 12px + dim 60%, scale-in from 96%→100%.
- **Skeleton Loader** — shimmering diagonal gradient sweep, 1.5s loop. (10 ideas in §9)
- **Loading Spinner** — orbiting cricket ball around a stump icon, or a bat-rotation spinner (2 variants).
- **Error Banner** — inline, icon + message + optional retry link, `role="alert"`.
- **Success Banner** — same shape, green accent, auto-collapses after action confirmed.
- **Confetti** — used only on rare-tier card reveal (Diamond/Pink Diamond) — particle burst in tier gradient colors, 1.2s, respects reduced-motion (disabled → static shimmer instead).
- **Particles** — ambient background dust/light-streak particles on hero and card-reveal screens, GPU-cheap (CSS-only or canvas capped at 40 particles).

### Utility
- **Theme Switcher** — segmented control, animated pill slides between Dark/Light/System.
- **Dark Mode Toggle** — sun/moon icon morph animation on toggle (icon literally transforms via path morph, not a swap).

---

## 4. Player Card Concepts (10)

Each includes: name, visual concept, border/material, primary use, signature detail.

1. **ICC World Cup** — Deep navy + gold trophy-engraving border, embossed ICC-style seal watermark behind stats, gold foil stat labels. Signature: trophy-shaped Overall Rating badge.
2. **IPL Franchise** — Bold saturated team-color gradient background (user picks a "franchise color"), sponsor-strip footer parody area (blank/customizable), stadium floodlight bloom at top edge.
3. **Test Cricket (Whites)** — Cream/ivory card body, deep maroon accents, serif display type (nod to Lord's honours boards), matte finish, no glow — sits "printed" rather than "glowing."
4. **T20 Blitz** — Ultra-saturated neon magenta/orange gradient, diagonal motion-streak background, oversized bold stat numbers, fast shimmer border animation loop.
5. **Champions Trophy** — Metallic teal + bronze, geometric Islamic-tile-inspired border pattern (subtle, abstracted), circular medallion Overall badge.
6. **Retro Cricket (90s)** — Halftone-dot texture, CRT scanline overlay (subtle), boxy pixel-adjacent numerals for stats, sepia-tinted photo frame for avatar.
7. **Cyber Cricket** — Black glass body, circuit-trace border pattern glowing green, glitch-flicker hover state on stat reveal, monospace terminal-style stat labels (`> RUNS: 4812`).
8. **Neon Cricket** — Deep purple-black body, hot-pink/electric-blue double-neon-tube border (outer glow + inner glow), stat bars rendered as neon tube fills.
9. **Minimal White** — Pure white card, single hairline border, black type only, no gradients/glow at all — the "quiet flex" card for a stark portfolio-site aesthetic.
10. **Glass Card** — Fully translucent frosted-glass body over a blurred stadium-photo background, thin 1px light border, all content in white text with soft shadow for legibility — most "premium tech" feeling of the set.

Tier system (Bronze/Silver/Gold/Diamond/Pink Diamond) is an *overlay* system applied across all 10 concepts — it changes the border gradient + ambient glow + a small corner rarity gem icon, independent of which visual concept the user picked.

---

## 5. Landing Page Hero Concepts (10)

1. **Floating 3D Card** — Headline left, tilting player card right, mouse-parallax. (as detailed in §2.1)
2. **Split Stat Reveal** — Left: headline. Right: a single giant animated number counting up (e.g., "4,812 RUNS") that then morphs into the full card.
3. **Stadium Lights Sweep** — Full-bleed dark hero, two diagonal floodlight beams sweep across on load, headline sits in the light intersection.
4. **Terminal-to-Card Morph** — Opens showing a fake terminal typing `gitcric generate torvalds`, which then dissolves/build into the visual card — appeals to the dev audience directly.
5. **Card Wall Parallax** — Dozens of small cards tiled in the background at low opacity, scroll/mouse creates parallax depth, headline centered on top glass panel.
6. **Scoreboard Hero** — Headline styled as a cricket stadium scoreboard (segmented-LED font accents for numbers only), live ticking demo stats.
7. **Single Bold Statement** — Just massive centered type (no card visual at all), "GITHUB. TRANSLATED." — input box directly beneath — most minimal/Apple-like option.
8. **Video Loop Backdrop** — Muted, slow-motion stadium/crowd bokeh loop behind glass headline panel (performance budget: <2MB, lazy-loaded).
9. **Comparison Split-Screen** — Left half shows a plain GitHub profile (grayscale), right half shows the same profile as a glowing gold card — a literal before/after hero.
10. **Interactive Live Demo** — Hero contains a real, tiny functional search box that generates an actual mini-preview card inline before the user even leaves the hero — reduces friction to first "wow" to zero.

---

## 6. Navbar Concepts (10)

1. **Classic Glass Bar** — logo, centered links, right CTA, blurred background, hairline bottom border.
2. **Floating Pill Navbar** — navbar detached from the top edge with 16px margin, rounded-full container, shrinks in width on scroll.
3. **Split Logo Navbar** — logo dead-center, nav links split left/right of it symmetrically.
4. **Command-first Navbar** — no visible link list at all; just logo + a prominent ⌘K search trigger + avatar — everything routes through command palette.
5. **Scoreboard-style Navbar** — thin ticker beneath the main bar showing live rotating stats ("⚡ 128 cards generated in the last hour").
6. **Sidebar Nav (app-mode)** — for logged-in/dashboard-style views: collapsible left icon-rail sidebar instead of top bar.
7. **Transparent-to-Solid on Scroll** — fully transparent over hero, crossfades to glass-solid + shadow once user scrolls past hero.
8. **Mega-menu Navbar** — "Themes" link opens a full-width dropdown preview grid of card themes.
9. **Bottom Tab Bar (mobile-first)** — for mobile, primary nav lives as a fixed bottom bar (Search / Gallery / Achievements / Profile), iOS-app-like.
10. **Minimal Text-only Navbar** — no icons at all, just refined serif/mono wordmark + 3 text links, ultra-restrained, Apple-newsroom-like.

---

## 7. Search UI Concepts (10)

1. **Centered Command Bar** — as in §2.2, ⌘K-styled, glass, centered.
2. **Inline Hero Search** — search box embedded directly inside the hero (Landing).
3. **Full-bleed Takeover Search** — clicking a small nav search icon expands to a full-screen search overlay with blurred backdrop.
4. **Autocomplete Card Preview** — as user types, a live miniature player-card preview renders beside the suggestion list in real time.
5. **Voice-style Animated Placeholder** — placeholder text cycles through example usernames with a typewriter animation when idle.
6. **Recent + Trending Split Panel** — two-column suggestion panel: "Recently viewed" left, "Trending now" right.
7. **QR/Share-based Search** — secondary entry: paste a shared GitCric link or scan a QR from someone's shared card to jump straight to their card.
8. **Compare Mode Search** — dual input fields side-by-side ("@user1 vs @user2") for a head-to-head stat comparison feature.
9. **Browser-Extension-Style Quick Search** — a floating pill widget (like a Spotlight search) triggerable from anywhere in the app via keyboard shortcut.
10. **Category-filtered Search** — search box with attached filter chips (Language: JS/Py/Go, Region, Followers range) for discovery-oriented browsing rather than exact-username lookup.

---

## 8. Button Ideas (30)

**Primary actions**
1. Solid green→blue gradient fill, white text, subtle inner top highlight (glass sheen).
2. Gold gradient fill for premium/upgrade actions specifically.
3. Gradient-border only (transparent fill), fills solid on hover.
4. Pill-shaped with a small trailing arrow icon that slides right 4px on hover.
5. "Magnetic" button — cursor proximity subtly pulls the button toward it before click.
6. Split button — primary action + small caret for secondary options.
7. Loading-integrated button — spinner replaces label text in place, same width (no layout shift).
8. Success-morph button — on successful action, label crossfades to a checkmark + green flash, then reverts after 1.5s.
9. Icon-leading button with icon in a slightly darker inset circle.
10. Glow-pulse CTA — idle animation of a slow breathing glow to draw the eye (used sparingly, once per page max).

**Secondary / Ghost**
11. Glass outline button, blurred translucent fill, border brightens on hover.
12. Text-only ghost button with animated underline drawing in on hover.
13. Icon-only ghost button, tooltip on hover, background tint appears on hover only.
14. Chip/pill toggle button (for filters) — inactive: outline; active: filled + checkmark.
15. Segmented control button group, active segment slides via a shared pill background.

**Destructive / Warning**
16. Red-outline default, fills solid red only on hover (prevents accidental visual alarm).
17. Two-step confirm button — first click morphs label to "Are you sure?", second click executes.

**Social / Share**
18. Brand-icon square buttons, grayscale at rest, full brand color on hover.
19. "Copy link" button with icon morph link→checkmark on click, tooltip "Copied!" for 2s.
20. Native share-sheet trigger button (mobile) using OS share icon convention.

**Card-specific**
21. "Download Card" button with a small progress ring filling as the PNG renders.
22. "Compare" button that on click animates two card silhouettes sliding together.
23. Tier-colored button that inherits the user's current card tier gradient (personalization touch).
24. Floating action button (FAB), bottom-right on Player Card page for quick-share, expands into a radial menu.
25. "Regenerate" button with a refresh-icon that does a full 360° spin on click.

**Navigation**
26. Back button — arrow + label, arrow nudges left 2px on hover.
27. "Scroll to top" floating circular button, fades in after 400px scroll, cricket-ball icon.
28. Breadcrumb-as-button trail with `/` separators, current page non-interactive/bold.
29. Pagination buttons styled as small stadium-scoreboard segments.
30. Skip-link button (accessibility) — visually hidden until keyboard-focused, then slides into view top-left.

---

## 9. Loading Screen Ideas (15)

1. **Bowling Run-up** — a minimalist line-art bowler animates a run-up and delivery loop while stats load.
2. **Scoreboard Flicker** — segmented-display numbers flicker/cycle randomly before settling on real stats.
3. **Pitch Reveal** — camera-style zoom from a blurred stadium overhead shot into focus.
4. **Ball Seam Spinner** — a cricket ball rotates showing its seam stitching as the spinner, centered.
5. **Building Card Layers** — the player card visibly assembles piece by piece (frame → avatar → stats → glow) in sequence.
6. **Commit Graph Sweep** — a GitHub-style contribution heatmap draws in cell-by-cell, then morphs into a run-rate line chart.
7. **Progress-as-Overs** — progress bar is styled as cricket "overs" ticking (0.1, 0.2 ... 6.0) instead of a percentage.
8. **Floodlight Power-up** — stadium floodlights switch on one by one, illuminating more of the dark screen as loading progresses.
9. **Umpire Signal Cycle** — small umpire-hand-signal icons (four, six, out) cycle as playful loading iconography.
10. **Typewriter Status Line** — single line of status text types/erases/retypes ("Reading commits… Calculating strike rate…").
11. **Particle Convergence** — floating dust particles converge into the shape of a cricket bat, then dissolve into content.
12. **Skeleton-first, no spinner** — no dedicated loading screen at all; content skeleton (§ below) appears instantly instead.
13. **Countdown Overs Clock** — a circular clock face styled like a stopwatch counts down "1 over remaining."
14. **Pulse Ring Avatar** — user's GitHub avatar (fetched first, fastest) appears immediately with a pulsing ring while the rest loads around it.
15. **Confetti-anticipation Tease** — screen dims and a single spotlight circle roams, hinting at the reveal about to happen (used specifically before rare-tier reveals).

---

## 10. Skeleton Ideas (10)

1. Card-shaped skeleton block with a diagonal shimmer sweep, tier-color-agnostic gray.
2. Stat-bar skeletons — gray pill tracks with a subtle pulse opacity (no shimmer, just breathing).
3. Avatar circle skeleton with soft pulsing ring.
4. Text-line skeletons in varied widths (last line shorter) to mimic natural paragraph shape.
5. Grid-of-cards skeleton (Theme Gallery) — uniform rounded rectangles, staggered shimmer delay per item for a wave effect.
6. Table-row skeleton (leaderboard/comparison views) — alternating row shimmer.
7. Achievement hex-tile skeletons — hexagon shape maintained, not simplified to a square.
8. Chart skeleton — animated flat baseline that "grows" into random bar heights before real data swaps in.
9. Navbar skeleton — used only on first cold load, thin gray bars where logo/links will be.
10. Progressive reveal skeleton — skeleton fades out region-by-region as each piece of real data arrives (rather than all-at-once swap).

---

## 11. Empty State Ideas (20)

1. Search page, pre-search: bat leaning on a stump illustration, "Every legend starts with a search."
2. Search, no results: broken stump illustration, "No player found — check the spelling of that username."
3. Achievements, zero unlocked: empty trophy shelf illustration, progress ring at 0%.
4. Theme Gallery, filters return nothing: empty stadium seats illustration, "No themes match your filters."
5. Comparison feature, only one user entered: silhouette placeholder card with a "+" to add a second player.
6. Card history/saved cards, none saved: empty wallet/locker illustration, "Cards you generate will appear here."
7. Notifications, none: quiet scoreboard at rest illustration.
8. Leaderboard, user unranked: "You haven't played an innings yet" with CTA to generate first card.
9. Share dialog, no caption generated yet: skeleton text lines with a "Generate caption" button.
10. Offline state: rain-covered pitch illustration, "It's rain-delayed — check your connection."
11. Profile, private/no public repos: "This player's stats are off the record" (GitHub profile has nothing public to read).
12. Search suggestions, before 2 characters typed: subtle hint text "Keep typing to find a player."
13. Achievements category filter, empty category: "Nothing here yet in Rare — these are the toughest to unlock."
14. Team/Org feature (future), no team created: pitch-diagram illustration, "Build your first XI."
15. Download history, empty: blank card frame outline, "Your downloads will show up here."
16. Error boundary fallback (React crash-guard): calm "Bad light stopped play" illustration, reload button.
17. First-time visitor global tooltip/empty dashboard: a guided single-arrow pointing at the search bar, "Start here."
18. API rate-limited empty state (temporary): hourglass/stopwatch illustration, "Catching our breath — try again in a minute."
19. Mobile share-sheet, no apps available: plain text fallback, "Copy link instead," button.
20. Retired/deleted GitHub account: gravestone-adjacent but tasteful "Retired from the game" cricket-pavilion illustration.

---

## 12. 404 Page Ideas (10)

1. **Clean Bowled** — stumps knocked over illustration, "This page got clean bowled."
2. **LBW** — umpire raising finger illustration, "Looks like you were LBW — page doesn't exist."
3. **Rain Stopped Play** — covered pitch, tarps, "Play suspended — this page isn't on the field."
4. **Lost Ball Over the Boundary** — ball flying off-illustration into the crowd, "That page went out of the park — and got lost."
5. **Wrong Ground** — stadium signage pointing the wrong way, "Wrong ground, mate."
6. **Scoreboard Error Code** — the "404" itself rendered as glowing scoreboard segment-display digits.
7. **Umpire's Call** — DRS-review-style graphic with "UMPIRE'S CALL: PAGE NOT FOUND."
8. **Retired Hurt** — a bench/dugout illustration, "This page has retired hurt."
9. **No Ball** — a no-ball chalk-line graphic, "That request overstepped — no page here."
10. **Minimal Type-only** — no illustration at all, just giant "404" in mono-stat type with a single line "Not out... of pages, though. Head back."

---

## 13. Animation Ideas (50)

**Page/Transition**
1. Route change cross-fade + 8px upward slide.
2. Shared-element transition: search-result avatar morphs into the full card's avatar position across navigation.
3. Page-load stagger: hero elements fade/slide in sequence (headline → subhead → input → visual), 80ms stagger.
4. Scroll-linked parallax on hero background layers.
5. Scroll-triggered section reveal (fade + 16px rise) with intersection observer, once per element.
6. Sticky navbar shrink + blur intensify on scroll.
7. Horizontal marquee auto-scroll for logo/testimonial strips, pause on hover.
8. Section divider gradient line "draws" left-to-right when scrolled into view.
9. Anchor-link smooth scroll with easing, offset for sticky nav.
10. Modal open: backdrop fade + panel scale-in from 96%, close reverses.

**Card & Stats**
11. Card tilt-on-pointer (3D perspective, max 8°, spring-return on mouse leave).
12. Card specular-highlight sweep following pointer position (foil effect).
13. Rarity reveal sequence: card flips from face-down silhouette → flash of light → full reveal, tier-dependent particle burst.
14. Stat bar fill-in animation, eased, staggered per stat row.
15. Numeric counter count-up animation for headline stats (e.g., Overall Rating ticking from 0→87).
16. Achievement badge unlock: scale-bounce-in + shimmer sweep + optional confetti for rare badges.
17. Contribution-heatmap-to-chart morph animation (cells reflow into a line chart).
18. Card-compare slide: two cards slide from off-screen to meet center for comparison mode.
19. Tier-gradient border animated slow rotation (conic-gradient spin) on hover only.
20. Card ambient glow slow "breathing" pulse (opacity 0.6↔1, 6s loop).

**Micro-feedback**
21. Button press scale-down (0.97) + ease-out release.
22. Input focus ring expand-in.
23. Toggle switch thumb slide with slight overshoot spring.
24. Checkbox check-mark path-draw animation on check.
25. Copy-to-clipboard icon morph (link icon → checkmark) with a brief scale pop.
26. Toast slide-in from edge + auto-dismiss fade-out.
27. Tooltip fade+8px-rise-in with slight delay, instant fade-out.
28. Dropdown menu items stagger-fade-in (20ms each) on open.
29. Accordion expand/collapse via animated max-height/auto with chevron rotate.
30. Tab underline indicator slides between tab positions (spring easing).

**Loading**
31. Skeleton shimmer diagonal sweep loop.
32. Spinner (ball-seam rotate) continuous loop.
33. Progress bar fill with slight overshoot bounce at completion.
34. Staggered skeleton-to-content swap (regions resolve independently as data streams in).
35. Loading-status text crossfade cycle (§9.10 typewriter variant).

**Ambient / Atmosphere**
36. Background particle drift (slow, GPU-cheap, capped count).
37. Floodlight beam sweep across hero background (slow, one-time on load).
38. Subtle grain/noise overlay animated (film-grain feel) at very low opacity.
39. Gradient background slow hue-drift (imperceptibly slow, adds life to flat dark bg).
40. Cursor-follow glow orb on dark sections (soft radial light trailing pointer, desktop only).

**Data Viz**
41. Line chart path draw-in (stroke-dashoffset animation) on scroll into view.
42. Bar chart bars grow from baseline, staggered.
43. Radial/donut chart arc sweep-in animation.
44. Hover tooltip on chart point: point scales up + tooltip fades in.
45. Chart axis labels fade in after data animates (sequenced, not simultaneous).

**Delight / Easter-egg**
46. Konami-code-style hidden trigger unlocks a special "Legend" particle explosion on the current card.
47. Long-press (or long-hover desktop) on card avatar triggers a wink/blink micro-illustration easter egg.
48. Six-o'clock/"maximum" audio-visual sting (confetti + sound, mutable) on hitting a rare Pink Diamond tier.
49. Pull-to-refresh on mobile styled as "starting a new over" animation.
50. Dark/Light toggle icon morphs sun↔moon via SVG path morphing, not a hard swap.

---

## 14. Micro-Interaction Ideas (100)

*Grouped in 10s for scannability — each is a single deliberate feedback moment.*

**Buttons & CTAs (1–10)**
1. Hover: subtle lift (`e2`→`e3`) + brightness +4%.
2. Press: scale 0.97, shadow flattens instantly.
3. Focus-visible: 2px offset ring in `--green-core`.
4. Disabled: desaturate + cursor not-allowed + tooltip explaining why.
5. Loading: label swaps to spinner, width locked (no CLS).
6. Success: brief green flash + checkmark, auto-revert.
7. Icon-leading button: icon nudges 2px on hover.
8. Long-press (mobile): subtle haptic-style scale + ripple.
9. Double-click guard: rapid re-clicks debounced, button visibly "locks" for 400ms.
10. Keyboard `Enter` on focused button: same press animation as pointer click.

**Inputs & Forms (11–20)**
11. Input focus: border glow ring expands in 120ms.
12. Valid input: small green checkmark fades in inline, right-aligned.
13. Invalid input: shake animation (2px, 3 cycles) + red border + inline message.
14. Placeholder text: opacity fades on focus rather than disappearing instantly.
15. Autofill detection: background briefly pulses to confirm to the user autofill occurred.
16. Character counter (bio/caption fields): color shifts to warning near limit, error at limit.
17. Paste detection: brief highlight flash on pasted text region.
18. Clear button (✕) fades in only once input has content.
19. Password/sensitive toggle: eye icon morphs open/closed.
20. Multi-step form: progress dots fill in sequence with a connecting line draw.

**Cards & Lists (21–30)**
21. Card hover: lift + tilt + border brightens.
22. Card list item hover: background tint fades in, left accent bar slides in from left.
23. Drag-to-reorder (future compare/saved list): item lifts with shadow, others shift to make space.
24. Swipe-to-dismiss (mobile list items): item slides + fades, background reveals delete affordance.
25. Long-press card (mobile) opens context menu with a spring-scale pop.
26. Card selection (compare mode): checkbox overlay fades in on hover, checked state adds colored ring around card.
27. Card skeleton-to-real swap: crossfade, not a hard cut.
28. Infinite scroll: new items fade+rise in as they enter viewport, not all at once.
29. Sort control change: list items animate to new positions (FLIP technique) rather than jump-cutting.
30. Empty-to-populated list transition: empty-state illustration fades out as first item fades in.

**Navigation (31–40)**
31. Navbar link hover: underline draws in from center outward.
32. Active nav link: persistent underline + slightly bolder weight.
33. Mobile menu open: hamburger icon morphs to X via rotation.
34. Mobile menu panel: slides in from right with backdrop fade.
35. Breadcrumb hover: individual segment underlines independently.
36. Back button: arrow icon nudges left on hover.
37. Scroll-to-top button: fades in/out based on scroll position, smooth-scrolls on click.
38. Tab switch: content crossfades while indicator slides (decoupled timing for polish).
39. Sidebar collapse/expand: icons re-center, labels fade rather than clip abruptly.
40. Command palette open (⌘K): backdrop blur-in + panel scale from 98%.

**Player Card interactions (41–55)**
41. Pointer-tilt on card, spring-return to flat on mouse leave.
42. Specular highlight follows pointer (foil-card feel).
43. Tap-to-flip on mobile (front/back), 3D flip animation (Y-axis rotate).
44. Stat bar hover: value tooltip appears with exact number + GitHub-source explanation.
45. Achievement badge hover: tooltip + slight icon bounce.
46. Rarity badge (corner gem) idle sparkle animation (very subtle, occasional).
47. Download button: circular progress ring fills as PNG renders, then checkmark burst.
48. Share button: opens dialog with a scale+fade-in, live preview already rendered (no additional load).
49. Regenerate/refresh stats button: icon spins 360° + card content crossfades to updated data.
50. Country flag badge hover: tooltip shows full country name.
51. Overall Rating badge: subtle pulse once on first view (draws eye), then settles.
52. Compare mode: dragging one card near another shows a "VS" glow indicator between them.
53. Long-press avatar (both platforms): playful wink micro-animation easter egg.
54. Theme switch on card page: card content crossfades to new theme skin, stats persist without re-animating.
55. Card zoom (click to enlarge): smooth scale-up with backdrop dim, click-outside to close.

**Feedback & System (56–70)**
56. Toast appear: slide+fade in, subtle bounce settle.
57. Toast dismiss: swipe-to-dismiss (mobile) or auto-timeout fade (desktop).
58. Copy link: icon morph + toast confirmation, both fire together.
59. Form submit success: entire form crossfades to a success illustration state.
60. Error banner: icon shake once on appear to draw attention (subtle, single cycle).
61. Network reconnect: toast "Back online" auto-fires when connection restored.
62. Rate-limit warning: inline countdown timer updates live ("Try again in 0:42").
63. Session/theme preference saved: small checkmark pulse near the toggle used.
64. Scroll progress indicator (thin top bar) on long pages like About.
65. Cursor-following glow orb (desktop, dark sections only) for ambient premium feel.
66. Page visibility change (tab refocus): subtle re-fade of content if data went stale.
67. Print/export triggered: brief overlay confirming export format before download starts.
68. Clipboard permission denied fallback: inline text field with pre-selected text appears instead.
69. Dark/light toggle: full-page color values crossfade over 240ms rather than hard-cutting.
70. Reduced-motion user detected: all of the above degrade gracefully to instant/opacity-only transitions.

**Gallery & Discovery (71–85)**
71. Theme gallery card hover: spotlight effect (others dim to 85%).
72. Theme gallery filter pill click: pill background slides to new active position.
73. Theme "Preview" hover reveal: ghost button fades in only on hover, not always visible.
74. Achievement hex-tile hover: slight 3D tilt + tooltip.
75. Achievement unlock (live, e.g. right after generating a card): toast + badge shelf pulse to draw attention to the new one.
76. Leaderboard row hover: row background tint + rank number slightly enlarges.
77. Trending avatars row: auto-scroll marquee pauses precisely on hover.
78. Search suggestion row hover/focus: background highlight + avatar slight scale-up.
79. Search result "no match" after debounce: illustration fades in only after a genuine empty result (not during typing).
80. Filter chip removal (✕): chip scales down and collapses width smoothly, remaining chips reflow.
81. Grid-to-list view toggle (future dense view): items animate position/shape change (FLIP), not a hard re-render.
82. Category tab counts update live with a number roll/count animation when filters change.
83. "Load more" button: replaced by an infinite-scroll spinner once first triggered.
84. Masonry grid reflow (new item added): existing items shift smoothly, not jump.
85. Comparison drag targets: valid-drop zone highlights with dashed glow border during drag.

**Delight / Ambient (86–100)**
86. Confetti burst restricted to rare-tier reveals only, capped particle count for performance.
87. Subtle parallax on decorative background shapes as user scrolls (desktop only).
88. Cursor changes to a tiny bat/ball icon over draggable/interactive card elements (playful, used sparingly).
89. First-visit tooltip walkthrough (dismissible, shown once via local flag).
90. Milestone toast when a user's *own* card crosses a stat threshold on refresh ("New personal best: 500 Runs!").
91. Seasonal theme unlock notification (e.g., World Cup season) with a distinct badge glow.
92. Sound design (optional, muted by default): soft "bat-hit" click sound on primary CTA press, toggleable in settings.
93. Idle-state ambient animation on Landing hero card (slow auto-tilt loop) when user hasn't interacted in 8s.
94. Scroll-jacked "innings summary" reveal on About page stats section (stats count up once, not repeatedly).
95. Hover on footer social icons: icon fills with brand color + tiny bounce.
96. Randomized micro-copy variations in loading status text (never feels robotic on repeat visits).
97. Card share-image generation includes a subtle animated GIF/video export option (in addition to static PNG) for social platforms that support motion.
98. "Compare with a friend" prompt appears contextually after a user views their own card for the first time.
99. Return-visit personalization: Landing page headline subtly acknowledges "Welcome back, @username" if recognized (opt-in, privacy-respecting).
100. Respect for `prefers-reduced-motion` across every single item above — the reduced set replaces movement with opacity/instant-state changes, never removing the feedback entirely.

---

## 15. Illustration Suggestions (per page)

| Page | Illustration |
|---|---|
| Landing (hero) | None needed — the 3D player card *is* the hero visual |
| Landing (how it works) | 3 simple isometric icons: magnifying glass over a GitHub mark → gears/analysis → glowing player card |
| Search (empty) | Bat leaning against a single stump, warm rim-light |
| Search (no results) | Stump knocked over, ball rolling away |
| Player Card (loading) | Card silhouette assembling from light particles |
| Theme Gallery (empty filter) | Empty stadium seating, single spotlight |
| Achievements (0 unlocked) | Empty trophy shelf with one dust-mote of light |
| About | Isometric stadium cutaway showing "data flow" from GitHub cloud icon to a floodlight-lit pitch |
| 404 | Stumps mid-collapse, ball frozen mid-air (frozen-action-shot style) |
| Error/Offline | Rain-covers over the pitch, dim floodlights |
| Onboarding/first-run | A single fielder standing ready at the boundary rope, looking toward an incoming ball of light (symbolizing "your data incoming") |

All illustrations share: isometric-flat construction, brand-limited palette, thin neon rim-light, subtle grain — never cartoonish/mascot-like, always feels like premium sports-broadcast key art.

---

## 16. Icon Pack Suggestions

- **Primary system icons:** Phosphor Icons — Duotone weight (matches glass/depth aesthetic better than pure line icons).
- **Fallback/gap-filling:** Lucide (similar stroke width, easy to reconcile visually).
- **Cricket-specific custom set** (commission or hand-build to match Phosphor's grid): bat, ball, stumps (front/side), boundary rope, helmet, pads, trophy variants (T20/ODI/Test), umpire signals (four, six, out, wide, no-ball), pitch/ground top-view.
- **Rarity gem icons:** custom faceted-gem glyphs per tier (bronze/silver/gold/diamond/pink-diamond), consistent silhouette, only the fill/gradient changes.

---

## 17. Typography Pairings

**Option A — "Modern Editorial" (recommended default)**
- Display/Headings: **Inter Tight** (700/600) — crisp, contemporary, great at large sizes.
- Body: **Inter** (400/500) — same family lower weights, seamless pairing.
- Numeric stats: **JetBrains Mono** or **IBM Plex Mono** (600, tabular figures) — gives stats a "data/scoreboard" credibility.

**Option B — "Premium Sport Broadcast"**
- Display: **Clash Display** (or **General Sans** Bold) — geometric, confident, feels like a sports-network ident.
- Body: **Satoshi** (400/500).
- Numeric: **Space Mono** or **Chivo Mono** for stat callouts.

**Option C — "Test Cricket / Heritage" (for Test Cricket & Retro card themes specifically)**
- Display: **Fraunces** or **Canela** (serif, honours-board feel).
- Body: **Inter** (keeps UI legible even when card art goes serif).
- Numeric: **Roboto Mono**.

Ship Option A as the product-wide default; Options B/C are reserved as *card-theme-specific* type overrides (so the Test Cricket card concept, for instance, actually swaps in the serif for its own stat labels while the surrounding app UI stays in Option A).

---

## 18. Complete UI Sitemap

```
/                        Landing
/search                  Search
/[username]              Player Card (canonical share URL)
/[username]/compare/[u2] Compare view
/themes                  Theme Gallery
/themes/[theme-slug]     Theme detail/preview
/achievements            Achievements (global list)
/[username]/achievements Achievements (user-specific, unlocked state)
/about                   About
/settings                Preferences (theme, motion, notifications)
/404                     Not Found
/error                   Generic error boundary
```

---

## 19. Complete Component Tree

```
App
├─ Navbar
│  ├─ Logo
│  ├─ NavLinks
│  ├─ SearchTrigger (opens CommandPalette)
│  ├─ ThemeSwitcher
│  └─ CTAButton
├─ CommandPalette (global overlay)
├─ Pages
│  ├─ Landing
│  │  ├─ Hero (+ UsernameInput, FloatingCard)
│  │  ├─ SocialProofStrip
│  │  ├─ HowItWorks (StepCard ×3)
│  │  ├─ StatMappingExplainer
│  │  ├─ CardGalleryCarousel
│  │  └─ TestimonialGrid
│  ├─ Search
│  │  ├─ SearchBox
│  │  ├─ SearchSuggestionsList
│  │  └─ TrendingRow
│  ├─ PlayerCardPage
│  │  ├─ PlayerCard
│  │  │  ├─ PlayerAvatar
│  │  │  ├─ CountryBadge
│  │  │  ├─ OverallRatingBadge
│  │  │  ├─ RarityGem
│  │  │  └─ TierGlowFrame
│  │  ├─ StatsPanel (BattingStats, BowlingStats → StatBar ×n)
│  │  ├─ AchievementsRow (BadgeHex ×n)
│  │  ├─ CareerGraph
│  │  ├─ ShareDialog
│  │  └─ DownloadDialog
│  ├─ ThemeGallery
│  │  ├─ FilterPillBar
│  │  └─ ThemePreviewGrid (ThemeCard ×n)
│  ├─ Achievements
│  │  ├─ CategoryRail
│  │  └─ BadgeGrid (BadgeHex ×n)
│  ├─ About
│  ├─ NotFound (404)
│  └─ ErrorBoundary
├─ Shared/UI
│  ├─ Button (variants)
│  ├─ Input
│  ├─ Dropdown
│  ├─ Modal
│  ├─ Toast
│  ├─ Tooltip
│  ├─ SkeletonLoader
│  ├─ Spinner
│  ├─ Accordion
│  ├─ Tabs
│  ├─ ContextMenu
│  ├─ ProgressBar
│  ├─ StatChip
│  └─ ConfettiLayer
└─ Footer
```

---

## 20. Complete Design System Summary

- **Foundations:** color tokens, type scale, spacing scale, radius scale, shadow/elevation scale — all defined in §1.
- **Themeing:** Dark-first, Light-mode as full parallel token set (not just inverted), plus 10 independent Player Card visual skins layered with 5 rarity-tier overlays = 50 total card visual permutations.
- **Grid:** 12-col desktop / 8-col tablet / 4-col mobile, defined breakpoints §1.9.
- **Motion system:** duration/easing tokens §1.10, applied consistently — no ad-hoc animation timings anywhere in the product.
- **Iconography:** Phosphor Duotone + custom cricket glyph set + custom rarity gems.
- **Illustration:** isometric-flat, brand-limited palette, per-page library in §15.
- **Accessibility baseline:** WCAG 2.1 AA minimum across all text/background pairs (verified against gradient and glass surfaces specifically, since those are the highest risk), full keyboard operability, `prefers-reduced-motion` support everywhere motion appears, no color-only state indicators.

---

## 21. Complete User Flow

```
Land on Homepage
   → Enter GitHub username
      → [Valid] → Loading screen (2–6s) → Player Card revealed
         → View stats / achievements
         → Optionally: change Theme → card re-skins instantly
         → Optionally: Compare with a friend
         → Share (dialog: platform + caption) OR Download (dialog: format/res)
         → Optionally: Explore Achievements page (own unlocked badges)
         → Optionally: Browse Theme Gallery, apply new theme, return to card
      → [Invalid username] → Inline error → retry
      → [GitHub API error/rate-limit] → Error page/banner → retry with cooldown
   → Exit via nav to About / Themes / Achievements at any point
```

---

## 22. Complete Navigation Flow

```
Global Navbar always available →
  Search (always reachable via icon or ⌘K)
  Themes
  Achievements
  About
  Theme toggle (Dark/Light)

From Player Card page →
  Back → returns to previous search context (not always Landing)
  Deep-linkable via /[username] — shareable, SEO-indexable, works with no prior navigation
  Theme change is in-place (no navigation), Compare pushes a new route segment
```

---

## 23. Complete Responsive Flow

| Breakpoint | Navbar | Hero | Player Card | Grids |
|---|---|---|---|---|
| Mobile (<744) | Bottom tab bar + slim top bar | Stacked, card below headline, tap-to-flip | Full-width, flip interaction replaces tilt | 1-column |
| Tablet (744–1024) | Standard top glass bar, condensed links | Side-by-side, reduced tilt range | Slightly reduced max-width, tilt retained | 2-column |
| Desktop (1024–1536) | Full glass bar, full link set | Full split-hero as designed | Full tilt/parallax experience | 3-column |
| Wide (1536+) | Content stays capped at 1280px, extra space as margin, not stretched components | — | — | 3–4 column, never wider individual cards |

---

## 24. Complete Motion Guidelines

1. Every animation must have a `prefers-reduced-motion` fallback (opacity/instant, never fully removed feedback).
2. No animation exceeds 1.4s except ambient/looping background effects.
3. Use `transform` and `opacity` only for anything running during scroll or on low-end devices — never animate `box-shadow`, `filter`, or layout properties on scroll-linked triggers.
4. Stagger children by 40–80ms max; anything longer feels sluggish.
5. Reserve confetti/particle bursts for genuinely rare/high-value moments (rare-tier card reveal only) — overuse cheapens the effect.
6. Every loading state must have a maximum-duration fallback (skeleton → "this is taking longer than usual" message past ~8s).
7. Hover effects must have equivalent focus-visible and touch (active-state) equivalents — motion is not a mouse-only privilege.

---

## 25. Complete Design Checklist

- [ ] All color pairs (including on gradients/glass) pass WCAG AA contrast
- [ ] Every interactive element has visible focus state
- [ ] Every icon-only control has an accessible label
- [ ] All motion respects `prefers-reduced-motion`
- [ ] Empty, loading, and error states designed for every data-dependent screen
- [ ] Card export (PNG/social formats) tested at actual target resolutions, not just in-browser
- [ ] Typography scale tested down to smallest mobile breakpoint for wrapping/truncation
- [ ] Tier-gradient borders tested against every one of the 10 card theme backgrounds for contrast
- [ ] All 5 rarity tiers visually distinct at a glance, including for color-blind users (shape/icon differentiation, not color alone)
- [ ] Skeleton states match final content dimensions (no layout shift on load)
- [ ] Every shareable card image includes attribution/watermark small enough to be tasteful, clear enough to drive brand recall
- [ ] Dark and Light mode both independently reviewed — Light is not just an inverted Dark
- [ ] Full keyboard-only pass across Search → Card → Share flow
- [ ] Reduced-data/slow-connection experience verified (skeleton-first fallback works without JS animation libraries loaded)

---

*End of GitCric Design System document.*
